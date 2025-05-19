import Fastify from "fastify";
import FastifyVite from "@fastify/vite";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

await server.register(FastifyVite, {
  root: import.meta.dirname, // where to look for vite.config.js
  dev: process.argv.includes("--dev"),
  renderer: "@fastify/react",
});

await server.vite.ready();
await server.listen({ port: 3002 });
