import { DeviceContent } from 'kuzzle-device-manager';

import { useSdk, truncateCollection } from '../../../../../helpers';

jest.setTimeout(10000);

describe('AirlyDecoder', () => {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  beforeEach(async () => {
    await truncateCollection(sdk, 'platform', 'devices');
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  it('should decode position and battery measures', async () => {
    await sdk.query({
      controller: 'device-manager/payloads',
      action: 'airly',
      body: {
        deviceId: 'unlinked',
        temperature: 27,
        humidity: 69,
        co2: 650,
        illuminance: 8500,
        timestamp: 1673959649017,
      },
    });

    const device = await sdk.document.get<DeviceContent>('platform', 'devices', 'Airly-unlinked');

    expect(device._source.measures.temperature).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        temperature: 27,
      },
    });

    expect(device._source.measures.humidity).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        humidity: 69,
      },
    });

    expect(device._source.measures.co2).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        co2: 650,
      },
    });

    expect(device._source.measures.illuminance).toMatchObject({
      measuredAt: 1673959649017,
      values: {
        illuminance: 8500,
      },
    });
  });
});
