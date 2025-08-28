import { EventEmitter } from "node:events";
import fp from "fastify-plugin";
import TTLCache from "@isaacs/ttlcache";

// INFO: Cache Plugin
class Cache extends EventEmitter {
  constructor(options) {
    super();
    const { log, ...cacheOptions } = options;

    // INFO: required because of context switching below
    const self = this;

    // INFO: set logger to use
    this.log = log;

    // INFO: create cache instance
    this.cache = new TTLCache({
      ttl: 60 * 60 * 1_000 * 1, // one hour
      dispose(_value, key, reason) {
        self.log.info(
          { key, reason, cacheSize: self.cache.size },
          `cache:displose - ${key} - ${reason}`,
        );

        if (self.cache.size === 0) {
          self.emit("cache:invalidation", {
            cacheSize: self.cache.size,
          });
        }
      },
      ...cacheOptions,
    });
  }

  set(key, value) {
    this.log.debug({ key }, "setting key");
    return this.cache.set(key, value);
  }

  get(key) {
    this.log.debug({ key }, "getting key");
    return this.cache.get(key);
  }

  clear() {
    this.log.debug({}, "clearing cache");
    this.cache.clear();
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
