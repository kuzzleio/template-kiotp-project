<template>
  <div>
    <h1>Widget form</h1>
    <BRow>
      <BCol>
        <BFormGroup
          :label="$i18n.t('locales.widget.common.asset-model')"
          label-for="asset-model-field"
        >
          <BFormInput
            id="asset-model-field"
            v-model="widgetSettings.buckettingField"
            required
            @change="emitChange"
          />
        </BFormGroup>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

// Types
import { SampleWidgetSettingsType } from './SampleWidgetSettings';
export interface SampleWidgetFormProps {
  // The index name where the Dashboard engine is installed
  engineIndex: string;
  // The collections of the engine-index
  collections: string[];
  // The settings, passed to the widget
  editedWidgetSettings?: SampleWidgetSettingsType;
}
const props = withDefaults(defineProps<SampleWidgetFormProps>(), {
  editedWidgetSettings: () => ({
    buckettingField: 'test',
  }),
});

// Refs
const widgetSettings = reactive(cloneDeep(props.editedWidgetSettings));

// Emits
type EmitTypes = (name: 'change', widgetSettings: SampleWidgetSettingsType) => void;
const emit = defineEmits<EmitTypes>();

function emitChange(): void {
  emit('change', widgetSettings);
}
</script>
