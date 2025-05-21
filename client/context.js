import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const IMAGE_LIST_KEY = "image:list";

function createGroups(objects = []) {
  const ALL = "all";
  const GENERAL = "general";

  return objects.reduce((acc, object) => {
    const parts = object.Key.split("/");

    // TODO: figure out if there is a better way to do this double assign
    const collection = parts[0];
    const first = parts[0];
    const last = parts[parts.length - 1];

    const item = {
      name: object.Key,
      tag: object.ETag,
    };

    // INFO: if filename starts with underscore, skip it
    if (first.startsWith("_")) {
      return acc;
    }

    if (!acc[ALL]) {
      acc[ALL] = [];
    }

    if (parts.length === 1) {
      if (!acc[GENERAL]) {
        acc[GENERAL] = [];
      }

      acc[GENERAL].push(item);
      acc[ALL].push(item);
      return acc;
    }

    if (Object.keys(acc).includes(collection)) {
      acc[collection].push(item);
      acc[ALL].push(item);
      return acc;
    }

    if (!last) {
      // INFO: last part is falsy
      // create the collection
      if (!acc[collection]) {
        acc[collection] = [];
      }
    }

    return acc;
  }, {});
}

export default async (ctx) => {
  console.group("context.js");
  console.log("ctx.server", !!ctx.server);
  console.groupEnd();

  if (ctx.server) {
    const { log } = ctx.server;
    const cachedGroups = ctx.server.cache.get(IMAGE_LIST_KEY);

    if (!cachedGroups) {
      log.warn(`cache miss: ${IMAGE_LIST_KEY}`);
      const bucket = ctx.server.getEnvs().DO_SPACE_BUCKET;

      const command = new ListObjectsV2Command({
        Bucket: bucket,
      });

      const response = await ctx.server.s3Client.send(command);

      if (response.Contents) {
        const groups = createGroups(response.Contents);
        ctx.server.cache.set(IMAGE_LIST_KEY, groups);
        const { all, ...rest } = groups;
        ctx.state.all = all;
        ctx.state.groups = { ...rest };
      }
    } else {
      log.info(`cache hit: ${IMAGE_LIST_KEY}}`);
      const { all, ...rest } = cachedGroups;
      ctx.state.all = all;
      ctx.state.groups = { ...rest };
    }
  }
};

export function state() {
  return {
    all: null,
    groups: null,
  };
}
