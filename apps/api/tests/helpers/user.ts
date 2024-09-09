import { Kuzzle } from 'kuzzle-sdk';

type Profiles = 'tenant_reader' | 'tenant_admin' | 'TestSoftTenant';

export async function createUser(
  sdk: Kuzzle,
  profile: Profiles,
  username: string,
  softTenants: string[] | undefined = undefined,
  tenantGroup = 'asset_tracking',
  tenantName = 'kuzzle',
) {
  try {
    await sdk.security.deleteUser(username);
  } catch {
    // noop
  }

  await sdk.security.createUser(
    username,
    {
      content: {
        email: `${username}@${tenantName}.loc`,
        profileIds: [`${tenantGroup}-${tenantName}-${profile}`],
        tenants: [
          {
            name: tenantName,
            group: tenantGroup,
            index: `tenant-${tenantGroup}-${tenantName}`,
            profiles: [profile],
            softTenants: profile === 'tenant_admin' ? undefined : softTenants,
          },
        ],
      },
      credentials: {
        local: {
          username,
          password: 'password',
        },
      },
    },
    { refresh: 'wait_for' },
  );
}

export type Credentials = {
  username: string;
  password: string;
};

export const admin_user: Credentials = {
  username: 'admin',
  password: 'password',
};
