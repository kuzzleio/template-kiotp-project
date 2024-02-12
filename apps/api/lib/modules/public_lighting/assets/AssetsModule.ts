import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { Module } from '../../shared';

import { streetLampAssetDefinition } from './StreetLamp';

export class AssetsModule extends Module {
  register(): void {
    const deviceManager = this.app.plugin.get<DeviceManagerPlugin>('device-manager');

    deviceManager.models.registerAsset('public_lighting', 'StreetLamp', streetLampAssetDefinition);
  }
}
