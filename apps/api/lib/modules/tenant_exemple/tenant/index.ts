import { ProfileTenantAdmin, ProfileTenantReader } from '@kuzzleio/iot-platform-backend';
import { MultiTenancyPlugin } from '@kuzzleio/plugin-multi-tenancy';

import { IoTApplication } from '../../../IoTApplication';
export const tenantName = 'exemple_tenant';

/**
 * Users with this profile are tenant managers.
 *
 * They can manipulate every resource of the tenant they belong to, except for users.
 */
export const ProfileTenantManager = {
  name: 'tenant_manager',
  definition: {
    policies: [
      {
        roleId: 'tenants.reader',
      },
      {
        roleId: 'soft-tenants.reader',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'default',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'documents.reader',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'dashboards.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'assets.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'devices.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'measures.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'assetsGroup.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'alerts.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'alertRules.admin',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
      {
        roleId: 'payloads.all',
        restrictedTo: [
          {
            index: '{tenantIndex}',
          },
        ],
      },
    ],
  },
};

export function registerPermissionsModule(app: IoTApplication) {
  const multiTenancy = app.plugin.get<MultiTenancyPlugin>('multi-tenancy');

  multiTenancy.registerProfilesTemplates(tenantName, {
    [ProfileTenantAdmin.name]: ProfileTenantAdmin.definition,
    [ProfileTenantReader.name]: ProfileTenantReader.definition,
  });

  multiTenancy.registerProfilesTemplates(tenantName, {
    [ProfileTenantManager.name]: ProfileTenantManager.definition,
  });

  multiTenancy.registerProfilesTemplates(tenantName, {
    monProfileUtilisateur: {
      policies: [
        {
          roleId: 'documents.reader',
          restrictedTo: [
            {
              index: '{tenantIndex}',
            },
          ],
        },
        {
          roleId: 'default',
          restrictedTo: [
            {
              index: '{tenantIndex}',
            },
          ],
        },
      ],
    },
  });

  multiTenancy.registerCollectionsTemplates(tenantName, {
    ma_collection: {
      mappings: {
        properties: {
          field: { type: 'keyword' },
        },
      },
    },
  });
}
