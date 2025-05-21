const path = require('node:path');

module.exports = {
  root: true,
  env: { jest: true },
  extends: ['plugin:vue-kuzzle/default'],
  parserOptions: { project: path.join(__dirname, 'tsconfig.test.json') },
  rules: {},
  ignorePatterns: ['dist/*'],
  settings: {},
};
