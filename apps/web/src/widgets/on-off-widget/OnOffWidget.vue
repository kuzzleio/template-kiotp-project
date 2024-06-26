<template>
  <div class="tw-relative tw-p-2 tw-h-full tw-flex tw-flex-col tw-justify-between">
    <h5 class="tw-text-center">
      {{ $i18n.t('locales.widget.on-off.title') }}
    </h5>

    <!-- Dropdown -->
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

    <!-- "Apply When" Switch -->
    <div>
      <h6>{{ $i18n.t('locales.widget.on-off.apply') }}</h6>
      <div class="tw-flex tw-flex-row tw-content-center">
        <h5 :class="{ 'tw-text-secondary-light': scheduled }">
          {{ $i18n.t('locales.widget.on-off.immediate') }}
        </h5>
        <label for="scheduled" class="toggle-switch tw-mx-2">
          <input id="scheduled" v-model="scheduled" type="checkbox" hidden />
          <span class="slider" />
        </label>
        <h5 :class="{ 'tw-text-secondary-light': !scheduled }">
          {{ $i18n.t('locales.widget.on-off.scheduled') }}
        </h5>
      </div>
    </div>

    <div v-if="scheduled">
      <div class="tw-flex tw-flex-col tw-items-center">
        <!-- Date Select -->
        <BCalendar v-model="date" />
        <!-- Time Select -->
        <div class="tw-w-full">
          <div class="label-container">
            <label class="label-timepicker">
              {{ $i18n.t('locales.widget.on-off.executionTime') }}
            </label>
          </div>
          <BFormTimepicker
            v-model="executionTime"
            locale="fr"
            :label-no-time-selected="$i18n.t('locales.widget.common.no-time')"
          />
        </div>
      </div>
    </div>

    <!-- Send Button -->
    <div class="tw-flex tw-justify-center">
      <KButton class="tw-mr-2" variant="danger" size="xl" :disabled="!isValid" @click="send(OFF)">
        {{ $i18n.t('locales.widget.on-off.off') }}
      </KButton>
      <KButton variant="primary" size="xl" :disabled="!isValid" @click="send(ON)">
        {{ $i18n.t('locales.widget.on-off.on') }}
      </KButton>
    </div>

    <KLoader v-if="load" background />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n, KLoader, KButton } from '@kuzzleio/iot-platform-frontend';

import { useLamp } from '~/composables/useLamp';
import timePickerToDate from '~/helpers/timePickerToDate';
import { LightingOnOff } from '~/types/LightingPayload';
import { WidgetSettingsType } from '~/types/WidgetProps';

const ON = 'on';
const OFF = 'off';
const ACTIONS = [ON, OFF];

// Props
interface OnOffWidgetProps {
  widgetSettings: WidgetSettingsType;
  widgetHeight: number;
  widgetWidth: number;
  engineIndex: string;
}
const props = defineProps<OnOffWidgetProps>();

// Composables
const $i18n = useI18n();
const { streetlamps, currentStreetlamp, sendLightingRuleToKaraDevice } = useLamp(
  props.widgetSettings,
  props.engineIndex,
);

// Refs
const date = ref<string | null>(null);
const executionTime = ref<string | null>(null);
const scheduled = ref(false);
const load = ref(false);

// Computeds
const isValid = computed(() => {
  if (currentStreetlamp.value === null) {
    return false;
  }

  return !scheduled.value || (date.value !== null && executionTime.value !== null);
});

// Functions
async function send(actionType: string): Promise<void> {
  if (!isValid.value && !ACTIONS.includes(actionType)) {
    return;
  }

  const lightingRule: LightingOnOff = {
    type: 0,
    onoff: actionType === ON ? 1 : 0,
  };

  if (scheduled.value && executionTime.value != null) {
    const scheduledDate = timePickerToDate(
      executionTime.value,
      date.value != null ? new Date(date.value) : undefined,
    );
    lightingRule.date = scheduledDate;
  }

  await sendLightingRuleToKaraDevice(lightingRule, load);
}
</script>

<style lang="scss" scoped>
div.label-container {
  position: relative;
  height: 13px;
  margin-left: 18px;
}

label.label-timepicker {
  z-index: 10;
  position: absolute;
  background-color: white;
  padding: 0 8px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--secondary);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary);
}

input:checked + .slider:before {
  -webkit-transform: translateX(21px);
  -ms-transform: translateX(21px);
  transform: translateX(21px);
}
</style>
