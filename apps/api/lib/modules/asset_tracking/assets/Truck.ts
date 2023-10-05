import {
  GeofencingMeasurements,
  GeofencingMetadata,
  makeGeofencing,
} from '@kuzzleio/iot-platform-backend';
import { AssetContent } from 'kuzzle-device-manager';

import { MovementRecordMeasurement } from '../measures';

/**
 * Type representing the metadata of a "Truck" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface TruckMetadata extends GeofencingMetadata {
  numberPlate: string;
  capacity: number;
}

/**
 * Type representing the measures of a "Truck" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface TruckMeasurements extends GeofencingMeasurements {
  movementRecord: MovementRecordMeasurement;
}

/**
 * Type meant to be used when manipulating a "Truck" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface TruckAssetContent extends AssetContent<TruckMeasurements, TruckMetadata> {
  model: 'Truck';
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const truckAssetDefinition = makeGeofencing({
  defaultMetadata: {
    capacity: 38,
  },
  measures: [
    {
      name: 'position',
      type: 'position',
    },
    {
      name: 'movementRecord',
      type: 'movementRecord',
    },
  ],
  metadataMappings: {
    capacity: { type: 'integer' },
    numberPlate: { type: 'keyword' },
  },
});
