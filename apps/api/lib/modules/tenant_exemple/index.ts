import { IoTApplication } from '../../IoTApplication';
import { registerAssetsModule } from './assets';
import { registerPermissionsModule } from './tenant';

export function registerExempleTenant(app: IoTApplication) {
  registerAssetsModule(app);
  registerPermissionsModule(app);
}
