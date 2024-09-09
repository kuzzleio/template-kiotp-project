import { beforeAllAuth } from './auth';
import { admin_user } from './user';
import { useSdk } from './useSdk';

export function setupHooks() {
  const sdk = useSdk();

  beforeAll(async () => {
    await sdk.connect();
    await beforeAllAuth(admin_user);
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  return sdk;
}
