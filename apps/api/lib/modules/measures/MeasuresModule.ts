import { Module } from '@kuzzleio/iot-platform-backend';
import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { sampleMeasureDefinition } from './SampleMeasurement';

export class MeasuresModule extends Module {
  register(): void {
    const deviceManager = this.app.plugin.get<DeviceManagerPlugin>('device-manager');

    // register measures here
    deviceManager.models.registerMeasure('SampleMeasure', sampleMeasureDefinition);
  }
}
