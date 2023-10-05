import { Backend } from 'kuzzle';

import { FixturesGenerator } from '../FixturesGenerator';

export class AirQualityFixtures extends FixturesGenerator {
  constructor(app: Backend) {
    super(app, 'kuzzle', 'air_quality');
  }

  async loadDigitalTwins() {
    await Promise.all([
      this.createAsset('Room', 'CE2'),
      this.createAsset('Room', 'CM1'),

      this.createDevice('Airly', 'AIR1'),
      this.createDevice('Airly', 'AIR2'),
      this.createDevice('Airly', 'AIR3'),
      this.createDevice('IneoSenseACSSwitch', 'TEMP1'),
    ]);

    await this.linkAsset('Room-CE2', 'Airly-AIR1', [
      { device: 'temperature', asset: 'temperature' },
      { device: 'co2', asset: 'co2' },
      { device: 'humidity', asset: 'humidity' },
      { device: 'illuminance', asset: 'illuminance' },
    ]);

    await this.groupAssets('School', ['Room-CE2', 'Room-CM1']);

    await this.app.sdk.collection.refresh('platform', 'devices');
  }

  async resetDigitalTwins() {
    await Promise.all([this.deleteAsset('Room', 'CE2'), this.deleteAsset('Room', 'CM1')]);

    await Promise.all([
      this.deleteDevice('Airly', 'AIR1'),
      this.deleteDevice('Airly', 'AIR2'),
      this.deleteDevice('Airly', 'AIR3'),
      this.deleteDevice('IneoSenseACSSwitch', 'TEMP1'),
    ]);
  }

  async loadDashboards() {
    // nothing there
  }

  /**
   * We do not send payloads to devices who are linked to the same device
   * at the same time to avoid race conditions
   */
  async loadMeasures() {
    await Promise.all([
      this.generateAirlyHistory('AIR1', 7),
      this.generateAirlyHistory('AIR2', 7),
      this.generateAirlyHistory('AIR3', 7),
    ]);
  }

  private async generateAirlyHistory(deviceId: string, days: number) {
    let timestamp = Date.now() - 1000 * 60 * 60 * 24 * days; // start X days ago

    for (let i = 0; i <= days * 24; i++) {
      await this.app.sdk.query({
        controller: 'device-manager/payloads',
        action: 'airly',
        body: {
          deviceId,
          temperature: this.randomNum(15, 30),
          humidity: this.randomNum(50, 80),
          co2: this.randomNum(200, 800),
          illuminance: this.randomNum(6000, 9000),
          timestamp,
        },
      });

      timestamp += 1000 * 60 * 60;
    }
  }
}
