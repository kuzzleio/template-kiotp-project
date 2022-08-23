import Vue from "vue";
import i18n from './services/i18n'
import App from "./App.vue";
import { createRouter } from "./router";
import store from "./store";

import {
  ToastPlugin,
  ModalPlugin,
  VBModal,
  VBToggle,
  BootstrapVue,
  BootstrapVueIcons,
} from "bootstrap-vue";
import { VBTooltip } from "bootstrap-vue/src/directives/tooltip";
import VueBreadcrumbs from "vue-2-breadcrumbs";
import VueRouter from "vue-router";
import {
  formatDate,
  formatDateTime,
  formatSvg,
  KIoTCViews,
} from "@kuzzleio/iot-console";

import {
  chunk as dashboardBuilderChunk,
} from './views/dashboards/appChunks'

// BOOTSTRAP DIRECTIVEs
Vue.directive("b-modal", VBModal);
Vue.directive("b-toggle", VBToggle);
Vue.directive("b-tooltip", VBTooltip);

// VUE PLUGINS
Vue.use(VueRouter);
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(VueBreadcrumbs);
Vue.use(BootstrapVueIcons);
Vue.use(BootstrapVue);

// VUE FILTERS
Vue.filter("formatDateTime", formatDateTime);
Vue.filter("formatDate", formatDate);
Vue.filter("formatSvg", formatSvg);

Vue.config.productionTip = false;

const router = createRouter(store, [dashboardBuilderChunk, ...KIoTCViews]);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
