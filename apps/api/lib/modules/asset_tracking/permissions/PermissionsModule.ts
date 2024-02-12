import { ProfileTenantAdmin, ProfileTenantReader } from '@kuzzleio/iot-platform-backend';
import { MultiTenancyPlugin } from '@kuzzleio/plugin-multi-tenancy';

import { Module } from '../../shared';
import { ProfileTestSoftTenant } from './ProfileTestSoftTenant';
import { RoleFunctionalTests } from './RoleFunctionalTests';

export class PermissionsModule extends Module {
  register(): void {
    const multiTenancy = this.app.plugin.get<MultiTenancyPlugin>('multi-tenancy');

    this.app.import.roles({
      [RoleFunctionalTests.name]: RoleFunctionalTests.definition,
    });

    // ? Add role functional test to tenant profiles
    const functionalTestsPolicy = {
      roleId: RoleFunctionalTests.name,
    };
    ProfileTenantAdmin.definition.policies.push(functionalTestsPolicy);
    ProfileTenantReader.definition.policies.push(functionalTestsPolicy);

    multiTenancy.registerProfilesTemplates('asset_tracking', {
      [ProfileTenantAdmin.name]: ProfileTenantAdmin.definition,
      [ProfileTenantReader.name]: ProfileTenantReader.definition,
      // ? profile for tests
      [ProfileTestSoftTenant.name]: ProfileTestSoftTenant.definition,
    });
  }
}
