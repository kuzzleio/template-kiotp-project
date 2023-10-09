import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
} from "kuzzle-device-manager";
import { BrightnessMeasurement } from "./BrightnessMeasurement";

import { KaraDecoder } from "./KaraDecoder";
import { PowerConsumptionMeasurement } from "./PowerConsumptionMeasurement";

/**
 * Type representing the metadata of a "Kara" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface KaraMetadata extends Metadata {
  serialNumber: string;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type KaraMeasurements = {
  brightness: BrightnessMeasurement;
  powerConsumption: PowerConsumptionMeasurement;
};

/**
 * Type meant to be used when manipulating a "Kara" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface KaraDeviceContent
  extends DeviceContent<KaraMeasurements, KaraMetadata> {
  model: "Kara";
}

export const karaDeviceDefinition: DeviceModelDefinition = {
  decoder: new KaraDecoder(),
  metadataMappings: {
    serialNumber: { type: "keyword" },
  },
};
