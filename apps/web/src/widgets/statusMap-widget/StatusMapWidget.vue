<template>
  <div class="text-left h-100">
    <div class="status-map-widget">
      <LMap ref="map" :center="center" :zoom="zoom" :options="options" @ready="resizeMap()">
        <LControlScale position="bottomleft" :imperial="false" />
        <LControlLayers position="topright" />
        <LTileLayer
          v-for="(tileProvider, tileName) in tileProviders"
          :key="`${$i18n.locale}-${tileName}`"
          :name="$t(`locales.maps.layers.${tileName}`)"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :options="getTileOptions(tileProvider['options'])"
          :attribution="tileProvider.attribution"
          layer-type="base"
        />
        <VueMarkercluster :options="clusterOptions">
          <LMarker
            v-for="(marker, idx) in positionMarkers"
            :key="idx"
            :lat-lng="[marker.position.lat, marker.position.lon]"
            :icon="getMarkerIcon(marker.color)"
            :name="marker.label"
          >
            <LPopup>
              <h6 class="font-weight-bold">{{ marker.label }}</h6>
              <div>
                <p v-for="paragraph in marker.description" :key="paragraph" class="m-0">
                  {{ paragraph }}
                </p>
              </div>
              <RouterLink :to="{ name: 'asset-details', params: { assetId: marker._id } }">
                {{ $t('locales.widget.common.see-asset') }}
              </RouterLink>
            </LPopup>
          </LMarker>
        </VueMarkercluster>
      </LMap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useKuzzle, useI18n } from '@kuzzleio/iot-platform-frontend';
