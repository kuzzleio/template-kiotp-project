import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { Module } from '../../shared';

import { abeewayDeviceDefinition } from './Abeeway';
import { enginkoDeviceDefinition } from './Enginko';
import { lokaDeviceDefinition } from './Loka';

export class DevicesModule extends Module {
  register(): void {
    const deviceManager = this.app.plugin.get<DeviceManagerPlugin>('device-manager');

    deviceManager.models.registerDevice('Abeeway', abeewayDeviceDefinition);
    deviceManager.models.registerDevice('Enginko', enginkoDeviceDefinition);
    deviceManager.models.registerDevice('Loka', lokaDeviceDefinition);
  }
}
