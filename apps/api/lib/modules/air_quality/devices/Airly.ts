import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  HumidityMeasurement,
  TemperatureMeasurement,
} from "kuzzle-device-manager";

import { CO2Measurement } from "./CO2Measurement";
import { IlluminanceMeasurement } from "./IlluminanceMeasurement";
import { AirlyDecoder } from "./AirlyDecoder";

/**
 * Type representing the metadata of a "Airly" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface AirlyMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type AbeewayMeasurements = {
  illuminance: IlluminanceMeasurement;
  co2: CO2Measurement;
  temperature: TemperatureMeasurement;
  humidity: HumidityMeasurement;
};

/**
 * Type meant to be used when manipulating a "Airly" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface AirlyDeviceContent
  extends DeviceContent<AbeewayMeasurements, AirlyMetadata> {
  model: "Airly";
}

export const AirlyDeviceDefinition: DeviceModelDefinition = {
  decoder: new AirlyDecoder(),
  defaultMetadata: {
    trackerType: "Embedded",
  },
  metadataMappings: {
    trackerType: { type: "keyword" },
    serialNumber: { type: "keyword" },
  },
};
