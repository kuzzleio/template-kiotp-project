import { KuzzleRequest } from 'kuzzle';
import { IoTApplication } from './lib/IoTApplication';

const app = new IoTApplication();

app.pipe.register('document:beforeCreate', async (request: KuzzleRequest) => {
  const { impersonatedUser } = request.input.args;

  if (impersonatedUser !== undefined && request.getUser().profileIds.includes('admin')) {
    request.context.user = await app.sdk.security.getUser(impersonatedUser);
  }

  return request;
});
app.start();
