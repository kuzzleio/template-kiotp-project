declare module 'vue2-leaflet-markercluster' {
  import Vue from 'vue';
  import L from 'leaflet';
  export default class VueMarkercluster extends Vue {
    // data
    ready: boolean;
    mapObject: L.FeatureGroup;
    parentContainer: unknown;
    addLayer(layer: L.Layer): this;
    removeLayer(layer: L.Layer): this;
  }
}
