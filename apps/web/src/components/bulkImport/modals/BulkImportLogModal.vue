<template>
  <BModal
    v-model="openModal"
    size="lg"
    modal-class="newModal"
    centered
    hide-footer
    title-tag="h3"
    :title="$i18n.t('locales.bulkImport.logModal.title')"
    @hide="onHide"
    @hidden="emit('hidden', $event)"
  >
    <div class="d-flex justify-content-between">
      <BButton variant="primary" @click.prevent="copyLogs">
        <FontAwesomeIcon :icon="['fa', 'copy']" />
        {{ $i18n.t('locales.bulkImport.logModal.copy') }}
      </BButton>

      <BDropdown class="bulkImportLogModal-dropdown" variant="outline-primary" right>
        <template #button-content>
          <FontAwesomeIcon :icon="['fa', 'filter']" />
          {{ $i18n.t('locales.bulkImport.logModal.filter') }}
        </template>
        <BDropdownItem
          v-for="{ value, text } in options"
          :key="value"
          @click.prevent="logLevel = value"
        >
          <!-- eslint-disable-next-line vue/no-lone-template -->
          <template role="menuitem">
            <span :style="'color: ' + value">{{ text }}</span>
          </template>
        </BDropdownItem>
      </BDropdown>
    </div>

    <div class="bulkImportLogModal-mainDiv mt-3 mb-4">
      <FontAwesomeIcon
        v-if="loading"
        class="bulkImportLogModal-spinner fa-2xl"
        :icon="['fa', 'spinner']"
        spin
      />
      <div ref="logsContainer" class="bulkImportLogModal-contentDiv p-3">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-for="(log, i) in displayedLogs" :key="log + i" class="mb-0" v-html="log" />
      </div>
    </div>
  </BModal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n, useKuzzle, useToast } from '@kuzzleio/iot-platform-frontend';
import { BButton, BModal } from 'bootstrap-vue';
import { DocumentNotification } from 'kuzzle-sdk';

import { BulkImportContent, LogType } from '~/components/bulkImport/LogType';

// Props
export interface BulkImportLogModalProps {
  currentIndex: string;
  isOpen?: boolean;
  file?: File | null;
}
const props = withDefaults(defineProps<BulkImportLogModalProps>(), {
  isOpen: false,
  file: null,
});

// Emits
interface EmitTypes {
  (name: 'update:isOpen', value: boolean): void;
  (name: 'hide', event: Event): void;
  (name: 'hidden', event: Event): void;
}
const emit = defineEmits<EmitTypes>();

// Composables
const $i18n = useI18n();
const $kuzzle = useKuzzle();
const $toast = useToast();

// Refs
const logs = ref<string[]>([]);
const logsContainer = ref<HTMLDivElement | null>(null);
const loading = ref<boolean>(false);
const logLevel = ref<string>('all');

// Constants
const options = [
  { value: 'all', text: $i18n.t('locales.bulkImport.logModal.filters.all') },
  { value: 'red', text: $i18n.t('locales.bulkImport.logModal.filters.error') },
  { value: 'orange', text: $i18n.t('locales.bulkImport.logModal.filters.warning') },
  { value: 'black', text: $i18n.t('locales.bulkImport.logModal.filters.success') },
];

// Computeds
const openModal = computed<boolean>({
  get() {
    if (props.isOpen) void onOpen();
    return props.isOpen;
  },
  set(value) {
    emit('update:isOpen', value);
  },
});

const displayedLogs = computed(() => {
  if (logLevel.value === 'all') {
    return logs.value;
  }
  const searchQuery = 'color: ' + logLevel.value;
  return logs.value.filter((log) => log.includes(searchQuery));
});

// Functions
function addLog(message: string, type: keyof typeof LogType): void {
  const color = LogType[type];
  const startColor = `<span style='color: ${color}'>`;
  const endColor = '</span>';
  logs.value = [...logs.value, startColor + message + endColor];
}

async function copyLogs(): Promise<void> {
  if (logsContainer.value == null) {
    return;
  }

  const logsToCopy: string[] = [];
  for (const child of logsContainer.value.children) {
    logsToCopy.push(child.textContent ?? '');
  }

  await navigator.clipboard.writeText(logsToCopy.join('\n'));
  $toast.showSuccess(
    $i18n.t('locales.bulkImport.logModal.copySuccess'),
    $i18n.t('locales.bulkImport.logModal.title'),
  );
}

function onHide(event: Event): void {
  logs.value = [];
  openModal.value = false;
  emit('hide', event);
}

async function onOpen(): Promise<void> {
  logs.value = [];
  logLevel.value = 'all';
  openModal.value = true;
  loading.value = true;
  await sendToBack();
  loading.value = false;
}

async function sendToBack(): Promise<void> {
  if (props.file !== null) {
    const fileContentBody = await props.file.text();
    try {
      const uniqueId = Math.random().toString(36).substring(7);
      const roomId = await $kuzzle.realtime.subscribe(
        'bulk-import',
        'log',
        { equals: { uniqueId } },
        (notification) => {
          const notificationData = notification as DocumentNotification<BulkImportContent>;
          const result = notificationData.result._source;

          if (result.type === 'kuzzle_error') {
            addLog(result.log.message, 'error');
            return;
          }

          const message = $i18n.t(
            `locales.bulkImport.log.${result.log.message}`,
            result.log.params,
          ) as string;
          addLog(message, result.type);
        },
      );
      await $kuzzle.query({
        controller: 'bulk-import',
        action: 'import',
        index: props.currentIndex,
        body: {
          currentIndex: props.currentIndex,
          content: fileContentBody,
          uniqueId,
        },
      });
      await $kuzzle.realtime.unsubscribe(roomId);
    } catch (error) {
      addLog((error as Error).message, 'error');
      console.error(error);
    }
  }
}
</script>

<style lang="scss">
.bulkImportLogModal-mainDiv {
  border-radius: 1rem;
  height: 40vh;
  background-color: rgba(102, 102, 102, 0.1);
}

.bulkImportLogModal-contentDiv {
  height: 100%;
  overflow-y: scroll;
}

.bulkImportLogModal-spinner {
  position: absolute;
  top: 50%;
  left: 48%; // 50% - 2% (for scrollbar)
  transform: translate(-50%, -50%);
}
</style>
