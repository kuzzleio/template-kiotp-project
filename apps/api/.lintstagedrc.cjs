const rootConfig = require('../../.lintstagedrc.cjs');

module.exports = {
  ...rootConfig,
  '*.ts': ['eslint', () => 'tsc --noEmit -p tsconfig.test.json'],
};
