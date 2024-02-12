import { Backend } from 'kuzzle';
import { WarehouseMetadata } from 'lib/modules/asset_tracking/assets/Warehouse';

import { FixturesGenerator } from '../FixturesGenerator';
import { ROADS } from './roads';

export class AssetTrackingFixtures extends FixturesGenerator {
  constructor(app: Backend) {
    super(app, 'kuzzle', 'asset_tracking');
  }

  async loadDigitalTwins() {
    await Promise.all([
      this.createAsset('Container', 'zulu'),
      this.createAsset('Container', 'yankee'),
      this.createAsset('Container', 'tango'),

      this.createAsset('Truck', 'sierra', undefined, 'sdet'),
      this.createAsset('Truck', 'romeo', undefined, 'sdet'),

      // @todo this asset does not trigger the rule creation because it's created
      // from the backend. We need global pipes
      this.createAsset<WarehouseMetadata>('Warehouse', 'IDFSud', {
        surface: 23_000,
        loadingBays: 16,
        geofence: {
          name: 'IDFSud',
          group: 'warehouse',
          disabled: false,
          perimeter: {
            type: 'Polygon',
            coordinates: [
              [
                [48.601855911857456, 2.660012258595742],
                [48.59868545002661, 2.6591147612317627],
                [48.598309789704444, 2.6617958925986045],
                [48.60145773681958, 2.662806997224749],
                [48.601855911857456, 2.660012258595742],
              ],
            ],
          },
        },
      }),
      // @todo this asset does not trigger the rule creation because it's created
      // from the backend. We need global pipes
      this.createAsset<WarehouseMetadata>('Warehouse', 'IDFNord', {
        surface: 15_000,
        loadingBays: 12,
        geofence: {
          name: 'IDFNord',
          group: 'warehouse',
          disabled: false,
          perimeter: {
            type: 'Polygon',
            coordinates: [
              [
                [49.00952957325299, 2.4838636253124946],
                [49.00600868479984, 2.483106516509082],
                [49.00582336798439, 2.4856264458095723],
                [49.00907001878247, 2.48728756512466],
                [49.00952957325299, 2.4838636253124946],
              ],
            ],
          },
        },
      }),

      this.createDevice('Abeeway', 'ABE1'),
      this.createDevice('Abeeway', 'ABE2'),
      this.createDevice('Abeeway', 'ABE3'),

      this.createDevice('Enginko', 'ENG1'),
      this.createDevice('Enginko', 'ENG2'),
      this.createDevice('Enginko', 'ENG3'),

      this.createDevice('Loka', 'LOK1'),
      this.createDevice('Loka', 'LOK2'),
      this.createDevice('Loka', 'LOK3'),
    ]);

    await this.linkAsset('Container-zulu', 'Abeeway-ABE1', [
      { device: 'position', asset: 'position' },
      { device: 'externalTemperature', asset: 'externalTemperature' },
      { device: 'internalTemperature', asset: 'internalTemperature' },
    ]);

    await this.linkAsset('Container-tango', 'Enginko-ENG1', [
      { device: 'temperature', asset: 'externalTemperature' },
    ]);
    await this.linkAsset('Container-tango', 'Enginko-ENG2', [
      { device: 'temperature', asset: 'internalTemperature' },
    ]);
    await this.linkAsset('Container-tango', 'Loka-LOK1', [
      { device: 'position', asset: 'position' },
    ]);

    await this.linkAsset('Truck-sierra', 'Loka-LOK2', [{ device: 'position', asset: 'position' }]);

    await this.groupAssets('Trucks', ['Truck-sierra', 'Truck-romeo']);

    await this.app.sdk.collection.refresh('platform', 'devices');
  }

  async resetDigitalTwins() {
    await Promise.all([
      this.deleteAsset('Container', 'zulu'),
      this.deleteAsset('Container', 'yankee'),
      this.deleteAsset('Container', 'tango'),

      this.deleteAsset('Warehouse', 'IDFSud'),
      this.deleteAsset('Warehouse', 'IDFNord'),

      this.deleteAsset('Truck', 'sierra'),
      this.deleteAsset('Truck', 'romeo'),
    ]);

    await Promise.all([
      this.deleteDevice('Abeeway', 'ABE1'),
      this.deleteDevice('Abeeway', 'ABE2'),
      this.deleteDevice('Abeeway', 'ABE3'),

      this.deleteDevice('Enginko', 'ENG1'),
      this.deleteDevice('Enginko', 'ENG2'),
      this.deleteDevice('Enginko', 'ENG3'),

      this.deleteDevice('Loka', 'LOK1'),
      this.deleteDevice('Loka', 'LOK2'),
      this.deleteDevice('Loka', 'LOK3'),
    ]);
  }

  async loadAlertRules() {
    const coldChainRule = {
      name: 'Chaîne du froid',
      description:
        'Alerte déclenchée lorsque la chaine du froid est rompue pour un conteneur frigorifique',
      filters: {
        and: [
          {
            range: {
              'asset.measures.internalTemperature.values.temperature': {
                gt: 0,
              },
            },
          },
        ],
      },
      collection: 'assets-history',
    };
    await this.app.sdk.document.createOrReplace(
      this.tenantIndex,
      'alert-rules',
      'alert-rule--cold-chain',
      coldChainRule,
    );
  }

