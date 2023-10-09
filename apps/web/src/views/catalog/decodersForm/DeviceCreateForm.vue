<template>
  <BModal
    v-model="openModal"
    size="md"
    :title="$i18n.t('locales.devices.modals.create')"
    title-tag="h3"
    header-class="Modal-header"
    modal-class="Modal"
    centered
    @ok="onSubmit"
  >
    <p class="tw-text-base tw-text-secondary-light">
      {{ $i18n.t('locales.devices.modals.createDescription') }}
    </p>

    <!-- FORM -->
    <BForm>
      <!-- MODEL -->
      <BFormGroup :label="$i18n.t('digitalTwin.model')" label-for="model">
        <BFormSelect id="model" v-model.trim="model" :options="deviceModels" required />
      </BFormGroup>
      <!-- REFERENCE -->
      <BFormGroup :label="$i18n.t('digitalTwin.reference')" label-for="reference">
        <BFormInput id="reference" v-model.trim="reference" required pattern="\S+" />
      </BFormGroup>

      <!-- INPUT -->

      <div v-if="isBusy" class="Modal-loader">
        <div class="Modal-loaderContainer">
          <div class="my-2 text-center text-danger">
            <BSpinner class="align-middle" />
            <strong>{{ $i18n.t('common.loading') }}</strong>
          </div>
        </div>
      </div>
    </BForm>

    <template #modal-footer="{ ok, cancel }">
      <BButton variant="outline-secondary" @click="cancel">
        {{ $i18n.t('action.cancel') }}
      </BButton>
      <BButton variant="danger" @click="ok">
        {{ $i18n.t('action.submit') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, withDefaults } from 'vue';
import { useKuzzle, useRights, useToast, useI18n } from '@kuzzleio/iot-platform-frontend';
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BModal,
  BSpinner,
} from 'bootstrap-vue';
import type {
  ApiDeviceCreateRequest,
  ApiDeviceCreateResult,
  ApiModelListDevicesRequest,
  ApiModelListDevicesResult,
} from 'kuzzle-device-manager-types';
import { useRouter } from 'vue-router/composables';

export interface DeviceCreateFormProps {
  currentIndex: string;
  deviceModelId?: string;
  isOpen?: boolean;
}

// Props
const props = withDefaults(defineProps<DeviceCreateFormProps>(), {
  isOpen: false,
  deviceModelId: '',
});

// Emits
type EmitTypes = (name: 'update:isOpen', value: boolean) => void;
const emit = defineEmits<EmitTypes>();

// Composables
const $router = useRouter();
const $i18n = useI18n();
const $kuzzle = useKuzzle();
const $toast = useToast();
const { canUpdateDevice } = useRights(props.currentIndex);

// Refs
const isBusy = ref(false);
const model = ref('');
const reference = ref('');
const deviceModels = ref<string[]>([]);

// Computeds
const openModal = computed<boolean>({
  get() {
    return props.isOpen;
  },
  set(value) {
    emit('update:isOpen', value);
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
  void fetchDeviceModels();
});

// Functions
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

  try {
    isBusy.value = true;

    const { result: device } = await $kuzzle.query<ApiDeviceCreateRequest, ApiDeviceCreateResult>({
      controller: 'device-manager/devices',
      action: 'create',
      engineId: props.currentIndex,
      body: {
        model: model.value,
        reference: reference.value,
      },
    });

    await $router.push({
      name: 'device-details',
      params: { deviceId: device._id },
    });
  } catch (error) {
    console.error(error);
    $toast.showError((error as Error).message);
  } finally {
    openModal.value = false;
    isBusy.value = false;
  }
}
</script>
