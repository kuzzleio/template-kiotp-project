import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  PositionMeasurement,
  BatteryMeasurement,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';

import { AbeewayDecoder } from './AbeewayDecoder';

/**
 * Type representing the metadata of a "Abeeway" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface AbeewayMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type AbeewayMeasurements = {
  position: PositionMeasurement;
  externalTemperature: TemperatureMeasurement;
  internalTemperature: TemperatureMeasurement;
  battery: BatteryMeasurement;
};

/**
 * Type meant to be used when manipulating a "Abeeway" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface AbeewayDeviceContent extends DeviceContent<AbeewayMeasurements, AbeewayMetadata> {
  model: 'Abeeway';
}

export const abeewayDeviceDefinition: DeviceModelDefinition = {
  decoder: new AbeewayDecoder(),
  defaultMetadata: {
    trackerType: 'Embedded',
  },
  metadataMappings: {
    trackerType: { type: 'keyword' },
    serialNumber: { type: 'keyword' },
  },
};
