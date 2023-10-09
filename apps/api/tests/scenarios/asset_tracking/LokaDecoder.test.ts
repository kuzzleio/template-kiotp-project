import { DeviceContent } from "kuzzle-device-manager";

import { useSdk, truncateCollection } from "../../../../../helpers";

jest.setTimeout(30000);

describe("LokaDecoder", () => {
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

  it("should decode position measures", async () => {
    await sdk.query({
      controller: "device-manager/payloads",
      action: "loka",
      body: {
        deviceEUI: "unlinked",
        lat: 42.42,
        lon: 21.21,
        battery: 99,
        timestamp: 1673959649017,
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      "platform",
      "devices",
      "Loka-unlinked",
    );

    expect(device._source.measures.position).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        position: {
          lat: 42.42,
          lon: 21.21,
        },
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
