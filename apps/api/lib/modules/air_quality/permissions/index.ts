import { ProfileTenantAdmin, ProfileTenantReader } from '@kuzzleio/iot-platform-backend';
import { MultiTenancyPlugin } from '@kuzzleio/plugin-multi-tenancy';

import { IoTApplication } from '../../../IoTApplication';

export function registerPermissionsModule(app: IoTApplication) {
  const multiTenancy = app.plugin.get<MultiTenancyPlugin>('multi-tenancy');

  multiTenancy.registerProfilesTemplates('air_quality', {
    [ProfileTenantAdmin.name]: ProfileTenantAdmin.definition,
    [ProfileTenantReader.name]: ProfileTenantReader.definition,
  });
}
