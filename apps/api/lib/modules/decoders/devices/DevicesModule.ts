import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { Module } from '../../shared';

import { NexelecCarbonDeviceDefinition } from './NexelecCarbon';
import { CityloneSLBoxDeviceDefinition } from './CityloneSLBox';
import { MilesightEM500SWLDeviceDefinition } from './MilesightEM500SWL';

export class DevicesModule extends Module {
  register(): void {
    const deviceManager = this.app.plugin.get<DeviceManagerPlugin>('device-manager');

    deviceManager.models.registerDevice('NexelecCarbon', NexelecCarbonDeviceDefinition);
    deviceManager.models.registerDevice('CityloneSLBox', CityloneSLBoxDeviceDefinition);
    deviceManager.models.registerDevice('MilesightEM500SWL', MilesightEM500SWLDeviceDefinition);
  }
}
