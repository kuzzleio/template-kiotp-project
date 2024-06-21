<template>
  <div class="tw-h-full tw-flex tw-flex-col">
    <!-- HEADER -->
    <KHero :help="$i18n.t('locales.bulkImport.description')">
      {{ $i18n.t('locales.bulkImport.title') }}
    </KHero>

    <!-- CONTAINER -->
    <div class="tw-grow tw-flex tw-flex-col tw-w-full tw-mx-auto tw-pt-12">
      <BFormFile ref="file-input" v-model="file" accept=".csv" required class="tw-mb-2">
        <template #drop-placeholder>
          <div class="tw-flex tw-flex-col">
            <FontAwesomeIcon class="bulkImport-icon-colored" :icon="['fa', 'cloud-arrow-up']" />
            <p class="tw-text-xl tw-font-bold tw-text-center tw-mt-6">
              {{ $i18n.t('locales.bulkImport.drop') }}
            </p>
          </div>
        </template>
        <template #placeholder>
          <div class="tw-flex tw-flex-col">
            <FontAwesomeIcon class="bulkImport-icon" :icon="['fa', 'cloud-arrow-up']" />
            <p class="tw-text-xl tw-font-bold tw-text-center tw-mt-6">
              {{ $i18n.t('locales.bulkImport.browse') }}
            </p>
          </div>
        </template>
        <template #file-name="{ names: [name] }">
          <div class="tw-flex tw-flex-col">
            <FontAwesomeIcon class="bulkImport-icon-colored" :icon="['fa', 'file-csv']" />
            <p class="tw-text-xl tw-font-bold tw-text-center tw-mt-6">
              {{ name }}
            </p>
          </div>
        </template>
      </BFormFile>
      <KButton
        class="tw-mt-4 tw-flex tw-mx-auto"
        variant="primary"
        :disabled="!file"
        @click.prevent="sendData"
      >
        {{ $i18n.t('locales.bulkImport.import') }}
      </KButton>
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
import { KButton, KHero } from '@kuzzleio/iot-platform-frontend';
import { BFormFile } from 'bootstrap-vue';

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
