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
 * Type meant to be used when manipulating a device.
 *
 * It is constructed when the types of the device possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface SampleDeviceContent
  extends DeviceContent<SampleMeasurement, SampleDeviceMetadata> {
  model: 'SampleDevice';
}

/**
 * Device definition used by the plugin to create associated resources
 * and update mappings.
 */
export const SampleDeviceDefinition: DeviceModelDefinition = {
  decoder: new SampleDeviceDecoder(),
  defaultMetadata: {
    trackerType: 'Embedded',
  },
  metadataMappings: {
    trackerType: { type: 'keyword' },
    serialNumber: { type: 'keyword' },
  },
  metadataDetails: {
    trackerType: {
      group: 'deviceInfo',
      locales: {
        en: {
          friendlyName: "Tracker Type",
          description: "The type of the tracker",
        },
        fr: {
          friendlyName: "Type de Tracker",
          description: "Le type de tracker",
        },
      },
    },
    serialNumber: {
      group: 'deviceInfo',
      locales: {
        en: {
          friendlyName: "Serial Number",
          description: "The serial number of the device",
        },
        fr: {
          friendlyName: "Numéro de Série",
          description: "Le numéro de série de l'appareil",
        },
      },
    },
  },
  metadataGroups: {
    deviceInfo: {
      locales: {
        en: {
          groupFriendlyName: "Device Information",
          description: "Information about the device",
        },
        fr: {
          groupFriendlyName: "Informations sur l'appareil",
          description: "Informations sur l'appareil",
        },
      },
    },
  },
};
