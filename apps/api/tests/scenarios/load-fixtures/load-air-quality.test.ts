import { Kuzzle } from "kuzzle-sdk";

import { truncateCollection, useSdk } from "../../../../../helpers";

jest.setTimeout(120 * 1000);

const now = new Date().getTime();

describe("FixturesController: air quality", () => {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  beforeEach(async () => {
    try {
      await sdk.query({
        controller: "multi-tenancy/tenant",
        action: "delete",
        name: "kuzzle",
        group: "air_quality",
      });
    } catch (error) {
      // nothing
    }
    await truncateCollection(sdk, "platform", "devices");
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  // eslint-disable-next-line jest/expect-expect
  it("should load all air_quality fixtures", async () => {
    await sdk.query({
      controller: "fixtures",
      action: "load",
      tenant: "air_quality",
    });

    await checkDevices(sdk);
    await checkAssets(sdk);
  });

  // eslint-disable-next-line jest/expect-expect
  it("should allow to reset the fixtures", async () => {
    await sdk.query({
      controller: "fixtures",
      action: "load",
      tenant: "air_quality",
    });

    await sdk.query({
      controller: "fixtures",
      action: "reset",
      tenant: "air_quality",
    });

    await checkDevices(sdk);
    await checkAssets(sdk);
  });
});

async function checkDevices(sdk: Kuzzle) {
  await expect(
    sdk.document.get("tenant-air_quality-kuzzle", "devices", "Airly-AIR1"),
  ).resolves.toMatchObject({
    _source: {
      assetId: "Room-CE2",
      measures: {
        temperature: {
          name: "temperature",
        },
      },
    },
  });
  await expect(
    sdk.document.get("tenant-air_quality-kuzzle", "devices", "Airly-AIR2"),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {
        temperature: {
          name: "temperature",
        },
      },
    },
  });
  await expect(
    sdk.document.get("tenant-air_quality-kuzzle", "devices", "Airly-AIR3"),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {},
    },
  });
}

async function checkAssets(sdk: Kuzzle) {
  const CE2 = await sdk.document.get(
    "tenant-air_quality-kuzzle",
    "assets",
    "Room-CE2",
  );
  expect(CE2._source).toMatchObject({
    model: "Room",
    reference: "CE2",
    linkedDevices: [
      {
        _id: "Airly-AIR1",
      },
    ],
    measures: {
      temperature: {
        originId: "Airly-AIR1",
      },
    },
    groups: [
      {
        id: "school",
      },
    ],
  });

  expect(typeof CE2._source.groups[0].date).toBe("number");
  expect(new Date(CE2._source.groups[0].date).getTime()).toBeGreaterThanOrEqual(
    now,
  );
  expect(typeof CE2._source.measures.temperature.values.temperature).toBe(
    "number",
  );

  const CM1 = await sdk.document.get(
    "tenant-air_quality-kuzzle",
    "assets",
    "Room-CM1",
  );
  expect(CM1._source).toMatchObject({
    model: "Room",
    reference: "CM1",
    linkedDevices: [],
    measures: {
      temperature: null,
    },
    groups: [
      {
        id: "school",
      },
    ],
  });

  expect(typeof CM1._source.groups[0].date).toBe("number");
  expect(new Date(CM1._source.groups[0].date).getTime()).toBeGreaterThanOrEqual(
    now,
  );
}
