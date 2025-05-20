import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyEnv from "@fastify/env";
import { LRUCache } from "lru-cache";

import { S3 } from "@aws-sdk/client-s3";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
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

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5,
  allowStale: false,
});

if (!server.cache) {
  server.decorate("cache", cache);
}

server.get("/healthcheck", async (req, reply) => {
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

await server.listen({ host: "0.0.0.0", port: server.getEnvs().PORT });
