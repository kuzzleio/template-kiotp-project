import {
  AssetContent,
  AssetModelDefinition,
  Metadata,
} from "kuzzle-device-manager";

import {
  BrightnessMeasurement,
  PowerConsumptionMeasurement,
} from "../devices/";

/**
 * Type representing the metadata of a "StreetLamp" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface StreetLampMetadata extends Metadata {
  position: {
    lat: number;
    lon: number;
  };
  street: string;
}

/**
 * Type representing the measures of a "StreetLamp" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type StreetLampMeasurements = {
  brightness: BrightnessMeasurement;
  powerConsumption: PowerConsumptionMeasurement;
};

/**
 * Type meant to be used when manipulating a "StreetLamp" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface StreetLampAssetContent
  extends AssetContent<StreetLampMeasurements, StreetLampMetadata> {
  model: "StreetLamp";
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const streetLampAssetDefinition: AssetModelDefinition = {
  measures: [
    {
      name: "brightness",
      type: "brightness",
    },
    {
      name: "powerConsumption",
      type: "powerConsumption",
    },
  ],
  metadataMappings: {
    position: { type: "geo_point" },
    street: { type: "keyword" },
  },
};
