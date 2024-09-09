import { Credentials } from './user';
import { useSdk } from './useSdk';

export async function createFirstAdminIfNotExist(credentials: Credentials) {
  const sdk = useSdk();

  const { result } = await sdk.query({
    controller: 'server',
    action: 'adminExists',
    body: {},
  });

  if (result.exists) {
    return;
  }

  return sdk.security.createFirstAdmin(credentials.username, {
    credentials: {
      local: {
        username: credentials.username,
        password: credentials.password,
      },
    },
  });
}

export async function loginFirstAdmin(credentials: Credentials) {
  const sdk = useSdk();

  return sdk.auth.login(
    'local',
    {
      username: credentials.username,
      password: credentials.password,
    },
    '2h',
  );
}

export async function beforeAllAuth(credentials: Credentials) {
  await createFirstAdminIfNotExist(credentials);
  await loginFirstAdmin(credentials);
}
