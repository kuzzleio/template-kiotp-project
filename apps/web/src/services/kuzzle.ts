import Vue from 'vue';
import { Kuzzle, Observer } from 'kuzzle-sdk';
import { VueKuzzle } from 'vue-plugin-kuzzle';

import config from '../config';
Vue.use(VueKuzzle, { backends: config.backends });

export const kuzzle = Vue.prototype.$kuzzle as Kuzzle;
export const observer = new Observer(kuzzle);

// ! Fix unwanted triggered events on window refresh
// This behavior should be added in kuzzle-sdk package to clean listener before unload
window.addEventListener('beforeunload', () => {
  kuzzle.removeAllListeners('disconnected');
});
