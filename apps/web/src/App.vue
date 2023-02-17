<template>
  <div v-if="!$store.state.backend.waitingForConnection" id="app" data-cy="kiotp">
    <router-view :key="$route.fullPath" />
  </div>
  <k-offline v-else />
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import { KOffline, initBackendConnection, useStore } from '@kuzzleio/kuzzle-application-builder';

import config from './config';
import { kuzzle } from './services/kuzzle';

import '@kuzzleio/iot-console/src/assets/style.scss';

// Composables
initBackendConnection();
const $store = useStore();

// Providers
provide('$kuzzle', kuzzle);
provide('customizations', config.customizations ?? {});
</script>
