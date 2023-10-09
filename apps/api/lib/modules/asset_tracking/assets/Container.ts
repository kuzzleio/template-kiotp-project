import {
  AssetContent,
  AssetModelDefinition,
  Metadata,
  PositionMeasurement,
  TemperatureMeasurement,
} from "kuzzle-device-manager";

/**
 * Type representing the metadata of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ContainerMetadata extends Metadata {
  operator: string;
  width: number;
  height: number;
  length: number;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type ContainerMeasurements = {
  position: PositionMeasurement;
  externalTemperature: TemperatureMeasurement;
  internalTemperature: TemperatureMeasurement;
};

/**
 * Type meant to be used when manipulating a "Container" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ContainerAssetContent
  extends AssetContent<ContainerMeasurements, ContainerMetadata> {
  model: "Container";
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const containerAssetDefinition: AssetModelDefinition = {
  defaultMetadata: {
    width: 2.33,
    height: 2.35,
    length: 5.867,
  },
  measures: [
    {
      name: "position",
      type: "position",
    },
    {
      name: "externalTemperature",
      type: "temperature",
    },
    {
      name: "internalTemperature",
      type: "temperature",
    },
  ],
  metadataMappings: {
    operator: { type: "keyword" },
    width: { type: "float" },
    height: { type: "float" },
    length: { type: "float" },
  },
};
