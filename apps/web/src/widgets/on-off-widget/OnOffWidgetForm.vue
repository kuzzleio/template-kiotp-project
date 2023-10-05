<template>
  <div>
    <BRow>
      <BCol>
        <BFormGroup
          :label="$i18n.t('locales.widget.common.asset-model')"
          label-for="asset-model-field"
        >
          <BFormSelect
            id="asset-model-field"
            v-model="widgetSettings.dataSources.assetModel"
            :options="assetModels"
            required
            @change="emitChange"
          />
        </BFormGroup>
      </BCol>
    </BRow>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import {
  KTenantGetters,
  StoreNamespaceTypes,
  Tenant,
  useKuzzle,
  useStore,
} from '@kuzzleio/iot-platform-frontend';
import type {
  ApiModelListAssetsRequest,
  ApiModelListAssetsResult,
} from 'kuzzle-device-manager-types';
import cloneDeep from 'lodash/cloneDeep';

import { WidgetSettingsType } from '~/types/WidgetProps';

// Props
export interface OnOffWidgetFormProps {
  engineIndex: string;
  collections: [];
  editedWidgetSettings?: WidgetSettingsType;
}
const props = withDefaults(defineProps<OnOffWidgetFormProps>(), {
  editedWidgetSettings: () => ({
    dataSources: {
      assetModel: '',
    },
  }),
});

// Emits
type EmitTypes = (name: 'change', widgetSettings: WidgetSettingsType) => void;
const emit = defineEmits<EmitTypes>();

// Composables
const $kuzzle = useKuzzle();
const $store = useStore();

// Refs
const widgetSettings = reactive(cloneDeep(props.editedWidgetSettings));
const assetModels = ref<string[]>([]);

// Computeds
const groupIndex = computed(() => {
  const currentTenant: Tenant =
    $store.getters[`${StoreNamespaceTypes.TENANT}/${KTenantGetters.SELECTED_TENANT}`];
  return currentTenant.group;
});

// Hooks
onMounted(() => {
  void fetchAssetModels();
});

// Functions
async function fetchAssetModels(): Promise<void> {
  const { result } = await $kuzzle.query<ApiModelListAssetsRequest, ApiModelListAssetsResult>({
    controller: 'device-manager/models',
    action: 'listAssets',
    engineGroup: groupIndex.value,
  });

  assetModels.value = result.models.map((model) => model._source.asset.model);
}

function emitChange(): void {
  emit('change', widgetSettings);
}
</script>
