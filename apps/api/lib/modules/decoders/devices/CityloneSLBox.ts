import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  BatteryMeasurement,
} from "kuzzle-device-manager";
import { CityloneSLBoxDecoder } from "./CityloneSLBoxDecoder";

/**
 * Type representing the metadata of a "CityloneSLBox" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface CityloneSLBoxMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type representing the measures of a "CityloneSLBox" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type CityloneSLBoxMeasurements = {
  battery: BatteryMeasurement;
};

/**
 * Type meant to be used when manipulating a "CityloneSLBox" a device.
 *
 * It is constructed with the types of the device possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface CityloneSLBoxDeviceContent
  extends DeviceContent<CityloneSLBoxMeasurements, CityloneSLBoxMetadata> {
  model: "CityloneSLBox";
}

export const CityloneSLBoxDeviceDefinition: DeviceModelDefinition = {
  decoder: new CityloneSLBoxDecoder(),
  defaultMetadata: {
    trackerType: "Embedded",
  },
  metadataMappings: {
    trackerType: { type: "keyword" },
    serialNumber: { type: "keyword" },
  },
};
