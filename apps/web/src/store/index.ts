import Vue from 'vue';
import {
  createAuthStoreModule,
  createBackendStoreModule,
  alertsStoreFactory,
  createAssetsStoreModule,
  createDevicesStoreModule,
  createMeasuresStoreModule,
  RootState,
  createTenantsStoreModule,
  StoreNamespaceTypes,
} from '@kuzzleio/iot-platform-frontend';
import Vuex from 'vuex';

import { kuzzle, observer } from '../services/kuzzle';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    [StoreNamespaceTypes.BACKEND]: createBackendStoreModule<RootState>(kuzzle),
    [StoreNamespaceTypes.AUTH]: createAuthStoreModule<RootState>(kuzzle),
    [StoreNamespaceTypes.TENANT]: createTenantsStoreModule<RootState>(kuzzle),
    [StoreNamespaceTypes.ASSETS]: createAssetsStoreModule<RootState>(kuzzle, observer),
    [StoreNamespaceTypes.DEVICES]: createDevicesStoreModule<RootState>(kuzzle, observer),
    [StoreNamespaceTypes.MEASURES]: createMeasuresStoreModule<RootState>(kuzzle),
    [StoreNamespaceTypes.ALERTS]: alertsStoreFactory<RootState>(kuzzle),
  },
});
