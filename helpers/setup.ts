import { beforeEachTruncateCollections } from './collections';
import { beforeAllCreateTenants } from './tenants';
import { useSdk } from './useSdk';

export function setupHooks() {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
    await beforeAllCreateTenants(sdk);
  });

  beforeEach(async () => {
    await beforeEachTruncateCollections(sdk);
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  return sdk;
}
