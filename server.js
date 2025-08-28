import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyEnv from "@fastify/env";
import FastifyRateLimit from "@fastify/rate-limit";

import PluginCache from "./utils/plugin-cache.js";
import PluginSpaceAccess from "./utils/plugin-space-access.js";

import createGroups from "./utils/util-createGroups.js";

const server = Fastify({
  logger: process.argv.includes("--dev")
    ? {
        transport: { target: "@fastify/one-line-logger" },
        level: "debug",
      }
    : true,
});

await server.register(FastifyEnv, {
  dotenv: true,
  schema: {
    type: "object",
    required: [
      "PORT",
      "DO_SPACE_ACCESS_KEY_ID",
      "DO_SPACE_SECRET_KEY",
      "DO_SPACE_BUCKET",
    ],
    properties: {
      PORT: {
        type: "string",
      },
      DO_SPACE_ACCESS_KEY_ID: {
        type: "string",
        nullable: false,
        minLength: 1,
      },
      DO_SPACE_SECRET_KEY: {
        type: "string",
        nullable: false,
        minLength: 1,
      },
      DO_SPACE_BUCKET: {
        type: "string",
        nullable: false,
        minLength: 1,
      },
    },
  },
});

await server.register(PluginCache, {
  ttl: 60 * 60 * 1_000 * 12, // 12 hours
});

// INFO: must be registered *after* `PluginCache`
await server.register(PluginSpaceAccess, {
  endpoint: "https://tor1.digitaloceanspaces.com",
  region: "tor1",
  accessKeyId: server.getEnvs().DO_SPACE_ACCESS_KEY_ID,
  secretAccessKey: server.getEnvs().DO_SPACE_SECRET_KEY,
  bucket: server.getEnvs().DO_SPACE_BUCKET,

  // INFO: need `function` declaration because need access to `this`
  hydrateCache: async function hydrate() {
    // INFO: `this` context: SpaceAccess class instance
    const objects = await this.listObjects();

    if (objects && objects.length) {
      const groups = createGroups(objects);

      const groupsCacheKey = "image:groups";
      this.fastify.cache.set(groupsCacheKey, groups);

      for (const [key, value] of Object.entries(groups)) {
        const cacheKey = `image:group:${key}`;
        this.fastify.cache.set(cacheKey, value);
        this.cacheGroupKey.add(cacheKey);
      }

      for (const item of groups.all) {
        const value = await this.getObject(item.name);
        this.fastify.cache.set(item.name, value);
      }
    }
  },
});

await server.register(FastifyRateLimit, {
  global: false,
  max: 50,
  timeWindow: "1 hour",
});

await server.register(FastifyVite, {
  root: import.meta.dirname, // where to look for vite.config.js
  dev: process.argv.includes("--dev"),
  renderer: "@fastify/react",
});

// INFO: add rate limiting to 404 handler
server.setNotFoundHandler(
  { preHandler: server.rateLimit() },
  (request, reply) => {
    return reply.code(404).send({
      message: `${request.method}:${request.url} - not found`,
      error: "Not Found",
      statusCode: 404,
    });
  },
);

// INFO: initialise vite
await server.vite.ready();

// INFO: hydrate cache
await server.space.hydrate();

server.cache.on("cache:invalidation", (data) => {
  server.log.info({ data }, "cache has been invalidated");

  // INFO: if already hydrating; bailout
  if (server.space.hydrating) {
    server.log.info({}, "hydrating cache inprogress");
    return;
  }

  // INFO: using '.then' because callback to '.on' methods for events don't
  // support async/await functions.
  server.space
    .hydrate()
    .then(() => {
      server.log.info({}, "rehydrate complete");
    })
    .catch((err) => {
      // INFO: log the error but we can't throw here as it will kill the server
      server.log.error({ err }, "failed to rehydrate cache");
    });
});

server.get("/healthcheck", async (_req, reply) => {
  try {
    const isReady = await server.ready();

    if (isReady) {
      return reply.code(200).send({ health: "ok" });
    } else {
      return reply.code(503).send({ health: "not-ready" });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
});

server.get(
  "/hydrate",
  {
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "30 minutes",
        groupId: "cache-hydration",
      },
    },
  },
  async (_req, reply) => {
    await server.space.hydrate();

    return reply.code(200).send({ hydrate: true });
  },
);

server.get(
  "/invalidate-cache",
  {
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "30 minutes",
        groupId: "cache-hydration",
      },
    },
  },
  async (_req, reply) => {
    server.cache.clear();

    // TODO: probably protect this endpoing
    return reply.code(200).send({ cache: "clear" });
  },
);

await server.listen({ host: "0.0.0.0", port: server.getEnvs().PORT });
