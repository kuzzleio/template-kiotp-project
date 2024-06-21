<template>
  <div class="tw-relative tw-p-2 tw-h-full tw-flex tw-flex-col tw-justify-between">
    <h5 class="tw-text-center">
      {{ $i18n.t('locales.widget.scheduler.title') }}
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

    <!-- Period Mode -->
    <div class="tw-py-2">
      <label class="label-timepicker">
        {{ $i18n.t('locales.widget.scheduler.chooseMode') }}
      </label>
      <div class="tw-flex">
        <BFormRadioGroup
          v-model="modeState"
          :options="localModes"
          class="tw-w-full"
          button-variant="outline-primary"
          size="lg"
          buttons
          squared
        />
      </div>
    </div>

    <div class="tw-py-2">
      <!-- Repeat mode -->
      <BFormCheckbox v-if="modeState === modes.single" v-model="repeatMode">
        {{ $i18n.t('locales.widget.scheduler.repeat') }}
      </BFormCheckbox>
      <!-- Week Days -->
      <BButonGroup v-else-if="modeState === modes.daily" class="tw-flex tw-flex-wrap">
        <!-- Having 2 arrays is the only workaround to update localization but keep states -->
        <KButton
          v-for="(day, idx) in localeDays"
          :key="idx"
          class="tw-p-2 tw-m-1"
          :class="{
            'tw-bg-primary': daysState[idx],
            'tw-bg-secondary-light tw-border-secondary-light': !daysState[idx],
          }"
          @click="toggleDay(idx)"
        >
          {{ day }}
        </KButton>
      </BButonGroup>
    </div>

    <BRow class="tw-py-2">
      <BCol sm="6" role="group">
        <label class="label-timepicker">
          {{ $i18n.t('locales.widget.scheduler.start') }}
        </label>
        <div class="tw-flex tw-flex-col tw-items-center">
          <BCalendar v-model="startDate" />
          <BFormTimepicker
            v-model="startTime"
            class="tw-my-2"
            locale="fr"
            :label-no-time-selected="$i18n.t('locales.widget.common.no-time')"
          />
        </div>
      </BCol>
      <BCol sm="6" role="group">
        <label class="label-timepicker">
          {{ $i18n.t('locales.widget.scheduler.end') }}
        </label>
        <div class="tw-flex tw-flex-col tw-items-center">
          <BCalendar v-model="endDate" />
          <BFormTimepicker
            v-model="endTime"
            class="tw-my-2"
            locale="fr"
            :label-no-time-selected="$i18n.t('locales.widget.common.no-time')"
          />
        </div>
      </BCol>
    </BRow>

    <!-- Send Button -->
    <KButton variant="primary" :disabled="!isValid(modeState)" @click="send">
      <span class="tw-font-bold">{{ $i18n.t('locales.widget.common.send') }}</span>
    </KButton>

    <KLoader v-if="load" class="tw-z-[1]" background />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, set } from 'vue';
import { useI18n, KLoader, KButton } from '@kuzzleio/iot-platform-frontend';

import { useLamp } from '~/composables/useLamp';
import timePickerToDate from '~/helpers/timePickerToDate';
import { LightingScheduler } from '~/types/LightingPayload';
import { WidgetSettingsType } from '~/types/WidgetProps';

const modes = {
  single: 0,
  daily: 1,
} as const;

type ModeState = (typeof modes)[keyof typeof modes];

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
  currentStreetlamp,
  streetlamps,
  currentDriverLamp,
  driversLamp,
  minLevel,
  maxLevel,
  getLevels,
  sendLightingRuleToKaraDevice,
} = useLamp(props.widgetSettings, props.engineIndex);

const modeState = ref<ModeState>(0);
const repeatMode = ref(false);
const startDate = ref<string | null>(null);
const startTime = ref<string | null>(null);
const endDate = ref<string | null>(null);
const endTime = ref<string | null>(null);
const daysState = ref<boolean[]>(Array(7).fill(true));
const load = ref(false);

// Computeds
const localeDays = computed<string[]>(() => {
  return $i18n.t('locales.widget.common.days') as unknown as string[];
});

const localModes = computed(() => {
  return Object.entries(modes).map(([name, value]) => ({
    value,
    text: $i18n.t(`locales.widget.scheduler.modes.${name}`),
  }));
});

const start = computed(() => {
  const currentDate: Date | undefined =
    startDate.value !== null ? new Date(startDate.value) : undefined;

  return timePickerToDate(startTime.value ?? '', currentDate);
});

const end = computed(() => {
  const currentDate: Date | undefined =
    endDate.value !== null ? new Date(endDate.value) : undefined;

  if (endTime.value !== null && currentDate !== undefined) {
    return timePickerToDate(endTime.value ?? '', currentDate);
  }
  return undefined;
});

const activeWDay = computed(() => {
  return daysState.value.filter((v) => v).length;
});

// Functions
function toggleDay(idx: number): void {
  set(daysState.value, idx, !daysState.value[idx]);
}

function isValid(mode: ModeState): boolean {
  if (currentStreetlamp.value === null) {
    return false;
  }
  if (Number.isNaN(start.value.getTime())) {
    return false;
  }
  if (endDate.value !== null && endTime.value === null) {
    return false;
  }

  if (mode === modes.daily) {
    return activeWDay.value > 0;
  }

  return true;
}

async function send(): Promise<void> {
  if (!isValid(modeState.value)) {
    return;
  }

  let period: LightingScheduler['period'] = 0;
  switch (modeState.value) {
    case modes.single:
      period = repeatMode.value ? 2 : 0;
      break;

    case modes.daily:
      period = activeWDay.value === 7 ? 1 : 3;
      break;
  }

  const lightingRule: LightingScheduler = {
    type: 2,
    driver: currentDriverLamp.value,
    period,
    wday: undefined,
    levels: getLevels(),
    start: start.value,
    end: end.value,
  };

  if (lightingRule.period === 3) {
    lightingRule.wday = daysState.value.reduce<number[]>((result, state, index) => {
      if (state) {
        result.push(index + 1);
      }
      return result;
    }, []);
  }

  await sendLightingRuleToKaraDevice(lightingRule, load);
}
</script>

<style lang="scss">
button.btn-secondary.active {
  background-color: var(--primary) !important;
}
</style>
