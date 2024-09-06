import { AssetModel } from '@kuzzleio/iot-platform-backend';
import {
  AssetContent,
  HumidityMeasurement,
  Metadata,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';

/**
 * Name of asset model
 */
export const modelName = 'ExampleAsset';

/**
 * Type representing the metadata of an "ExampleAsset".
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExampleAssetMetadata extends Metadata {
  aStringMetadata: string;
  position: {
    lat: number;
    lon: number;
  };
  aNumberMetadata: number;
}

/**
 * Type representing the measures of an "ExampleAsset".
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type ExampleAssetMeasurements = {
  temperature: TemperatureMeasurement;
  humidity: HumidityMeasurement;
};

/**
 * Type meant to be used when manipulating an "ExampleAsset".
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExampleAssetContent
  extends AssetContent<ExampleAssetMeasurements, ExampleAssetMetadata> {
  /**
   * ? Use typeof to infer the string of the constant like a type (here result to `model: 'ExampleAsset'`)
   * * So we have just to modify the constant `modelName` to change here
   */
  model: typeof modelName;
}

export const ExampleAsset: AssetModel = {
  /**
   * * Model name define in constant on top of file to allow to use in other places like in type of asset Content
   */
  modelName,
  /**
   * * Asset definition used by the plugin to create associated resources
   * * and update mappings.
   */
  definition: {
    defaultMetadata: {
      aStringMetadata: 'Default String',
      position: { lat: 0, lon: 0 },
      aNumberMetadata: 0,
    },
    measures: [
      {
        name: 'temperature',
        type: 'temperature',
      },
      {
        name: 'humidity',
        type: 'humidity',
      },
    ],
    metadataMappings: {
      aStringMetadata: { type: 'keyword' },
      position: { type: 'geo_point' },
      aNumberMetadata: { type: 'float' },
    },
    metadataDetails: {
      aStringMetadata: {
        group: 'ExampleGroup',
        locales: {
          en: {
            friendlyName: 'String Metadata',
            description: 'A string type metadata',
          },
          fr: {
            friendlyName: 'Métadonnées de chaîne de caractères',
            description: 'Une métadonnée de type chaîne de caractères',
          },
        },
      },
      aNumberMetadata: {
        group: 'ExampleGroup',
        locales: {
          en: {
            friendlyName: 'Number Metadata',
            description: 'A number type metadata',
          },
          fr: {
            friendlyName: 'Métadonnées de nombre',
            description: 'Une métadonnée de type nombre',
          },
        },
      },
      position: {
        group: 'location',
        locales: {
          en: {
            friendlyName: 'Position',
            description: 'Geographical position',
          },
          fr: {
            friendlyName: 'Position',
            description: 'Position géographique',
          },
        },
      },
    },
    metadataGroups: {
      ExampleGroup: {
        locales: {
          en: {
            groupFriendlyName: 'Example Group',
            description: 'Example group data',
          },
          fr: {
            groupFriendlyName: 'Groupe Example',
            description: 'Données du groupe Example',
          },
        },
      },
      location: {
        locales: {
          en: {
            groupFriendlyName: 'Location',
            description: 'Location data',
          },
          fr: {
            groupFriendlyName: 'Localisation',
            description: 'Données de localisation',
          },
        },
      },
    },
  },
};
