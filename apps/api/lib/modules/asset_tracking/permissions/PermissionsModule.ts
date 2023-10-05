import { ProfileTenantAdmin, ProfileTenantReader } from '@kuzzleio/iot-platform-backend';
import { MultiTenancyPlugin } from '@kuzzleio/plugin-multi-tenancy';

import { Module } from '../../shared';

export class PermissionsModule extends Module {
  register(): void {
    const multiTenancy = this.app.plugin.get<MultiTenancyPlugin>('multi-tenancy');

    multiTenancy.registerProfilesTemplates('asset_tracking', {
      [ProfileTenantAdmin.name]: ProfileTenantAdmin.definition,
      [ProfileTenantReader.name]: ProfileTenantReader.definition,
    });
  }
}
