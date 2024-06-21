<template>
  <div class="tw-bg-grey-light tw-p-4">
    <h2 class="tw-font-bold">{{ currentItem.reference }}</h2>
    <div class="tw-flex tw-gap-2">
      <div class="tw-flex tw-flex-col tw-gap-6 tw-mt-4">
        <!-- Sensors details -->
        <section class="tw-flex tw-flex-col tw-gap-2">
          <h5 class="tw-font-bold">
            {{ $i18n.t('locales.catalog.detail') }}
          </h5>
          <div>
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.manufacturer') }}</p>
            <span>{{ currentItem.manufacturer }}</span>
          </div>
          <div class="tw-mt-1">
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.reference') }}</p>
            <span>{{ currentItem.reference }}</span>
          </div>
        </section>

        <!-- Technical details -->
        <section class="tw-flex tw-flex-col tw-gap-2">
          <h5 class="tw-font-bold">
            {{ $i18n.t('locales.catalog.technical') }}
          </h5>
          <div>
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.measures') }}</p>
            <span>{{ getMeasures() }}</span>
          </div>
          <div>
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.network') }}</p>
            <span>{{ currentItem.network }}</span>
          </div>
          <div>
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.power') }}</p>
            <span>{{ $i18n.locale === 'en' ? currentItem.powerEn : currentItem.power }}</span>
          </div>
        </section>

        <!-- Documentation -->
        <section class="tw-flex tw-flex-col tw-gap-2">
          <h5 class="tw-font-bold">{{ $i18n.t('locales.catalog.doc') }}</h5>
          <div>
            <p class="tw-font-bold">{{ $i18n.t('locales.catalog.sales') }}</p>
            <a v-if="currentItem.sales.length > 0" :href="currentItem.sales" target="_blank">
              {{ $i18n.t('locales.catalog.link') }}
              <FontAwesomeIcon :icon="['fas', 'link']" size="xs" />
            </a>
            <span v-else>
              {{ $i18n.t('locales.catalog.unknown-link') }}
              <FontAwesomeIcon :icon="['fas', 'link-slash']" size="xs" />
            </span>
          </div>
          <div class="tw-mt-1">
            <p class="tw-mt-2 tw-font-bold">{{ $i18n.t('locales.catalog.datasheet') }}</p>
            <a
              v-if="currentItem.datasheet.length > 0"
              :href="currentItem.datasheet"
              target="_blank"
            >
              {{ $i18n.t('locales.catalog.link') }}
              <FontAwesomeIcon :icon="['fas', 'link']" size="xs" />
            </a>
            <span v-else>
              {{ $i18n.t('locales.catalog.unknown-link') }}
              <FontAwesomeIcon :icon="['fas', 'link-slash']" size="xs" />
            </span>
          </div>
        </section>
      </div>
      <div class="tw-flex-none tw-w-44">
        <img
          :src="`/images/catalog/${currentItem.reference}.png`"
          class="tw-h-52 tw-w-full tw-object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from '@kuzzleio/iot-platform-frontend';

import { Sensor } from '~/types/Catalog';

// Props
interface DeviceInfoViewProps {
  currentItem: Sensor;
}
const props = defineProps<DeviceInfoViewProps>();

// Composables
const $i18n = useI18n();

// Refs

// Computeds

// Watchers

// Functions
function getMeasures(): string {
  const measures = props.currentItem.measures;
  const measuresArrayFinal = Array<string>();
  for (const measure of measures) {
    const measureName = $i18n.locale === 'en' ? measure.labelEn : measure.labelFr;
    measuresArrayFinal.push(measureName);
  }
  return measuresArrayFinal.join(', ');
}
</script>
