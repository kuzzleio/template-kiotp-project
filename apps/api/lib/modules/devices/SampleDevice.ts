import { DeviceContent, DeviceModelDefinition, Metadata } from 'kuzzle-device-manager';

import { SampleDeviceDecoder } from './SampleDeviceDecoder';
import { SampleMeasurement } from '../measures/SampleMeasurement';

/**
 * Type representing the metadata of a device.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface SampleDeviceMetadata extends Metadata {
  trackerType: string;
  serialNumber: string;
}

/**
 * Type meant to be used when manipulating an asset.
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface SampleDeviceContent
  extends DeviceContent<SampleMeasurement, SampleDeviceMetadata> {
  model: 'SampleDevice';
}

export const SampleDeviceDefinition: DeviceModelDefinition = {
  decoder: new SampleDeviceDecoder(),
  defaultMetadata: {
    trackerType: 'Embedded',
  },
  metadataMappings: {
    trackerType: { type: 'keyword' },
    serialNumber: { type: 'keyword' },
  },
};
