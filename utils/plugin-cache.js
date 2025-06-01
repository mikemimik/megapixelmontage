import fp from "fastify-plugin";
import TTLCache from "@isaacs/ttlcache";

// INFO: Cache Plugin
class Cache {
  constructor(options) {
    const { log, ...cacheOptions } = options;

    // INFO: set logger to use
    this.log = log;

    // INFO: create cache instance
    this.cache = new TTLCache({
      ttl: 60 * 60 * 1_000 * 1, // one hour
      updateAgeOnGet: true,
      dispose(value, key, reason) {
        this.log.info({ value, key, reason }, `cache:displose - ${key}`);
      },
      ...cacheOptions,
    });
  }

  set(key, value) {
    return this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}

function plugin(fastify, options, done) {
  fastify.decorate(
    "cache",
    new Cache({
      ...options,
      log: fastify.log.child({ log_type: "plugin:cache" }),
    }),
  );

  done();
}

const pluginCache = fp(plugin, {
  fastify: "5.x",
  name: "plugin-ttlcache",
});

export default pluginCache;
