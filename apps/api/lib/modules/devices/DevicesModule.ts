import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { Module } from '../shared';
import { SampleDeviceDefinition } from './SampleDevice';
export class DevicesModule extends Module {
  register(): void {
    const deviceManager = this.app.plugin.get<DeviceManagerPlugin>('device-manager');

    /* register devices décoders here */
    deviceManager.models.registerDevice('SampleDevice', SampleDeviceDefinition);
  }
}
