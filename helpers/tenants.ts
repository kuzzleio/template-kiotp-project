import { Kuzzle } from 'kuzzle-sdk';

async function createTenantIfNotExists(sdk: Kuzzle, group: string, name: string) {
  const { result } = await sdk.query<any, any>({
    controller: 'multi-tenancy/tenant',
    action: 'exists',
    name,
    group,
  });

  if (result.exists) {
    return;
  }

  await sdk.query({
    controller: 'multi-tenancy/tenant',
    action: 'create',
    name,
    group,
  });
}

export async function beforeAllCreateTenants(sdk: Kuzzle) {
  await Promise.all([createTenantIfNotExists(sdk, 'asset_tracking', 'kuzzle')]);
}
