const path = require('node:path');

module.exports = {
  root: true,
  extends: ['plugin:vue-kuzzle/default', 'plugin:vue-kuzzle/base', 'plugin:vue-kuzzle/typescript'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.test.json'),
  },
  rules: {
    'vue/no-setup-props-destructure': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/restrict-plus-operands': ['off'],
  },
  ignorePatterns: ['dist/*'],
};
