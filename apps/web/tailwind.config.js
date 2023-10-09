import config from '@kuzzleio/iot-platform-frontend/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/frontend/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
};
