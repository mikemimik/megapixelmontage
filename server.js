import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyEnv from "@fastify/env";

import PluginCache from "./utils/plugin-cache.js";
import PluginSpaceAccess from "./utils/plugin-space-access.js";

import createGroups from "./utils/util-createGroups.js";

const server = Fastify({
  logger: process.argv.includes("--dev")
    ? { transport: { target: "@fastify/one-line-logger" } }
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
  ttl: 60 * 60 * 1_000 * 72, // 72 hours
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
        await this.getObject(item.name);
      }
    }
  },
});

await server.register(FastifyVite, {
  root: import.meta.dirname, // where to look for vite.config.js
  dev: process.argv.includes("--dev"),
  renderer: "@fastify/react",
});

// INFO: initialise vite
await server.vite.ready();

// INFO: hydrate cache
await server.space.hydrate();

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

server.get("/invalidate-cache", async (_req, reply) => {
  server.cache.clear();

  // TODO: limit the number of times this can happen
  // TODO: probably protect this endpoing
  return reply.code(200).send({ cache: "clear" });
});

await server.listen({ host: "0.0.0.0", port: server.getEnvs().PORT });
