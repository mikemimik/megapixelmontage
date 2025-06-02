import test from "node:test";
import assert from "node:assert";

import createGroups from "./util-createGroups.js";

test("createGroups", async (t) => {
  await t.test("should return object", async (t) => {
    await t.test("if provided an empty array", async (t) => {
      const actualResult = createGroups([]);
      assert.equal(typeof actualResult, "object");
    });

    await t.test("if no argument passed", async (t) => {
      const actualResult = createGroups();
      assert.equal(typeof actualResult, "object");
    });
  });

  await t.test("should create default groups", async (t) => {
    const mockObjects = [
      {
        Key: "first",
        ETag: "sometag",
      },
    ];
    const actualResults = createGroups(mockObjects);
    assert.ok(actualResults.all, "should create 'all' group");
    assert.ok(actualResults.general, "should create 'general' group");
    assert.equal(actualResults.all.length, 1);
    assert.equal(actualResults.general.length, 1);
  });

  await t.test("should create groups based on Key parts", async (t) => {
    const mockObjects = [
      {
        Key: "first.jpg",
        ETag: "sometag",
      },
      {
        Key: "blue/",
        ETag: "sometag",
      },
      {
        Key: "blue/one.jpg",
        ETag: "sometag",
      },
    ];
    const actualResults = createGroups(mockObjects);

    console.log("actualResults:", actualResults);
    assert.ok(actualResults.all, "should create 'all' group");
    assert.ok(actualResults.general, "should create 'general' group");
    assert.ok(actualResults.blue, "should create 'blue' group");
    assert.equal(actualResults.all.length, 2);
    assert.equal(actualResults.general.length, 1);
    assert.equal(actualResults.blue.length, 1);
  });
});
