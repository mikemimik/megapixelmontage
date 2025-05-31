import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyEnv from "@fastify/env";
import TTLCache from "@isaacs/ttlcache";

import { S3 } from "@aws-sdk/client-s3";

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

await server.register(FastifyVite, {
  root: import.meta.dirname, // where to look for vite.config.js
  dev: process.argv.includes("--dev"),
  renderer: "@fastify/react",
});

await server.vite.ready();

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: "https://tor1.digitaloceanspaces.com",
  region: "tor1",
  credentials: {
    accessKeyId: server.getEnvs().DO_SPACE_ACCESS_KEY_ID,
    secretAccessKey: server.getEnvs().DO_SPACE_SECRET_KEY,
  },
});

if (!server.s3Client) {
  server.decorate("s3Client", s3Client);
}

const cache = new TTLCache({
  max: 200,
  ttl: 1 * 60 * 60 * 1_000, // one hour
  updateAgeOnGet: true,
  dispose(_value, key, reason) {
    server.log.info(`cache:dispose - ${key} - ${reason}`);
  },
});

if (!server.cache) {
  server.decorate("cache", cache);
}

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
