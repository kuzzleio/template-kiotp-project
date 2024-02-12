import { KuzzleProfile } from '@kuzzleio/iot-platform-backend';

/**
 * Users with this profile can read main resources of the tenant and administrate digitaltwins they belongs to.
 *
 * They don't have access to the tenant's users.
 */
export const ProfileTestSoftTenant: KuzzleProfile = {
  name: 'TestSoftTenant',
  definition: {
    policies: [
      {
        roleId: 'tenants.reader',
      },
      {
        roleId: 'functionalTests',
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
    ],
  },
};
