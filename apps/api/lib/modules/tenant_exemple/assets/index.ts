import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { IoTApplication } from '../../../IoTApplication';

import { exempleAssetDefinition, assetModelName } from './ExempleAsset';
import { tenantName } from '../tenant';

export function registerAssetsModule(app: IoTApplication) {
  const deviceManager = app.plugin.get<DeviceManagerPlugin>('device-manager');

  deviceManager.models.registerAsset(tenantName, assetModelName, exempleAssetDefinition);
}
