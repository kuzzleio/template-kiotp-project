import { Kuzzle, WebSocket } from 'kuzzle-sdk';

/**
 * Singleton SDK instance
 */
let sdk: Kuzzle;
export function useSdk(): Kuzzle {
  if (!(sdk instanceof Kuzzle)) {
    sdk = new Kuzzle(new WebSocket('localhost', { port: 7512 }));
  }

  return sdk;
}
