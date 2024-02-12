<template>
  <div v-if="!$store.state.backend.waitingForConnection" id="app" data-cy="kiotp">
    <RouterView />
  </div>
  <KOffline v-else />
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import { KOffline, useStore } from '@kuzzleio/iot-platform-frontend';

import config from './config';
import { kuzzle } from './services/kuzzle';

import '@kuzzleio/iot-platform-frontend/src/assets/style.scss';

// Composables
const $store = useStore();

// Providers
// TODO remove this when old pages have been refactored
provide('$kuzzle', kuzzle);
provide('customizations', config.customizations ?? {});
</script>
