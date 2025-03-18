import { AppConfig } from '@kuzzleio/iot-platform-frontend';
import { KuzzleProtocol } from 'vue-plugin-kuzzle';

export const appConfig: AppConfig = {
  kuzzle: {
    backends: {
      main: {
        host: 'api-main-<projectId>.paas.kuzzle.io',
        protocol: KuzzleProtocol.WEBSOCKET,
        options: {
          port: 443,
          sslConnection: true,
        },
      },
      local: {
        host: 'localhost',
        protocol: KuzzleProtocol.WEBSOCKET,
        options: {
          port: 7512,
          sslConnection: false,
        },
      },
    },
  },
  customizations: {},
  authentication: {
    type: 'keycloak',
    clientConfig: {
      authority: 'http://localhost:8080/realms/kuzzle',
      client_id: 'kiotp-front',
      response_type: 'code',
      scope: 'openid',
    },
  },
};
