import {
  AssetContent,
  AssetModelDefinition,
  HumidityMeasurement,
  Metadata,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';

export const assetModelName = 'ExempleAsset';

/**
 * Type representing the metadata of an "ExempleAsset".
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExempleAssetMetadata extends Metadata {
  aStringMetadata: string;
  position: {
    lat: number;
    lon: number;
  };
  aNumberMetadata: number;
}

/**
 * Type representing the measures of an "ExempleAsset".
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export type ExempleAssetMeasurements = {
  temperature: TemperatureMeasurement;
  humidity: HumidityMeasurement;
};

/**
 * Type meant to be used when manipulating an "ExempleAsset".
 *
 * It is constructed when the types of the asset possible measures and metadata.
 *
 * This is optional and can be omitted if you don't want strong typing
 */
export interface ExempleAssetContent
  extends AssetContent<ExempleAssetMeasurements, ExempleAssetMetadata> {
  model: 'ExempleAsset';
}

/**
 * Asset definition used by the plugin to create associated resources
 * and update mappings.
 */
export const exempleAssetDefinition: AssetModelDefinition = {
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
      group: 'exempleGroup',
      locales: {
        en: {
          friendlyName: "String Metadata",
          description: "A string type metadata",
        },
        fr: {
          friendlyName: "Métadonnées de chaîne de caractères",
          description: "Une métadonnée de type chaîne de caractères",
        },
      },
    },
    aNumberMetadata: {
      group: 'exempleGroup',
      locales: {
        en: {
          friendlyName: "Number Metadata",
          description: "A number type metadata",
        },
        fr: {
          friendlyName: "Métadonnées de nombre",
          description: "Une métadonnée de type nombre",
        },
      },
    },
    position: {
      group: 'location',
      locales: {
        en: {
          friendlyName: "Position",
          description: "Geographical position",
        },
        fr: {
          friendlyName: "Position",
          description: "Position géographique",
        },
      },
    },
  },
  metadataGroups: {
    exempleGroup: {
      locales: {
        en: {
          groupFriendlyName: "Exemple Group",
          description: "Exemple group data",
        },
        fr: {
          groupFriendlyName: "Groupe Exemple",
          description: "Données du groupe exemple",
        },
      },
    },
    location: {
      locales: {
        en: {
          groupFriendlyName: "Location",
          description: "Location data",
        },
        fr: {
          groupFriendlyName: "Localisation",
          description: "Données de localisation",
        },
      },
    },
  },
};
