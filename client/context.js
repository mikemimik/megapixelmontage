export default async (ctx) => {
  ctx.domain = "megapixelmontage.ca";

  if (ctx.server) {
    const { log, cache, space } = ctx.server;
    log.info({ "ctx.server": !!ctx.server }, "context.js");

    for (const cacheKey of space.cacheGroupKey) {
      const [_prefix, _type, key] = cacheKey.split(":");
      if (key === "all") {
        ctx.state[key] = cache.get(cacheKey) ?? [];
      } else {
        ctx.state.groups[key] = cache.get(cacheKey) ?? [];
      }
    }
  }
};

export function state() {
  return {
    all: [],
    groups: {},
  };
}
