import type { AppConfig } from '@kuzzleio/iot-platform-frontend';
import { KuzzleProtocol } from 'vue-plugin-kuzzle';

export const appConfig: AppConfig = {
  kuzzle: {
    backends: {
      main: {
        host: 'api-main-<projectId>.paas.kuzzle.io',
        protocol: KuzzleProtocol.WEBSOCKET,
        options: { port: 443, sslConnection: true },
      },
      local: {
        host: 'localhost',
        protocol: KuzzleProtocol.WEBSOCKET,
        options: { port: 7512, sslConnection: false },
      },
    },
  },
};
