import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  BatteryMeasurement,
  TemperatureMeasurement,
  HumidityMeasurement,
} from "kuzzle-device-manager";
import { CO2Measurement } from "../../air_quality/devices/CO2Measurement";

import { NexelecCarbonDecoder } from "./NexelecCarbonDecoder";

/**
 * Type representing the metadata of a "NexelecCarbon" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface NexelecCarbonMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type representing the measures of a "NexelecCarbon" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type NexelecCarbonMeasurements = {
  battery: BatteryMeasurement;
  humidity: HumidityMeasurement;
  co2: CO2Measurement;
  externalTemperature: TemperatureMeasurement;
  internalTemperature: TemperatureMeasurement;
};

/**
 * Type meant to be used when manipulating a "NexelecCarbon" a device.
 *
 * It is constructed with the types of the device possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface NexelecCarbonDeviceContent
  extends DeviceContent<NexelecCarbonMeasurements, NexelecCarbonMetadata> {
  model: "NexelecCarbon";
}

export const NexelecCarbonDeviceDefinition: DeviceModelDefinition = {
  decoder: new NexelecCarbonDecoder(),
  defaultMetadata: {
    trackerType: "Embedded",
  },
  metadataMappings: {
    trackerType: { type: "keyword" },
    serialNumber: { type: "keyword" },
  },
};
