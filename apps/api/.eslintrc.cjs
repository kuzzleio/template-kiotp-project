// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path');

module.exports = {
  root: true,
  plugins: ['kuzzle'],
  extends: ['plugin:kuzzle/default', 'plugin:kuzzle/node', 'plugin:kuzzle/typescript'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.test.json'),
  },
  rules: {
    'sort-keys': 'off',
  },
  ignorePatterns: ['dist/*'],
};
