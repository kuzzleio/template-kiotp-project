import { DeviceContent } from "kuzzle-device-manager";

import { useSdk, truncateCollection } from "../../../../../helpers";

jest.setTimeout(10000);

describe("EnginkoDecoder", () => {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  beforeEach(async () => {
    await truncateCollection(sdk, "platform", "devices");
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  it("should decode temperature measures", async () => {
    await sdk.query({
      controller: "device-manager/payloads",
      action: "enginko",
      body: {
        deviceEUI: "unlinked",
        temperature: 21,
        battery: 99,
        timestamp: 1673959649017,
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      "platform",
      "devices",
      "Enginko-unlinked",
    );

    expect(device._source.measures.temperature).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        temperature: 21,
      },
    });

    expect(device._source.measures.battery).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        battery: 99,
      },
    });
  });
});
