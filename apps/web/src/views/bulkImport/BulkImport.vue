<template>
  <div class="h-100 d-flex flex-column">
    <!-- HEADER -->
    <div class="Header">
      <!-- HERO -->
      <div class="Hero">
        <BCol class="text-left" cols="12" lg="8" md="8">
          <!-- TITLE -->
          <div class="Hero-title text-left">
            <h3 class="font-weight-bold">{{ $i18n.t('locales.bulkImport.title') }}</h3>
          </div>

          <!-- DESCRIPTION -->
          <p class="Hero-description">
            {{ $i18n.t('locales.bulkImport.description') }}
          </p>
        </BCol>
      </div>
    </div>

    <!-- CONTAINER -->
    <div class="flex-grow-1 d-flex flex-column w-100 mx-auto pt-5">
      <BFormFile ref="file-input" v-model="file" accept=".csv" required class="mb-2">
        <template #drop-placeholder>
          <div class="d-flex flex-column">
            <FontAwesomeIcon class="bulkImport-icon-colored" :icon="['fa', 'cloud-arrow-up']" />
            <p class="fa-xl font-weight-bold text-center mt-4">
              {{ $i18n.t('locales.bulkImport.drop') }}
            </p>
          </div>
        </template>
        <template #placeholder>
          <div class="d-flex flex-column">
            <FontAwesomeIcon class="bulkImport-icon" :icon="['fa', 'cloud-arrow-up']" />
            <p class="fa-xl font-weight-bold text-center mt-4">
              {{ $i18n.t('locales.bulkImport.browse') }}
            </p>
          </div>
        </template>
        <template #file-name="{ names: [name] }">
          <div class="d-flex flex-column">
            <FontAwesomeIcon class="bulkImport-icon-colored" :icon="['fa', 'file-csv']" />
            <p class="fa-xl font-weight-bold text-center mt-4">
              {{ name }}
            </p>
          </div>
        </template>
      </BFormFile>
      <BButton
        class="mt-4 d-flex mx-auto"
        variant="primary"
        :disabled="!file"
        @click.prevent="sendData"
      >
        {{ $i18n.t('locales.bulkImport.import') }}
      </BButton>
    </div>
    <BulkImportLogModal
      :current-index="currentIndex"
      :is-open.sync="showBulkImportLogModal"
      :file="realFile"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BButton, BFormFile } from 'bootstrap-vue';

import BulkImportLogModal from '~/components/bulkImport/modals/BulkImportLogModal.vue';

// Props
export interface BulkImportProps {
  currentIndex: string;
}
defineProps<BulkImportProps>();

// Refs
const file = ref<File | null>(null);
const realFile = ref<File | null>(null); // we need an another ref to pass it to the modal because the file ref is reseted when the modal is closed
const showBulkImportLogModal = ref(false);

// Watchers
watch(
  () => file.value,
  (newFile) => {
    if (newFile !== null) {
      realFile.value = newFile;
    }
  },
);

// Methods
function sendData(): void {
  showBulkImportLogModal.value = true;
  file.value = null;
}
</script>

<style lang="scss">
.custom-file.custom-file {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 80%;
  height: 50vh;

  .bulkImport-icon {
    font-size: 10rem;
    color: #666;
  }

  .bulkImport-icon-colored {
    font-size: 10rem;
    color: #e64472;
  }

  .bulkImport-deleteFile {
    fill: #666;
  }

  .custom-file-label {
    border: #666 dashed 2px;
    height: 50vh;
    width: 100%;
  }

  .form-file-text {
    display: flex !important;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .custom-file-input:focus ~ .custom-file-label {
    outline: none;
    box-shadow: none;
    border: #e64472 dashed 2px;
  }

  .custom-file-label:hover {
    border: #e64472 dashed 2px;
    cursor: pointer;
  }

  .custom-file-input ~ .custom-file-label[data-browse]::after {
    display: none;
  }
}
</style>
