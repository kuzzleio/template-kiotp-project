<template>
  <div class="tw-flex tw-flex-col tw-h-full">
    <KHero :help="$i18n.t('locales.catalog.description')">
      {{ $i18n.t('locales.catalog.title') }}
    </KHero>

    <!-- CONTAINER -->
    <div class="tw-flex tw-grow tw-rounded tw-bg-white tw-p-4">
      <!-- TABLE -->
      <OldKTable
        class="tw-grow"
        :fields="fields"
        :items="catalogDataItems"
        :hover="true"
        :per-page="perPage"
        :total-rows="catalogData.length"
        :current-page="currentPage"
        :page-options="pageOptions"
        :table-options="{ selectable: true, selectMode: 'single' }"
        @page-changed="onPageChanged"
        @per-page-changed="onPerPageChanged"
        @row-selected="onRowSelected"
      >
        <!-- MEASURES -->
        <template #cell(measure)="data">
          <MeasureNameLabels :measures="getMeasures(data.item)" />
        </template>

        <!-- ACTIONS -->
        <template #cell(actions)="data">
          <BIconPlusSquareDotted
            v-b-tooltip.hover="$i18n.t('locales.catalog.action')"
            class="tw-text-xl"
            variant="danger"
            @click="openCreateForm(data.item)"
          />
        </template>
      </OldKTable>
      <DeviceInfoViewVue v-if="currentItem" class="tw-ml-6 tw-w-96" :current-item="currentItem" />
    </div>
    <DeviceCreateForm
      :open.sync="createModal"
      :current-index="currentIndex"
      :device-model-id="deviceModelId"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { KHero, OldKTable, MeasureNameLabels, useI18n } from '@kuzzleio/iot-platform-frontend';
import { BIconPlusSquareDotted, type BTable } from 'bootstrap-vue';

import catalogData from '~/assets/data/catalog/sensors.json';
import { Sensor } from '~/types/Catalog';

import DeviceInfoViewVue from './DeviceInfoView.vue';
import DeviceCreateForm from './decodersForm/DeviceCreateForm.vue';

// Props
export interface AssignedDecoderListProps {
  currentIndex: string;
}
defineProps<AssignedDecoderListProps>();

const createModal = ref(false);
const perPage = ref(10);
const currentPage = ref(1);
const pageOptions = [5, 10, 15, 100];

// Composables
const $i18n = useI18n();

// Refs
const currentItem = ref<Sensor>(catalogData[0] as Sensor);
const deviceModelId = ref('');

// Constants
const namespace = 'CatalogList';
const fields = computed<BTable['fields']>(() => [
  {
    key: 'manufacturer',
    tdClass: 'tw-align-middle',
    label: $i18n.t('locales.catalog.manufacturer') as string,
  },
  {
    key: 'reference',
    tdClass: 'tw-align-middle',
    label: $i18n.t('locales.catalog.reference') as string,
  },
  {
    key: 'measure',
    tdClass: 'tw-align-middle',
    label: $i18n.t('locales.catalog.measures') as string,
    thAttr: {
      width: '600px',
    },
  },
  {
    key: 'actions',
    tdClass: 'tw-text-center tw-align-middle',
    label: $i18n.t('locales.catalog.action') as string,
    thAttr: {
      width: '160px',
    },
  },
]);

const catalogDataItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return catalogData.slice(start, end);
});

// Hooks
onBeforeMount(() => {
  if (catalogData.length > 0) {
    if (localStorage.getItem(namespace) !== null) {
      const catalog = JSON.parse(localStorage.getItem(namespace) ?? '{}');
      perPage.value = catalog.perPage;
      currentItem.value = catalog.currentItem;
      currentPage.value = catalog.currentPage;
    } else {
      currentItem.value = catalogData[0] as Sensor;
    }
  }
});

// Functions
function onRowSelected([data]: Sensor[]): void {
  currentItem.value = data;
  saveTableState();
}

function openCreateForm(data: Sensor): void {
  createModal.value = true;
  deviceModelId.value = `${data.manufacturer}${data.reference}`;
}

function onPageChanged(page: number): void {
  currentPage.value = page;
  saveTableState();
}

function onPerPageChanged(perPageValue: number): void {
  perPage.value = perPageValue;
  saveTableState();
}

function getMeasures(item: {
  measures: Sensor['measures'];
}): Array<{ name: string; type: string }> {
  return item.measures.map((measure) => ({
    name: $i18n.locale === 'en' ? measure.labelEn : measure.labelFr,
    type: measure.type,
  }));
}

function saveTableState(): void {
  localStorage.setItem(
    namespace,
    JSON.stringify({
      currentItem: currentItem.value,
      currentPage: currentPage.value,
      perPage: perPage.value,
    }),
  );
}
</script>

<style>
.no-focus:focus {
  outline: none;
  box-shadow: none;
}
</style>
