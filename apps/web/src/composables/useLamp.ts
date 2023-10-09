import { onMounted, Ref, ref } from 'vue';
import { useKuzzle, useRights, useI18n, useToast } from '@kuzzleio/iot-platform-frontend';
import type { DeviceContent } from 'kuzzle-device-manager-types';
import { KDocumentContentGeneric, KHit, SearchResult } from 'kuzzle-sdk';

import { LightingRule } from '~/types/LightingPayload';
import { WidgetSettingsType } from '~/types/WidgetProps';
import { useMqtt } from './useMqtt';

// Define driver list constant
const avalaibleDrivers = [0, 1, 2, 3, 4] as const;
// Use typeof variable[number] to get a union of items types
export type driverType = (typeof avalaibleDrivers)[number];

type Levels = [number, number, number, number, number, number];

interface StreetLamp {
  _id: string;
}

interface UseLamp {
  streetlamps: Ref<StreetLamp[]>;
  currentStreetlamp: Ref<StreetLamp | null>;
  driversLamp: typeof avalaibleDrivers;
  currentDriverLamp: Ref<driverType>;
  minLevel: Ref<number>;
  maxLevel: Ref<number>;
  sendLightingRuleToKaraDevice: (
    lightingRule: LightingRule,
    loading: Ref<boolean>,
  ) => Promise<void>;
  getLevels: () => Levels;
}
export function useLamp(widgetSettingsProp: WidgetSettingsType, engineIndexProp: string): UseLamp {
  // Props
  const widgetSettings = widgetSettingsProp;
  const engineIndex = engineIndexProp;

  // Composables
  const $kuzzle = useKuzzle();
  const $rights = useRights();
  const $i18n = useI18n();
  const $toast = useToast();
  const { sendToMqtt } = useMqtt();

  // Refs
  const currentStreetlamp = ref<StreetLamp | null>(null);
  const streetlamps = ref<StreetLamp[]>([]);
  const currentDriverLamp = ref<driverType>(0);
  const minLevel = ref(10);
  const maxLevel = ref(100);

  // Hooks
  onMounted(() => {
    void fetchStreetlamps();
  });

  // Functions
  function getLevels(): Levels {
    const low = Number(minLevel.value);
    const high = Number(maxLevel.value);
    return [
      low,
      high,
      Math.round((high - low) / 3 + low), // MEDIUM
      Math.round((high - low) / 2 + low), // NEIGHBOUR
      Math.round((high - low) / 1.8 + low), // SAFETY
      Math.round((high - low) / 1.2 + low), // NEIGHBOUR_SAFETY
    ];
  }

  async function fetchStreetlamps(): Promise<void> {
    if (!$rights.canSearchAsset.value) {
      $toast.showError($i18n.t('locales.widget.common.cant-search-asset'));
      return;
    }

    const fetchedStreetLamps: StreetLamp[] = [];

    try {
      let result: SearchResult<KHit<KDocumentContentGeneric>> | null =
        await $kuzzle.document.search(
          engineIndex,
          'assets',
          {
            query: {
              equals: {
                model: widgetSettings.dataSources.assetModel,
              },
            },
          },
          {
            lang: 'koncorde',
          },
        );

      while (result != null) {
        fetchedStreetLamps.push(...result.hits);
        result = await result.next();
      }
      streetlamps.value = fetchedStreetLamps;
    } catch (error) {
      $toast.showError((error as Error).message);
      console.error(error);
    }
  }

  async function sendLightingRuleToKaraDevice(
    lightingRule: LightingRule,
    loading: Ref<boolean>,
  ): Promise<void> {
    loading.value = true;

    try {
      const MACAddress = await getMACAddress();
      await sendToMqtt(MACAddress, 'LightingRule', {
        LightingRule: lightingRule,
      });
    } catch (error) {
      $toast.showError((error as Error).message);
      console.error(error);
    }

    loading.value = false;
  }

  async function getMACAddress(): Promise<string> {
    if (currentStreetlamp.value === null) {
      throw Error($i18n.t('locales.widget.common.no-streetlamp-selected') as string);
    }

    const { hits } = await $kuzzle.document.search<DeviceContent>(
      engineIndex,
      'devices',
      {
        query: {
          and: [
            {
              equals: {
                model: 'Kara',
              },
            },
            {
              equals: {
                assetId: currentStreetlamp.value._id,
              },
            },
          ],
        },
      },
      {
        lang: 'koncorde',
        size: 1,
      },
    );

    if (hits.length === 0) {
      throw Error($i18n.t('locales.widget.common.no-kara-devices-linked') as string);
    }

    return hits[0]._source.reference;
  }

  return {
    streetlamps,
    currentStreetlamp,
    driversLamp: avalaibleDrivers,
    currentDriverLamp,
    minLevel,
    maxLevel,
    sendLightingRuleToKaraDevice,
    getLevels,
  };
}
