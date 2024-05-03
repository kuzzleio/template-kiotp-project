<template>
  <div class="text-left h-100">
    <div class="sample-widget">
      <H2> This is a sample widget</H2>
      <h3>Bucketting field : {{ props.widgetSettings.buckettingField }}</h3>

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
import { useKuzzle, useI18n, KTable, KTableHeader } from '@kuzzleio/iot-platform-frontend';
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

// Refs
const data = ref<Array<{ [x: string]: number }>>([]);

// Constants

// Computeds

// Hooks
onMounted(async () => {
  emit('loading');

  await fetchData();

  // kuzzle search avec props buckettingField
  // charger les données dans un chartjs
  // update front

  emit('loaded');
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
