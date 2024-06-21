<template>
  <div class="tw-relative tw-p-2 tw-h-full tw-flex tw-flex-col tw-justify-between">
    <h5 class="tw-text-center">
      {{ $i18n.t('locales.widget.level.title') }}
    </h5>

    <!-- Dropdown Lamp -->
    <BFormSelect v-model="currentStreetlamp" variant="primary">
      <BFormSelectOption value="null" disabled hidden>
        {{ $i18n.t('locales.widget.common.chooseLamp') }}
      </BFormSelectOption>
      <BFormSelectOption
        v-for="streetlamp of streetlamps"
        :key="streetlamp._id"
        :value="streetlamp"
      >
        {{ streetlamp._id }}
      </BFormSelectOption>
    </BFormSelect>

    <!-- Dropdown driver -->
    <div class="tw-py-2">
      <label for="lamp-driver">
        {{ $i18n.t('locales.widget.common.chooseDriver') }}
      </label>
      <BFormSelect id="lamp-driver" v-model="currentDriverLamp">
        <BFormSelectOption v-for="idDriver in driversLamp" :key="idDriver" :value="idDriver">
          <template v-if="idDriver === 0">
            {{ $i18n.t('locales.widget.common.allDrivers') }}
          </template>
          <template v-else>
            {{ idDriver }}
          </template>
        </BFormSelectOption>
      </BFormSelect>
    </div>

    <!-- Min/Max level -->
    <BRow class="tw-py-2">
      <BCol sm="6" role="group">
        <label for="min-level">
          {{ $i18n.t('locales.widget.common.minLevel') }}
        </label>
        <BFormInput id="min-level" v-model="minLevel" min="0" max="100" type="number" />
      </BCol>
      <BCol sm="6" role="group">
        <label for="max-level">
          {{ $i18n.t('locales.widget.common.maxLevel') }}
        </label>
        <BFormInput id="max-level" v-model="maxLevel" min="0" max="100" type="number" />
      </BCol>
    </BRow>

    <!-- Send Button -->
    <KButton class="tw-mt-2" variant="primary" :disabled="!isValid" @click="send()">
      {{ $i18n.t('locales.widget.common.send') }}
    </KButton>

    <KLoader v-if="load" background />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n, KLoader, KButton } from '@kuzzleio/iot-platform-frontend';
import { BFormSelect, BFormSelectOption, BRow, BCol, BFormInput } from 'bootstrap-vue';

import { useLamp } from '~/composables/useLamp';
import { LightingLevel } from '~/types/LightingPayload';
import { WidgetSettingsType } from '~/types/WidgetProps';

// Props
interface LevelWidgetProps {
  widgetSettings: WidgetSettingsType;
  widgetHeight: number;
  widgetWidth: number;
  engineIndex: string;
}
const props = defineProps<LevelWidgetProps>();

// Composables
const $i18n = useI18n();
const {
  streetlamps,
  currentStreetlamp,
  driversLamp,
  currentDriverLamp,
  minLevel,
  maxLevel,
  getLevels,
  sendLightingRuleToKaraDevice,
} = useLamp(props.widgetSettings, props.engineIndex);

// Refs
const load = ref(false);

// Computeds
const isValid = computed(() => {
  return currentStreetlamp.value !== null;
});

// Functions
async function send(): Promise<void> {
  if (!isValid.value) {
    return;
  }

  const lightingRule: LightingLevel = {
    type: 1,
    driver: currentDriverLamp.value,
    levels: getLevels(),
  };

  await sendLightingRuleToKaraDevice(lightingRule, load);
}
</script>
