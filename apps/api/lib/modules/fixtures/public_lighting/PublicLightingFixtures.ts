import { Backend } from 'kuzzle';
import { ApiAssetCreateRequest, ApiDeviceLinkAssetRequest } from 'kuzzle-device-manager';

import { FixturesGenerator } from '../FixturesGenerator';

export class PublicLightingFixtures extends FixturesGenerator {
  constructor(app: Backend) {
    super(app, 'kuzzle', 'public_lighting');
  }

  async loadDigitalTwins() {
    await Promise.all([
      // Rue Colin
      this.createStreetLamp('StreetLamp', '0001', { lat: 43.60219, lon: 3.8788 }, 'Rue Colin'),
      this.createStreetLamp('StreetLamp', '0002', { lat: 43.60188, lon: 3.87876 }, 'Rue Colin'),
      this.createStreetLamp('StreetLamp', '0003', { lat: 43.60169, lon: 3.8785 }, 'Rue Colin'),
      this.createStreetLamp('StreetLamp', '0004', { lat: 43.60147, lon: 3.87853 }, 'Rue Colin'),
      this.createStreetLamp('StreetLamp', '0005', { lat: 43.60123, lon: 3.87821 }, 'Rue Colin'),

      // Rue Lakanal
      this.createStreetLamp('StreetLamp', '0006', { lat: 43.61671, lon: 3.87827 }, 'Rue Lakanal'),
      this.createStreetLamp('StreetLamp', '0007', { lat: 43.61689, lon: 3.87797 }, 'Rue Lakanal'),
      this.createStreetLamp('StreetLamp', '0008', { lat: 43.61695, lon: 3.87755 }, 'Rue Lakanal'),
      this.createStreetLamp('StreetLamp', '0009', { lat: 43.61713, lon: 3.87723 }, 'Rue Lakanal'),
      this.createStreetLamp('StreetLamp', '0010', { lat: 43.61721, lon: 3.87677 }, 'Rue Lakanal'),

      this.createDevice('Kara', 'KAR1'),
      this.createDevice('Kara', 'KAR2'),
      this.createDevice('Kara', 'KAR3'),
      this.createDevice('Kara', 'KAR4'),
      this.createDevice('Kara', 'KAR5'),

      this.createDevice('Kara', 'KAR6'),
      this.createDevice('Kara', 'KAR7'),
      this.createDevice('Kara', 'KAR8'),
      this.createDevice('Kara', 'KAR9'),
      this.createDevice('Kara', 'KAR10'),
    ]);

    await Promise.all([
      this.linkStreetLamp('StreetLamp-0001', 'Kara-KAR1'),
      this.linkStreetLamp('StreetLamp-0002', 'Kara-KAR2'),
      this.linkStreetLamp('StreetLamp-0003', 'Kara-KAR3'),
      this.linkStreetLamp('StreetLamp-0004', 'Kara-KAR4'),
      this.linkStreetLamp('StreetLamp-0005', 'Kara-KAR5'),
      this.linkStreetLamp('StreetLamp-0006', 'Kara-KAR6'),
      this.linkStreetLamp('StreetLamp-0007', 'Kara-KAR7'),
      this.linkStreetLamp('StreetLamp-0008', 'Kara-KAR8'),
      this.linkStreetLamp('StreetLamp-0009', 'Kara-KAR9'),
      this.linkStreetLamp('StreetLamp-0010', 'Kara-KAR10'),
    ]);

    await this.groupAssets('Rue Colin', [
      'StreetLamp-0001',
      'StreetLamp-0002',
      'StreetLamp-0003',
      'StreetLamp-0004',
      'StreetLamp-0005',
    ]);
    await this.groupAssets('Rue Lakanal', [
      'StreetLamp-0006',
      'StreetLamp-0007',
      'StreetLamp-0008',
      'StreetLamp-0009',
      'StreetLamp-0010',
    ]);

    await this.app.sdk.collection.refresh('platform', 'devices');
  }

