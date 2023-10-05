import {
  BatteryMeasurement,
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';

import { EnginkoDecoder } from './EnginkoDecoder';

/**
 * Type representing the metadata of a "Enginko" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface EnginkoMetadata extends Metadata {
  lns: string;
}

/**
 * Type representing the measures of a "Container" asset.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type EnginkoMeasurements = {
  temperature: TemperatureMeasurement;
  battery: BatteryMeasurement;
};

/**
 * Type meant to be used when manipulating a "Enginko" asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface EnginkoDeviceContent extends DeviceContent<EnginkoMeasurements, EnginkoMetadata> {
  model: 'Enginko';
}

export const enginkoDeviceDefinition: DeviceModelDefinition = {
  decoder: new EnginkoDecoder(),
  metadataMappings: {
    lns: { type: 'keyword' },
  },
};
