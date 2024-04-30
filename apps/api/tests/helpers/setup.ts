import { useSdk } from './useSdk';

export function setupHooks() {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  return sdk;
}