  async resetDigitalTwins() {
    await Promise.all([
      this.deleteAsset('StreetLamp', '0001'),
      this.deleteAsset('StreetLamp', '0002'),
      this.deleteAsset('StreetLamp', '0003'),
      this.deleteAsset('StreetLamp', '0004'),
      this.deleteAsset('StreetLamp', '0005'),
      this.deleteAsset('StreetLamp', '0006'),
      this.deleteAsset('StreetLamp', '0007'),
      this.deleteAsset('StreetLamp', '0008'),
      this.deleteAsset('StreetLamp', '0009'),
      this.deleteAsset('StreetLamp', '0010'),
    ]);

    await Promise.all([
      this.deleteDevice('Kara', 'KAR1'),
      this.deleteDevice('Kara', 'KAR2'),
      this.deleteDevice('Kara', 'KAR3'),
      this.deleteDevice('Kara', 'KAR4'),
      this.deleteDevice('Kara', 'KAR5'),
      this.deleteDevice('Kara', 'KAR6'),
      this.deleteDevice('Kara', 'KAR7'),
      this.deleteDevice('Kara', 'KAR8'),
      this.deleteDevice('Kara', 'KAR9'),
      this.deleteDevice('Kara', 'KAR10'),
    ]);
  }

  async loadDashboards() {
    const rueColinDashboard = {
      type: 'dashboard',
      dashboard: {
        label: 'Rue Colin',
        layout: [
          {
            settings: {
              chartType: 'line',
              timeInterval: '1h',
              dataSources: [
                {
                  color: '#FB9E00',
                  aggregateField: 'avg',
                  legend: 'Lumens',
                  query: {
                    body: '{\n    "bool": {\n      "filter": [\n        {\n          "term": {\n            "asset.metadata.street": "Rue Colin"\n          }\n        },\n        {\n          "term": {\n            "type": "brightness"\n          }\n        }\n      ]\n    }\n}',
                  },
                  measureField: 'values.lumens',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: '2a77e703-7e60-4fb4-97f4-dad802218d6d',
                },
              ],
            },
            w: 6,
            moved: false,
            x: 0,
            h: 40,
            name: 'chart',
            y: 40,
            i: 'a8be5ef8-ed0e-4f8a-9ad6-f777eeb7d497',
            label: 'Average Brightness',
          },
          {
            settings: {
              chartType: 'bar',
              timeInterval: '1h',
              dataSources: [
                {
                  color: '#9F0500',
                  aggregateField: 'avg',
                  legend: 'Watt',
                  query: {
                    body: '{\n    "bool": {\n      "filter": [\n        {\n          "term": {\n            "asset.metadata.street": "Rue Colin"\n          }\n        },\n        {\n          "term": {\n            "type": "powerConsumption"\n          }\n        }\n      ]\n    }\n}',
                  },
                  measureField: 'values.watt',
                  dateField: 'measuredAt',
                  collection: 'measures',
                  key: 'a1a4f1a3-ad57-452b-8065-cd30d07344e7',
                },
              ],
            },
            w: 6,
            moved: false,
            x: 6,
            h: 40,
            name: 'chart',
            y: 40,
            i: 'af49cbc7-235d-4d0c-bdee-4a695606bfc9',
            label: 'Average Consumption',
          },
          {
            settings: {
              dateStart: null,
              mapType: 'position',
              dateEnd: null,
              dataSources: [
                {
                  color: '#009CE0',
                  legend: 'Position',
                  positionField: 'metadata.position',
                  query: {
                    body: '{  "term": {\n    "asset.metadata.street": "Rue Colin"\n  }\n}',
                  },
                  dateField: '_kuzzle_info.createdAt',
                  collection: 'assets',
                  key: '44136afd-2204-4ae2-ad0a-8ebe625c729a',
                  unicityField: 'reference',
                },
              ],
            },
            w: 6,
            moved: false,
            x: 0,
            h: 40,
            name: 'map',
            y: 0,
            i: '8eff34f1-a05a-404d-84ff-e8d5d71b8c70',
            label: 'Street Lamps',
          },
          {
            settings: {
              query: {
                body: '{"bool":{"filter":[{"term":{"metadata.street":"Rue Colin"}},{"term":{"model":"StreetLamp"}}]}}',
              },
              collection: 'assets',
              fields: ['model', 'reference', 'metadata.street'],
            },
            w: 6,
            moved: false,
            x: 6,
            h: 40,
            name: 'table',
            y: 0,
            i: '3d1cb301-70d5-4a13-a271-4eda32c9d5d7',
            label: 'Street Lamps',
          },
        ],
      },
    };
    await this.app.sdk.document.createOrReplace(
      this.tenantIndex,
      'config',
      'lighting-rue-colin',
      rueColinDashboard,
    );
  }

