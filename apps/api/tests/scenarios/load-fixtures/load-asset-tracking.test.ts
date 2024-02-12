import { Kuzzle } from 'kuzzle-sdk';

import { truncateCollection, useSdk } from '../../../../../helpers';

jest.setTimeout(120 * 1000);

const now = new Date().getTime();

describe('FixturesController: asset tracking', () => {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  beforeEach(async () => {
    try {
      await sdk.query({
        controller: 'multi-tenancy/tenant',
        action: 'delete',
        name: 'kuzzle',
        group: 'asset_tracking',
      });
    } catch (error) {
      // nothing
    }
    await truncateCollection(sdk, 'platform', 'devices');
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  // eslint-disable-next-line jest/expect-expect
  it('should load all asset_tracking fixtures', async () => {
    await sdk.query({
      controller: 'fixtures',
      action: 'load',
      tenant: 'asset_tracking',
    });

    await checkDevices(sdk);
    await checkAssets(sdk);
  });

  // eslint-disable-next-line jest/expect-expect
  it('should allow to reset the fixtures', async () => {
    await sdk.query({
      controller: 'fixtures',
      action: 'load',
      tenant: 'asset_tracking',
    });

    await sdk.query({
      controller: 'fixtures',
      action: 'reset',
      tenant: 'asset_tracking',
    });

    await checkDevices(sdk);
    await checkAssets(sdk);
  });
});

async function checkDevices(sdk: Kuzzle) {
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Abeeway-ABE1'),
  ).resolves.toMatchObject({
    _source: {
      assetId: 'Container-zulu',
      measures: {
        internalTemperature: {
          name: 'internalTemperature',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Abeeway-ABE2'),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {
        internalTemperature: {
          name: 'internalTemperature',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Abeeway-ABE3'),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {},
    },
  });

  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Enginko-ENG1'),
  ).resolves.toMatchObject({
    _source: {
      assetId: 'Container-tango',
      measures: {
        temperature: {
          name: 'temperature',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Enginko-ENG2'),
  ).resolves.toMatchObject({
    _source: {
      assetId: 'Container-tango',
      measures: {
        temperature: {
          name: 'temperature',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Enginko-ENG3'),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {
        temperature: {
          name: 'temperature',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Loka-LOK1'),
  ).resolves.toMatchObject({
    _source: {
      assetId: 'Container-tango',
      measures: {
        position: {
          name: 'position',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Loka-LOK2'),
  ).resolves.toMatchObject({
    _source: {
      assetId: 'Truck-sierra',
      measures: {
        position: {
          name: 'position',
        },
      },
    },
  });
  await expect(
    sdk.document.get('tenant-asset_tracking-kuzzle', 'devices', 'Loka-LOK3'),
  ).resolves.toMatchObject({
    _source: {
      assetId: null,
      measures: {},
    },
  });
}

async function checkAssets(sdk: Kuzzle) {
  const sierra = await sdk.document.get('tenant-asset_tracking-kuzzle', 'assets', 'Truck-sierra');
  expect(sierra._source).toMatchObject({
    model: 'Truck',
    reference: 'sierra',
    linkedDevices: [
      {
        _id: 'Loka-LOK2',
      },
    ],
    measures: {
      position: {
        originId: 'Loka-LOK2',
      },
    },
    metadata: {
      capacity: 38,
      geofencing: {
        disabled: false,
        state: null,
      },
    },
    groups: [
      {
        id: 'trucks',
      },
    ],
  });

  expect(typeof sierra._source.groups[0].date).toBe('number');
  expect(new Date(sierra._source.groups[0].date).getTime()).toBeGreaterThanOrEqual(now);

  expect(typeof sierra._source.measures.position.values.position.lon).toBe('number');
  expect(typeof sierra._source.measures.position.values.position.lat).toBe('number');

  const romeo = await sdk.document.get('tenant-asset_tracking-kuzzle', 'assets', 'Truck-romeo');
  expect(romeo._source).toMatchObject({
    model: 'Truck',
    reference: 'romeo',
    linkedDevices: [],
    measures: {
      position: null,
    },
    groups: [
      {
        id: 'trucks',
      },
    ],
  });

  expect(typeof romeo._source.groups[0].date).toBe('number');
  expect(new Date(romeo._source.groups[0].date).getTime()).toBeGreaterThanOrEqual(now);
}
