<template>
  <div
    v-if="load"
    class="position-absolute bg-white z-100 w-100 h-100 m-n2 d-flex justify-content-center align-items-center"
    style="opacity: 90%; z-index: 100"
  >
    <BSpinner />
  </div>
</template>

<script lang="ts" setup>
import { BSpinner } from 'bootstrap-vue';

// Props
export interface LoaderProps {
  load: boolean;
}
defineProps<LoaderProps>();
</script>
