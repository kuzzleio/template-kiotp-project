import {
  DeviceContent,
  DeviceModelDefinition,
  Metadata,
  BatteryMeasurement,
} from 'kuzzle-device-manager';
import { WaterMeasurement } from '../../air_quality/devices/WaterMeasurement';

import { MilesightEM500SWLDecoder } from './MilesightEM500SWLDecoder';

/**
 * Type representing the metadata of a "MilesightEM500SWL" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface MilesightEM500SWLMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type representing the measures of a "MilesightEM500SWL" device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type MilesightEM500SWLMeasurements = {
  battery: BatteryMeasurement;
  water: WaterMeasurement;
};

/**
 * Type meant to be used when manipulating a "MilesightEM500SWL" a device.
 *
 * It is constructed with the types of the device possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface MilesightEM500SWLDeviceContent
  extends DeviceContent<MilesightEM500SWLMeasurements, MilesightEM500SWLMetadata> {
  model: 'MilesightEM500SWL';
}

export const MilesightEM500SWLDeviceDefinition: DeviceModelDefinition = {
  decoder: new MilesightEM500SWLDecoder(),
  defaultMetadata: {
    trackerType: 'Embedded',
  },
  metadataMappings: {
    trackerType: { type: 'keyword' },
    serialNumber: { type: 'keyword' },
  },
};
