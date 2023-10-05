import { IoTApplication } from '../../IoTApplication';
import { registerAssetsModule } from './assets';
import { registerDevicesModule } from './devices';
import { registerPermissionsModule } from './permissions';

export function registerTenantAirQuality(app: IoTApplication) {
  registerAssetsModule(app);
  registerDevicesModule(app);
  registerPermissionsModule(app);
}
