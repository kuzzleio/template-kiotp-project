const { defineConfig } = require('@vue/cli-service');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const TsconfigPaths = new TsconfigPathsPlugin({
  // Use custom `tsconfig.json` if is defined. Usefull to improve/extends paths resolving for repositories that use this app like development application
  configFile: process.env.TS_CONFIG,
  extensions: ['.ts', '.tsx', '.js', '.vue'],
});
const packageJson = require('./package.json');

module.exports = defineConfig({
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      if (typeof packageJson.title !== 'undefined') {
        args[0].title = packageJson.title;
      }
      if (typeof process.env.VUE_APP_TITLE !== 'undefined') {
        args[0].title = process.env.VUE_APP_TITLE;
      }
      return args;
    });

    config.plugin('fork-ts-checker').tap((options) => {
      options[0].typescript.configFile = process.env.TS_CONFIG;
      return options;
    });
  },
  productionSourceMap: process.env.NODE_ENV === 'development',
  configureWebpack: {
    // Improve sourcemap in development mode, however `source-map` in production is mandatory (if devtool is not define vue-cli add this in all case)
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
    resolve: {
      plugins: [TsconfigPaths],
    },
  },
  transpileDependencies: true,
});
