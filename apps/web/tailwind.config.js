import config from '@kuzzleio/iot-platform-frontend/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
     require.resolve('@kuzzleio/iot-platform-frontend/dist/iot-platform-frontend.es.js'),
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
};
