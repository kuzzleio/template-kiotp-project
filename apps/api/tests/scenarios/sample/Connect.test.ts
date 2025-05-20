import { Kuzzle, Http } from 'kuzzle-sdk';

describe('Connect', () => {
  let kuzzle: Kuzzle;

  beforeAll(async () => {
    kuzzle = new Kuzzle(new Http('localhost'));
    await kuzzle.connect();
  });

  it('should connect to Kuzzle backend', async () => {
    const serverInfo = kuzzle.query({
      action: 'metrics',
      controller: 'server',
    });

    await expect(serverInfo).not.toThrow();
  });
});
