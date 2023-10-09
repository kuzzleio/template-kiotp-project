const rootConfig = require('../../.lintstagedrc.cjs');

module.exports = {
  ...rootConfig,
  '*.{ts,vue}': ['eslint', () => 'vue-tsc --noEmit'],
};
