import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyEnv from "@fastify/env";
// TODO: add `@fastify/caching` to enable to `cache` object decorated on the
// server (to get leveraged by server side rendering)

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

server.decorate(
  "s3Client",
  new S3({
    forcePathStyle: false,
    endpoint: "https://tor1.digitaloceanspaces.com",
    region: "tor1",
    credentials: {
      accessKeyId: server.getEnvs().DO_SPACE_ACCESS_KEY_ID,
      secretAccessKey: server.getEnvs().DO_SPACE_SECRET_KEY,
    },
  }),
);

server.get("/healthcheck", async (req, reply) => {
  const isReady = await server.ready();

  if (isReady) {
    return reply.code(200).send();
  } else {
    return reply.code(503).send();
  }
});

await server.listen({ host: "0.0.0.0", port: server.getEnvs().PORT });
