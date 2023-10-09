import { DeviceContent } from "kuzzle-device-manager";

import { useSdk, truncateCollection } from "../../../../../helpers";

jest.setTimeout(30000);

describe("IneoSenseACSSwitch", () => {
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

  it("should decode temperature, humidity and battery measures", async () => {
    await sdk.query({
      controller: "device-manager/payloads",
      action: "ineo-sense-acs-switch",
      body: {
        deviceInfo: {
          devEui: "70b3d56371d4bd95",
        },
        data: "YgXDTs4DBAEAAAAAAAAAACMTACoA+LYCHPltZA==",
        time: "2023-03-16T13:01:44.326372683+00:00",
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      "platform",
      "devices",
      "IneoSenseACSSwitch-70b3d56371d4bd95",
    );

    expect(device._source.measures.temperature).toMatchObject({
      measuredAt: 1678971704326,
      values: {
        temperature: 19,
      },
    });

    expect(device._source.measures.humidity).toMatchObject({
      measuredAt: 1678971704326,
      values: {
        humidity: 42,
      },
    });

    expect(device._source.measures.battery).toMatchObject({
      measuredAt: 1678971704326,
      values: {
        battery: 65,
      },
    });
  });
});
