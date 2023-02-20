const { defineConfig } = require('@vue/cli-service');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TsconfigPaths = new TsconfigPathsPlugin({
  // Use custom `tsconfig.json` if is defined. Usefull to improve/extends paths resolving for repositories that use this app like development application
  configFile: process.env.TS_CONFIG,
  extensions: ['.ts', '.tsx', '.js', '.vue'],
});

module.exports = defineConfig({
  chainWebpack(config) {
    config.plugin('fork-ts-checker').tap((options) => {
      options[0].typescript.configFile = process.env.TS_CONFIG;
      return options;
    });
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
    resolve: {
      plugins: [TsconfigPaths],
    },
  },
  transpileDependencies: true,
});
