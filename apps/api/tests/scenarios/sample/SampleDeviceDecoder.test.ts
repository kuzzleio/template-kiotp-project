import { DeviceContent } from 'kuzzle-device-manager';

import { setupHooks, truncateCollection } from '../../helpers';

describe('SampleDeviceDecoder', () => {
  const sdk = setupHooks();

  beforeEach(async () => {
    await truncateCollection('platform', 'devices');
  });

  it('should ba able to auto-provision and decode sample payload', async () => {
    await sdk.query({
      controller: 'device-manager/payloads',
      action: 'sample-device',
      body: {
        deviceId: 'test',
        floatValue: 27,
        textValue: 'example',
        timestamp: 1705158600000,
      },
    });

    const device = await sdk.document.get<DeviceContent>(
      'platform',
      'devices',
      'SampleDevice-test',
    );

    // ? Device exist
    expect(device).toBeDefined();

    // ? Verify measures
    expect(device._source.measures.aSampleMeasureSlot1).toMatchObject({
      measuredAt: 1705158600000,
      values: {
        aMeasure: 27,
        anotherMeasure: 'example',
      },
    });
    expect(device._source.measures.aSampleMeasureSlot2).toMatchObject({
      measuredAt: 1705158600000,
      values: {
        aMeasure: 27,
        anotherMeasure: 'example',
      },
    });
  });
});