  async loadDashboards() {
    const containersTemperatureDashboard = {
      type: 'dashboard',
      dashboard: {
        label: 'Containers temperature',
        layout: [
          {
            settings: {
              chartType: 'line',
              timeInterval: '1h',
              dataSources: [
                {
                  color: '#9F0500',
                  aggregateField: 'avg',
                  legend: 'External',
                  query: {
                    body: '{\n  "bool": {\n    "must": [\n      { "term": {"asset._id": "Container-zulu" } },\n      { "term": {"asset.measureName": "externalTemperature" } }\n    ]\n  }\n}',
                  },
                  measureField: 'values.temperature',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: '8f1c4baf-9d2a-4b2d-aa07-7236193ae28b',
                },
                {
                  color: '#0062B1',
                  aggregateField: 'avg',
                  legend: 'Internal',
                  query: {
                    body: '{\n  "bool": {\n    "must": [\n      { "term": {"asset._id": "Container-zulu" } },\n      { "term": {"asset.measureName": "internalTemperature" } }\n    ]\n  }\n}',
                  },
                  measureField: 'values.temperature',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: '78058a1e-963f-46e7-86f2-628fef14790b',
                },
              ],
            },
            w: 6,
            moved: false,
            x: 0,
            h: 40,
            name: 'chart',
            y: 0,
            i: '791424ec-dd15-4040-99f3-b2b6b3a3e5ce',
            label: 'Container-zulu',
          },
          {
            settings: {
              chartType: 'line',
              timeInterval: '1h',
              dataSources: [
                {
                  color: '#9F0500',
                  aggregateField: 'avg',
                  legend: 'External',
                  query: {
                    body: '{\n  "bool": {\n    "must": [\n      { "term": {"asset._id": "Container-tango" } },\n      { "term": {"asset.measureName": "externalTemperature" } }\n    ]\n  }\n}',
                  },
                  measureField: 'values.temperature',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: 'ad19dcd0-4e06-4ec6-90bc-73d4ede316f6',
                },
                {
                  color: '#0062B1',
                  aggregateField: 'avg',
                  legend: 'Internal',
                  query: {
                    body: '{\n  "bool": {\n    "must": [\n      { "term": {"asset._id": "Container-tango" } },\n      { "term": {"asset.measureName": "internalTemperature" } }\n    ]\n  }\n}',
                  },
                  measureField: 'values.temperature',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: 'fd8b55ed-417d-428e-abc7-c88769f949eb',
                },
              ],
            },
            w: 6,
            moved: false,
            x: 6,
            h: 40,
            name: 'chart',
            y: 0,
            i: '30c18205-6856-456f-a15f-15ce9251f3e4',
            label: 'Container-tango',
          },
        ],
      },
    };
    await this.app.sdk.document.createOrReplace(
      this.tenantIndex,
      'config',
      'dashboard--containers-temperature',
      containersTemperatureDashboard,
    );
  }

  /**
   * We do not send payloads to devices who are linked to the same device
   * at the same time to avoid race conditions
   */
  async loadMeasures() {
    await Promise.all([
      this.generateAbeewayHistory('ABE1', 'montpellier-lyon', 7),
      this.generateAbeewayHistory('ABE2', 'montpellier-marseille', 4),
      this.generateEnginkoHistory('ENG1', 7, () => this.randomNum(15, 30)),
    ]);

    await Promise.all([
      this.generateLokaHistory('LOK1', 'lyon-paris', 7),
      this.generateLokaHistory('LOK2', 'montpellier-toulouse', 3),
    ]);

    await Promise.all([
      this.generateEnginkoHistory('ENG2', 7, () => this.randomNum(5, -10)),
      this.generateEnginkoHistory('ENG3', 2, () => this.randomNum(-5, -15)),
    ]);
  }

  private async generateAbeewayHistory(reference: string, road: keyof typeof ROADS, days: number) {
    let battery = 100;

    const points = ROADS[road];
    const minuteInterval = Math.round(60 / (points.length / 24));

    let timestamp = Date.now() - 1000 * 60 * 60 * 24 * days; // start X days ago

    // send a gps payload every hour for X days
    for (const [lat, lon] of points) {
      await this.app.sdk.query({
        controller: 'device-manager/payloads',
        action: 'abeeway',
        body: {
          deviceEUI: reference,
          lat,
          lon,
          battery: (battery -= 1),
          externalTemperature: this.randomNum(20, 35),
          internalTemperature: this.randomNum(-5, -15),
          timestamp,
        },
      });

      timestamp += 1000 * 60 * minuteInterval;
    }
  }

  private async generateLokaHistory(reference: string, road: keyof typeof ROADS, days: number) {
    let battery = 100;

    const points = ROADS[road];
    const totalMinutes = days * 24 * 60;
    const minuteInterval = Math.round(totalMinutes / points.length);

    let timestamp = Date.now() - 1000 * 60 * 60 * 24 * days; // start X days ago

    // send a gps payload every hour for X days
    for (const [lat, lon] of points) {
      await this.app.sdk.query({
        controller: 'device-manager/payloads',
        action: 'loka',
        body: {
          deviceEUI: reference,
          lat,
          lon,
          battery: (battery -= 1),
          timestamp,
        },
      });

      timestamp += 1000 * 60 * minuteInterval;
    }
  }

  private async generateEnginkoHistory(deviceId: string, days: number, generator: () => number) {
    let battery = 100;
    let timestamp = Date.now() - 1000 * 60 * 60 * 24 * days; // start X days ago

    for (let i = 0; i <= days * 24; i++) {
      await this.app.sdk.query({
        controller: 'device-manager/payloads',
        action: 'enginko',
        body: {
          deviceEUI: deviceId,
          temperature: generator(),
          battery: (battery -= 1),
          timestamp,
        },
      });

      timestamp += 1000 * 60 * 60;
    }
  }
}
