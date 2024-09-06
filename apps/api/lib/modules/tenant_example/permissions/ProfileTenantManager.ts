import { KuzzleProfile } from '@kuzzleio/iot-platform-backend';

/**
 * Users with this profile are tenant managers.
 *
 * They can manipulate every resource of the tenant they belong to, except for users.
 */
export const ProfileTenantManager: KuzzleProfile = {
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
