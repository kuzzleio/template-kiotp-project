<template>
  <KModal v-model="isOpen" :title="$i18n.t('locales.devices.modals.create')" @submit="onSubmit">
    <p
      class="tw-mb-2 tw-flex tw-items-center tw-justify-center tw-p-2 tw-text-base tw-text-secondary-light"
    >
      {{ $i18n.t('locales.devices.modals.createDescription') }}
    </p>

    <!-- FORM -->
    <KForm>
      <!-- MODEL -->
      <KFormField :label="$i18n.t('digitalTwin.model')">
        <select
          v-model="form.model"
          class="tw-w-full"
          :class="{
            'tw-border-red-500': $v.model?.$error,
          }"
          required
        >
          <option v-for="(deviceModel, key) in deviceModels" :key="key">
            {{ deviceModel }}
          </option>
        </select>
      </KFormField>
      <!-- REFERENCE -->
      <KFormField :label="$i18n.t('digitalTwin.reference')" required>
        <input
          v-model="form.reference"
          class="tw-w-full"
          type="text"
          :class="{
            'tw-border-red-500': $v.reference?.$error,
          }"
          required
        />
      </KFormField>

      <!-- INPUT -->

      <div v-if="isBusy" class="Modal-loader">
        <div class="Modal-loaderContainer">
          <div class="my-2 text-center text-danger">
            <BSpinner class="align-middle" />
            <strong>{{ $i18n.t('common.loading') }}</strong>
          </div>
        </div>
      </div>
    </KForm>
  </KModal>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useKuzzle, useRights, useToast, useI18n, KModal, KForm, KFormField } from '@kuzzleio/iot-platform-frontend';
import { ValidationArgs, useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { BSpinner } from 'bootstrap-vue';
import type {
  ApiDeviceCreateRequest,
  ApiDeviceCreateResult,
  ApiModelListDevicesRequest,
  ApiModelListDevicesResult,
} from 'kuzzle-device-manager-types';
import { useRouter } from 'vue-router/composables';


// Types
export interface DeviceFields {
  model: string;
  reference: string;
}
export type ValidationRules = ValidationArgs<DeviceFields>;

// Constants
const formFields: DeviceFields = {
  model: '',
  reference: '',
};
const validationRules = {
  model: {
    required,
  },
  reference: {
    required,
  },
};

// Props
export interface DeviceCreateFormProps {
  currentIndex: string;
  open: boolean;
  deviceModelId?: string;
}
const props = defineProps<DeviceCreateFormProps>();

// Emits
interface EmitTypes {
  (name: 'update:open', open: boolean): void;
  (name: 'cancel'): void;
  (name: 'submit'): void;
}
const emit = defineEmits<EmitTypes>();

// Composables
const $router = useRouter();
const $i18n = useI18n();
const $kuzzle = useKuzzle();
const $toast = useToast();
const { canUpdateDevice } = useRights(props.currentIndex);

// Refs
const isLoading = ref(false);
const form = ref<DeviceFields>({ ...formFields });
const isBusy = ref(false);
const model = ref<string>();
const deviceModels = ref<string[]>([]);

// Validations
const $v = useVuelidate<DeviceFields, ValidationRules>(validationRules, form);

// Computeds
const isOpen = computed<boolean>({
  get: () => props.open,
  set() {
    emit('update:open', !props.open);
  },
});

// Watchers
watch(
  () => props.deviceModelId,
  (deviceModelId) => {
    model.value = deviceModelId;
  },
);

// Hooks
onMounted(() => {
  void fetchData();
});

// Functions
async function fetchData(): Promise<void> {
  try {
    await fetchDeviceModels();
    if (deviceModels.value.length > 0) {
      form.value.model = deviceModels.value[0];
    }
  } catch (error) {
    console.error(error);
  }
}

function closeModal(): void {
  isOpen.value = false;
}

async function fetchDeviceModels(): Promise<void> {
  try {
    const { result } = await $kuzzle.query<ApiModelListDevicesRequest, ApiModelListDevicesResult>({
      controller: 'device-manager/models',
      action: 'listDevices',
    });

    for (const deviceModel of result.models) {
      deviceModels.value.push(deviceModel._source.device.model);
    }
  } catch (error) {
    console.error(error);
    $toast.showError($i18n.t('locales.errors.fetchModels'));
  }
}

async function onSubmit(): Promise<void> {
  if (!canUpdateDevice.value) {
    $toast.showError($i18n.t('locales.errors.rights.devicesCreate'));
  }
  $v.value.$reset();
  await $v.value.$validate();

  if ($v.value.$invalid) {
    return;
  }
  try {
    isLoading.value = true;
    isBusy.value = true;

    const { result: device } = await $kuzzle.query<ApiDeviceCreateRequest, ApiDeviceCreateResult>({
      controller: 'device-manager/devices',
      action: 'create',
      engineId: props.currentIndex,
      body: form.value,
    });

    await $router.push({
      name: 'device-details',
      params: { deviceId: device._id, activeTab: 'general-info' },
    });
  } catch (error) {
    console.error(error);
    $toast.showError((error as Error).message);
  } finally {
    isBusy.value = false;
    resetForm();
    closeModal();
  }

  function resetForm(): void {
    form.value = JSON.parse(JSON.stringify(formFields));
    $v.value.$reset();
  }
}
</script>
