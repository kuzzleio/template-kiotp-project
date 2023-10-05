import { AssetContent } from 'kuzzle-device-manager';

import { GeofencePolygonMetadata, makeGeofence } from '@kuzzleio/iot-platform-backend';

/**
 * Type representing the metadata of a "Warehouse" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface WarehouseMetadata extends GeofencePolygonMetadata {
  surface: number;
  loadingBays: number;
}

/**
 * Type representing the measures of a "Warehouse" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type WarehouseMeasurements = Record<string, never>;

/**
 * Type meant to be used when manipulating a "Warehouse" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface WarehouseAssetContent
  extends AssetContent<WarehouseMeasurements, WarehouseMetadata> {
  model: 'Warehouse';
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const warehouseAssetDefinition = makeGeofence({
  measures: [],
  metadataMappings: {
    surface: { type: 'float' },
    loadingBays: { type: 'float' },
  },
});
