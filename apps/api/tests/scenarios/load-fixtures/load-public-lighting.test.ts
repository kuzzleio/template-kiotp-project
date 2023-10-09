import { Kuzzle } from "kuzzle-sdk";

import { truncateCollection, useSdk } from "../../../../../helpers";

jest.setTimeout(120 * 1000);

const now = new Date().getTime();

describe("FixturesController: public lighting", () => {
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
        group: "public_lighting",
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
  it("should load all public_lighting fixtures", async () => {
    await sdk.query({
      controller: "fixtures",
      action: "load",
      tenant: "public_lighting",
    });

    await checkAssets(sdk);
  });

  // eslint-disable-next-line jest/expect-expect
  it("should allow to reset the fixtures", async () => {
    await sdk.query({
      controller: "fixtures",
      action: "load",
      tenant: "public_lighting",
    });

    await sdk.query({
      controller: "fixtures",
      action: "reset",
      tenant: "public_lighting",
    });

    await checkAssets(sdk);
  });
});

async function checkAssets(sdk: Kuzzle) {
  const streetLamp0001 = await sdk.document.get(
    "tenant-public_lighting-kuzzle",
    "assets",
    "StreetLamp-0001",
  );

  expect(streetLamp0001._source).toMatchObject({
    model: "StreetLamp",
    reference: "0001",
    linkedDevices: [
      {
        _id: "Kara-KAR1",
      },
    ],
    measures: {
      brightness: {
        originId: "Kara-KAR1",
      },
    },
    metadata: {
      street: "Rue Colin",
    },
    groups: [
      {
        id: "rue-colin",
      },
    ],
  });

  expect(typeof streetLamp0001._source.groups[0].date).toBe("number");
  expect(
    new Date(streetLamp0001._source.groups[0].date).getTime(),
  ).toBeGreaterThanOrEqual(now);

  expect(typeof streetLamp0001._source.measures.brightness.values.lumens).toBe(
    "number",
  );
  expect(
    typeof streetLamp0001._source.measures.powerConsumption.values.watt,
  ).toBe("number");

  const streetLamp0010 = await sdk.document.get(
    "tenant-public_lighting-kuzzle",
    "assets",
    "StreetLamp-0010",
  );

  expect(streetLamp0010._source).toMatchObject({
    model: "StreetLamp",
    reference: "0010",
    linkedDevices: [
      {
        _id: "Kara-KAR10",
      },
    ],
    measures: {
      brightness: {
        originId: "Kara-KAR10",
      },
    },
    metadata: {
      street: "Rue Lakanal",
    },
    groups: [
      {
        id: "rue-lakanal",
      },
    ],
  });

  expect(typeof streetLamp0010._source.groups[0].date).toBe("number");
  expect(
    new Date(streetLamp0010._source.groups[0].date).getTime(),
  ).toBeGreaterThanOrEqual(now);

  expect(typeof streetLamp0010._source.measures.brightness.values.lumens).toBe(
    "number",
  );
  expect(
    typeof streetLamp0010._source.measures.powerConsumption.values.watt,
  ).toBe("number");
}
