import fp from "fastify-plugin";
import {
  S3,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

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

    // INFO: hydration state
    this.hydrating = false;

    // INFO: set hydrate function
    this.hydrateCache = hydrateCache.bind(this);

    this.cacheGroupKey = new Set();
  }

  // INFO: expose hydrate function
  async hydrate(...args) {
    if (this.hydrating) {
      this.log.info({}, "hydrating cache inprogress");
      return Promise.resolve();
    }

    try {
      this.hydrating = true;
      this.log.info({}, "hydrating cache started");
      await this.hydrateCache(...args);
      this.log.info({}, "hydrating cache completed");
    } catch (err) {
      const msg = "failed to hydrate cache";
      this.log.error({ err }, msg);
      throw new PluginSpaceAccessError(msg, { cause: err });
    } finally {
      this.hydrating = false;
    }
  }

  async listObjects() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.options.bucket,
      });
      const response = await this.client.send(command);
      const { Contents, $metadata } = response;

      if ($metadata.httpStatusCode >= 300) {
        throw new Error("bad http status code", { cause: response });
      }

      const objectList = Contents.map(({ Key, ETag }) => ({ Key, ETag }));
      return objectList;
    } catch (err) {
      const msg = "failed to list objects";
      this.log.error({ err }, msg);
      throw new PluginSpaceAccessError(msg, { cause: err });
    }
  }

  async getObject(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.options.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      const { Metadata, $metadata } = response;

      if ($metadata.httpStatusCode >= 300) {
        throw new Error("bad http status code", { cause: response });
      }

      const { title = "Image Title", description = "Image Description" } =
        Metadata;

      const objectData = { title, description };

      return objectData;
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
