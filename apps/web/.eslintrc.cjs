const path = require('node:path');

module.exports = {
  root: true,
  extends: ['plugin:vue-kuzzle/default'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.test.json'),
  },
  rules: {
    // TODO refactor to enable these rules
    // ? (https://github.com/vuejs/eslint-plugin-vue/issues/2259)
    'vue/no-setup-props-destructure': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
  },
  ignorePatterns: ['dist/*'],
};
