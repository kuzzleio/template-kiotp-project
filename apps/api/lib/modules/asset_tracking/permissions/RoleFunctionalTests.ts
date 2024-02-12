import { KuzzleRole } from '@kuzzleio/iot-platform-backend';

/**
 * Role to allow needed actions for functional tests
 */
export const RoleFunctionalTests: KuzzleRole = {
  name: 'functionalTests',
  definition: {
    controllers: {
      admin: {
        actions: {
          loadFixtures: true,
        },
      },
      fixtures: {
        actions: {
          '*': true,
        },
      },
      document: {
        actions: {
          '*': true,
        },
      },
      collection: {
        actions: {
          '*': true,
        },
      },
    },
  },
};
