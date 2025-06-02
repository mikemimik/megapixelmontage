/**
 * @typedef {Object} ObjectItem
 * @property {string} Key - Filename of the object
 * @property {string} ETag - Unique identifier for object
 */

/**
 * @typedef {Object} GroupedObjects
 * @property {ObjectItem[]} all - All objects grouped
 * @property {ObjectItem[]} general  - All objects grouped
 */

/**
 * Creates object with grouped values
 * @param {ObjectItem[]} objects - List of objects to group
 * @returns {GroupedObjects} Grouped objects
 */
export default function createGroups(objects = []) {
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

    // INFO: We will always receive an object for the folder. This object will
    // have a `Key` value that ends with a `/` backslash. We _should_ always
    // iterate this object before we iterate an object from inside that
    // 'folder'.
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
