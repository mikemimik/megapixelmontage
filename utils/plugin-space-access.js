import fp from "fastify-plugin";
import { S3, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

class PluginSpaceAccessError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}

class SpaceAccess {
  constructor(fastify, options) {
    const {
      log,
      hydrateCache,
      endpoint,
      region,
      accessKeyId,
      secretAccessKey,
    } = options;

    this.fastify = fastify;

    // INFO: shallow clone options
    this.options = { ...options };

    // INFO: set logger to use
    this.log = log;

    // INFO: create client instance
    this.client = new S3({
      forcePathStyle: false,
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // INFO: set hydrate function
    this.hydrateCache = hydrateCache;

    this.cacheGroupKey = new Set();
  }

  // INFO: expose hydrate function
  async hydrate(...args) {
    try {
      this.log.info({}, "hydrating cache started");
      await this.hydrateCache(...args);
      this.log.info({}, "hydrating cache completed");
    } catch (err) {
      const msg = "failed to hydrate cache";
      this.log.info({ err }, msg);
      throw new PluginSpaceAccessError(msg, { cause: err });
    }
  }

  async listObjects() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.options.bucket,
      });
      const response = await this.client.send(command);
      const { Contents } = response;

      // INFO: cache value
      this.fastify.cache.set("", Contents);

      return Contents;
    } catch (err) {
      const msg = "failed to list objects";
      this.log.error({ err }, msg);
      throw new PluginSpaceAccessError(msg, { cause: err });
    }
  }

  async getObject(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.options.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      const { Metadata } = response;
      const { title = "Image Title", description = "Image Description" } =
        Metadata;

      const value = { title, description };

      // INFO: cache value
      this.fastify.cache.set(key, value);

      return value;
    } catch (err) {
      const msg = `failed to get object for key: ${key}`;
      this.log.error({ err }, msg);
      throw new PluginSpaceAccessError(msg, { cause: err });
    }
  }
}

function plugin(fastify, options, done) {
  fastify.decorate(
    "space",
    new SpaceAccess(fastify, {
      ...options,
      log: fastify.log.child({ log_type: "plugin:space-access" }),
    }),
  );

  done();
}

const pluginSpaceAccess = fp(plugin, {
  fastify: "5.x",
  name: "plugin-space-access",
  decorators: {
    fastify: ["cache"],
  },
  dependencies: ["plugin-ttlcache"],
});

export default pluginSpaceAccess;
