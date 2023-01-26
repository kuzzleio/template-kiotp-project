import {
  AssetContent,
  AssetModelDefinition,
  Metadata,
  TemperatureMeasurement,
} from "kuzzle-device-manager";
import { CO2Measurement } from "../devices/CO2Measurement";

/**
 * Type representing the metadata of a "Room" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface RoomMetadata extends Metadata {
  building: string;
}

/**
 * Type representing the measures of a "Room" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type RoomMeasurements = {
  temperature: TemperatureMeasurement;
  co2: CO2Measurement;
};

/**
 * Type meant to be used when manipulating a "Room" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface RoomAssetContent
  extends AssetContent<RoomMeasurements, RoomMetadata> {
  model: "Room";
}

/**
 * Asset definition used by the plugin to create associated ressources
 * and updates mappings.
 */
export const roomAssetDefinition: AssetModelDefinition = {
  defaultMetadata: {},
  measures: [
    {
      name: "temperature",
      type: "temperature",
    },
    {
      name: "co2",
      type: "co2",
    },
  ],
  metadataMappings: {
    building: { type: "keyword" },
  },
};
