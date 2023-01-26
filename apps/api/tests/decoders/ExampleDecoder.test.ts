import { DeviceContent } from "kuzzle-device-manager";
import should from "should";

import { resetCollection } from "../hooks/collections";
import { getSdk } from "../hooks/getSdk";

jest.setTimeout(10000);

describe("ExampleDecoder", () => {
  const sdk = getSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  beforeEach(async () => {
    await resetCollection(sdk, "platform", "devices");
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  it("should decode temperature measure", async () => {
    await sdk.query({
      controller: "device-manager/payloads",
      action: "example",
      body: {
        deviceId: "unlinked",
        temperature: 27,
        co2: 7,
        timestamp: 1673959649017,
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      "platform",
      "devices",
      "Example-unlinked"
    );

    should(device._source.measures.temperature).match({
      measuredAt: 1673959649017,
      values: {
        temperature: 27,
      },
    });

    should(device._source.measures.co2).match({
      measuredAt: 1673959649017,
      values: {
        co2: 7,
      },
    });
  });
});
