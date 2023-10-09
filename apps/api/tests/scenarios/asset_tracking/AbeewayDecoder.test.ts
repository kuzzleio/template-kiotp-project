import { DeviceContent } from "kuzzle-device-manager";

import { useSdk, truncateCollection } from "../../../../../helpers";

jest.setTimeout(30000);

describe("AbeewayDecoder", () => {
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

  it("should decode position, battery and temperature measures", async () => {
    await sdk.query({
      controller: "device-manager/payloads",
      action: "abeeway",
      body: {
        deviceEUI: "unlinked",
        lat: 48.856614,
        lon: 2.3522219,
        battery: 99,
        externalTemperature: 21,
        internalTemperature: -5,
        timestamp: 1673959649017,
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      "platform",
      "devices",
      "Abeeway-unlinked",
    );

    expect(device._source.measures.position).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        position: {
          lat: 48.856614,
          lon: 2.3522219,
        },
      },
    });

    expect(device._source.measures.battery).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        battery: 99,
      },
    });

    expect(device._source.measures.externalTemperature).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        temperature: 21,
      },
    });

    expect(device._source.measures.internalTemperature).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        temperature: -5,
      },
    });
  });
});
