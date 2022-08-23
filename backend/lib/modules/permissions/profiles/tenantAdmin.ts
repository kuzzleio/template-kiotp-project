export const tenantAdmin = {
  policies: [
    {
      roleId: 'default',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
    {
      roleId: 'reader',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
    {
      roleId: 'writer',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
    {
      roleId: 'assets_admin',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
    {
      roleId: 'devices_admin',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
    {
      roleId: 'users_admin',
      restrictedTo: [
        {
          index: '{tenantIndex}',
        },
        {
          collections: ['frame-reference'],
          index: 'platform',
        },
      ],
    },
  ],
};
