import {
  BatteryMeasurement,
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  PositionMeasurement,
} from 'kuzzle-device-manager';

import { LokaDecoder } from './LokaDecoder';

/**
 * Type representing the metadata of a "Loka" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface LokaMetadata extends Metadata {
  lns: string;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type LokaMeasurements = {
  position: PositionMeasurement;
  battery: BatteryMeasurement;
};

/**
 * Type meant to be used when manipulating a "Loka" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface LokaDeviceContent extends DeviceContent<LokaMeasurements, LokaMetadata> {
  model: 'Loka';
}

export const lokaDeviceDefinition: DeviceModelDefinition = {
  decoder: new LokaDecoder(),
  metadataMappings: {
    lns: { type: 'keyword' },
  },
};
