<template>
  <div class="text-left h-100">
    <div class="sample-widget">
      <h2> {{ $i18n.t('widget.sample-widget.title') }} </h2>
      <h3>{{ $i18n.t('widget.sample-widget.buckettingField') }} {{ props.widgetSettings.buckettingField }}</h3>

      <KTable :items="data" :total="data.length" :headers="headers">
        <template #cell(name)="itemData">
          {{ itemData.item.key }}
        </template>
        <template #cell(description)="itemData">
          {{ itemData.item.count }}
        </template>
      </KTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
// Use I18N to translate your widget texts
import {
  useKuzzle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useI18n,
  useToast,
  KTable,
  KTableHeader,
} from '@kuzzleio/iot-platform-frontend';
import type { AssetContent } from 'kuzzle-device-manager-types';

// Types
import { SampleWidgetSettingsType } from './SampleWidgetSettings';

// Props
interface SampleWidgetProps {
  widgetSettings: SampleWidgetSettingsType;
  widgetHeight: number;
  widgetWidth: string;
  engineIndex: string;
}
const props = defineProps<SampleWidgetProps>();

// Computeds
const headers = computed<KTableHeader[]>(() => [
  {
    key: 'name',
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    label: props.widgetSettings?.buckettingField || '--', // $i18n.t('locales.notifications.list.notificationName'),
    sortable: true,
  },
  {
    key: 'description',
    label: 'Count', // $i18n.t('locales.notifications.list.notificationDescription'),
    sortable: false,
  },
]);

// Emits
interface EmitTypes {
  (name: 'loading'): void;
  (name: 'loaded'): void;
}
const emit = defineEmits<EmitTypes>();

// Composables
// const $i18n = useI18n();
const $kuzzle = useKuzzle();
const $i18n = useI18n();
// Refs
const data = ref<Array<{ [x: string]: number }>>([]);

// Constants

// Computeds

// Hooks
onMounted(() => {
  emit('loading');
  fetchData().catch((e) => {
    useToast().showError('An error occurred while fetching data: ', e);
  });
});

// Functions

async function fetchData(): Promise<void> {
  if (props.widgetSettings?.buckettingField !== undefined) {
    const res = await $kuzzle.document.search<AssetContent>(props.engineIndex, 'assets', {
      aggs: {
        term_agg: {
          terms: {
            field: 'metadata.' + props.widgetSettings.buckettingField,
          },
        },
      },
    });

    const agg: Array<{ [x: string]: number }> = [];
    for (const bucket of res.aggregations?.term_agg.buckets) {
      agg.push({ key: bucket.key, count: bucket.doc_count });
    }
    data.value = agg;
  }

  emit('loaded');
}
</script>
<style lang="scss"></style>
