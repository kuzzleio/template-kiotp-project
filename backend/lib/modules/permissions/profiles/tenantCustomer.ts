export const tenantCustomer = {
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
  ],
};
