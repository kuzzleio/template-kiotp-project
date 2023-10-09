import Vue from 'vue';
import { iotPlatformPlugin } from '@kuzzleio/iot-platform-frontend';
import {
  BootstrapVue,
  BootstrapVueIcons,
  ModalPlugin,
  ToastPlugin,
  VBModal,
  VBToggle,
  VBTooltip,
} from 'bootstrap-vue';
import VueRouter from 'vue-router';

import { appDefinitions, dashboardWidgets } from './appDefinition';
import { createRouter } from './router';
import i18n from './services/i18n';
import store from './store';

import App from './App.vue';

// TODO remove when loading of svg icon are solved in package
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

// Kuzzle Vue
Vue.use(iotPlatformPlugin, { widgets: dashboardWidgets });

// BOOTSTRAP DIRECTIVEs
Vue.directive('b-modal', VBModal);
Vue.directive('b-toggle', VBToggle);
Vue.directive('b-tooltip', VBTooltip);

// VUE PLUGINS
Vue.use(VueRouter);
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(BootstrapVueIcons);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

const router = createRouter(store, appDefinitions);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