  /**
   * We do not send payloads to devices who are linked to the same device
   * at the same time to avoid race conditions
   */
  async loadMeasures() {
    await Promise.all([
      this.generateKaraHistory('KAR1', 4),
      this.generateKaraHistory('KAR2', 4),
      this.generateKaraHistory('KAR3', 4),
      this.generateKaraHistory('KAR4', 4),
      this.generateKaraHistory('KAR5', 4),
      this.generateKaraHistory('KAR6', 4),
      this.generateKaraHistory('KAR7', 4),
      this.generateKaraHistory('KAR8', 4),
      this.generateKaraHistory('KAR9', 4),
      this.generateKaraHistory('KAR10', 4),
    ]);
  }

  async createStreetLamp(
    model: string,
    reference: string,
    position: { lat: number; lon: number },
    street: string,
  ) {
    try {
      await this.app.sdk.query<ApiAssetCreateRequest>({
        controller: 'device-manager/assets',
        action: 'create',
        engineId: this.tenantIndex,
        body: {
          model,
          reference,
          metadata: {
            position,
            street,
          },
        },
      });

      return `Create Asset: ${model}-${reference}`;
    } catch (error) {
      this.app.log.error(error);
      return error.message;
    }
  }

  async linkStreetLamp(assetId: string, deviceId: string) {
    try {
      await this.app.sdk.query<ApiDeviceLinkAssetRequest>({
        controller: 'device-manager/devices',
        action: 'linkAsset',
        engineId: this.tenantIndex,
        _id: deviceId,
        assetId,
        implicitMeasuresLinking: true,
      });

      return `Link Asset: ${assetId} to Device: ${deviceId}`;
    } catch (error) {
      this.app.log.error(error);
      return error.message;
    }
  }
  private async generateKaraHistory(deviceEUI: string, days: number) {
    let timestamp = Date.now() - 1000 * 60 * 60 * 24 * days; // start X days ago

    for (let i = 0; i <= days * 24; i++) {
      const brightness = this.getBrightness(timestamp);
      const powerConsumption = this.getPowerConsumption(brightness);

      await this.app.sdk.query({
        controller: 'device-manager/payloads',
        action: 'kara',
        body: {
          deviceEUI,
          brightness,
          powerConsumption,
          timestamp,
        },
      });

      timestamp += 1000 * 60 * 60;
    }
  }

  private getBrightness(timestamp: number) {
    const hour = new Date(timestamp).getHours();
    if (hour >= 9 && hour <= 17) {
      return 0;
    }
    if (hour >= 18 && hour <= 20) {
      return this.randomNum(2500, 2500 + 100 * (hour % 17));
    }
    if (hour >= 21 || hour <= 5) {
      return this.randomNum(3500, 3500 + 100 * (hour % 20));
    }
    if (hour >= 6 && hour <= 8) {
      return this.randomNum(2500, 2500 + 100 * (hour % 5));
    }
  }

  private getPowerConsumption(brightness: number) {
    return brightness / 15;
  }
}
