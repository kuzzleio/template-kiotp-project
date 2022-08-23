export const tenantApi = {
  policies: [
    {
      roleId: 'reader',
      restrictedTo: [
        {
          index: '{engineIndex}',
          collections: ['assets'],
        },
      ],
    },
  ],
};
