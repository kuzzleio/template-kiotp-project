import { useSdk } from './useSdk';

export function setupHooks() {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
    await sdk.auth.login('local', { username: 'test-admin', password: 'password' });
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  return sdk;
}
