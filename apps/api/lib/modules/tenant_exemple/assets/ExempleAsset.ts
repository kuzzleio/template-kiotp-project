import {
  AssetContent,
  AssetModelDefinition,
  HumidityMeasurement,
  Metadata,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';

export const assetModelName = 'ExempleAsset';

/**
 * Type representing the metadata of a "Room" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExempleAssetMetadata extends Metadata {
  aStringMetadata: string;
  position: {
    lat: number;
    lon: number;
  };
  aNumberMetadata: number;
}

/**
 * Type representing the measures of a "Room" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type ExempleAssetMeasurements = {
  temperature: TemperatureMeasurement;
  humidity: HumidityMeasurement;
};

/**
 * Type meant to be used when manipulating a "Room" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExempleAssetContent
  extends AssetContent<ExempleAssetMeasurements, ExempleAssetMetadata> {
  model: 'ExempleAsset';
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const exempleAssetDefinition: AssetModelDefinition = {
  defaultMetadata: {},
  measures: [
    {
      name: 'temperature',
      type: 'temperature',
    },
    {
      name: 'humidity',
      type: 'humidity',
    },
  ],
  metadataMappings: {
    aStringMetadata: { type: 'keyword' },
    position: { type: 'geo_point' },
    aNumberMetadata: { type: 'float' },
  },
};