import type { AssetContent } from 'kuzzle-device-manager-types';
import { KDocument } from 'kuzzle-sdk';
import L, { TileLayerOptions } from 'leaflet';
import { LControlLayers, LControlScale, LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet';
import VueMarkercluster from 'vue2-leaflet-markercluster';

import config from '~/config';
import { LatLon } from '~/types/Data';

// Types
interface TileProvider {
  visible: boolean;
  attribution: string;
  url: string;
  options: TileLayerOptions;
}
interface Marker {
  _id: string;
  label: string;
  description: string[];
  color: string;
  position: LatLon;
}
interface ClusterLayer {
  getChildCount: () => number;
  getAllChildMarkers: () => Array<{ options: { icon: L.DivIcon } }>;
}

// Props
interface StatusMapWidgetProps {
  widgetSettings: object;
  widgetHeight: number;
  widgetWidth: string;
  engineIndex: string;
}
const props = defineProps<StatusMapWidgetProps>();

// Composables
const $i18n = useI18n();
const $kuzzle = useKuzzle();

// Refs
const map = ref();
const assets = ref<Array<KDocument<AssetContent>>>([]);
const polylines = ref([]);
const crossingsPoints = ref([]);

// Constants
const zoom = 3;
const center = [47.41322, -1.219482];
const options = { attributionControl: true };
const tileProviders = config.maps.tileProviders as unknown as Record<string, TileProvider>;
const clusterOptions = {
  iconCreateFunction: (cluster: ClusterLayer): L.DivIcon => {
    const childCount = cluster.getChildCount();

    let errors = 0;
    for (const child of cluster.getAllChildMarkers()) {
      const iconHtml = child.options.icon.options.html;

      if (typeof iconHtml !== 'string') {
        continue;
      }

      const matches = iconHtml.match(/<g fill=".*">/);

      if (!Array.isArray(matches)) {
        continue;
      }

      const error = matches[0].substring(9, matches[0].length - 2);

      if (error === 'red') errors += 1;
    }

    let error = ' marker-cluster-';
    if (errors === 0) error += 'valid';
    else if (errors === childCount) error += 'all';
    else error += 'some';

    return new L.DivIcon({
      html: `<div><span>${childCount}</span></div>`,
      className: 'marker-cluster' + error,
      iconSize: new L.Point(40, 40),
    });
  },
};

// Computeds
const positionMarkers = computed(() => {
  const markers: Marker[] = [];
  for (const { _id, _source } of assets.value) {
    const sensorState = _source.measures.sensorState?.values.errorState === 1;
    const driverState = _source.measures.driverState?.values.errorState === 1;

    const label = _id;
    const description = [
      `${$i18n.t('locales.labels.sensorstate') as string} (KARA): ${
        $i18n.t(`locales.widget.common.${sensorState ? 'error' : 'ok'}`) as string
      }`,
      `${$i18n.t('locales.labels.driverstate') as string} (DALI): ${
        $i18n.t(`locales.widget.common.${driverState ? 'error' : 'ok'}`) as string
      }`,
    ];

    const position =
      _source.metadata?.geolocation !== undefined
        ? _source.metadata.geolocation
        : _source.measures?.position?.values?.position;

    if (typeof position === 'undefined') {
      continue;
    }

    const error = sensorState || driverState;
    const color = error ? 'red' : 'green';

    markers.push({ _id, label, description, color, position });
  }
  return markers;
});

// Hooks
onMounted(() => {
  void fetchAssets();

  initMapSequence();
  invalidateSize();
});

// Functions
function getTileOptions(tilesOptions: TileLayerOptions): TileLayerOptions {
  return {
    maxNativeZoom: 18,
    maxZoom: 20,
    ...(tilesOptions ?? {}),
  };
}

async function fetchAssets(): Promise<void> {
  const query = {
    equals: {
      model: 'Lampadaire',
    },
  };

  const { hits } = await $kuzzle.document.search<AssetContent>(
    props.engineIndex,
    'assets',
    { query },
    { lang: 'koncorde' },
  );

  const assetsWithPosition = hits.filter((device) => device._source.measures.position != null);

  assets.value = assetsWithPosition;
}

function initMapSequence(): void {
  cleanMap();
}

function getMarkerIcon(color: string): L.DivIcon {
  return new L.DivIcon({
    html: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
    <g fill="${color}"><path d="M500,10c-179.1,0-324.8,145.7-324.8,324.9c0,171.1,292.7,601.5,305.2,622.3L500,990l19.6-32.8c12.5-20.8,305.2-451.3,305.2-622.3C824.8,155.7,679.1,10,500,10z M508.7,505.1c-96.1,0-174.3-78.2-174.3-174.4c0-96.1,78.2-174.2,174.3-174.2c96.1,0,174.3,78.2,174.3,174.2C683.1,426.9,604.9,505.1,508.7,505.1z"/></g>
    </svg>`,
    iconSize: [46, 40],
    iconAnchor: [23, 40],
    popupAnchor: [0, -30],
  });
}

function cleanMap(): void {
  for (const polyline of polylines.value) {
    map.value.mapObject.removeLayer(polyline);
  }

  polylines.value = [];

  for (const crossingsPoint of crossingsPoints.value) {
    map.value.mapObject.removeLayer(crossingsPoint);
  }

  crossingsPoints.value = [];
}

function resizeMap(): void {
  invalidateSize();
}

function invalidateSize(): void {
  if (map.value === null) {
    return;
  }
  map.value.mapObject.invalidateSize();
}

// Watchers
// Weird: neither props.widgetWidth nor props.widgetHeights seems to be updated on resizing
watch(
  () => props,
  () => {
    resizeMap();
  },
  { deep: true },
);
</script>

<style lang="scss">
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

.status-map-widget {
  width: 100%;
  height: 100%;
}

.leaflet-div-icon {
  border: none !important;
  background-color: transparent !important;
}

.marker-cluster-valid {
  background-color: rgba(181, 226, 140, 0.6);
}

.marker-cluster-valid div {
  background-color: rgba(110, 204, 57, 0.6);
}

.marker-cluster-some {
  background-color: rgba(253, 156, 115, 0.6);
}

.marker-cluster-some div {
  background-color: rgba(241, 128, 23, 0.6);
}

.marker-cluster-all {
  background-color: rgba(255, 51, 33, 0.6);
}

.marker-cluster-all div {
  background-color: rgba(255, 90, 75, 0.6);
}
</style>
