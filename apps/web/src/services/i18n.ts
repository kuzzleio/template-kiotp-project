import Vue from 'vue';
import { mergeLocaleMessages, locales as KIoTPLocales } from '@kuzzleio/iot-platform-frontend';
import defaultsDeep from 'lodash/defaultsDeep';
import VueI18n from 'vue-i18n';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

Vue.use(VueI18n);
const localeMessages = {
  en: defaultsDeep(en, KIoTPLocales.en),
  fr: defaultsDeep(fr, KIoTPLocales.fr),
};

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE ?? 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE ?? 'en',
  messages: mergeLocaleMessages(localeMessages),
});
