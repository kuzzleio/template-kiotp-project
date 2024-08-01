import { MeasureDefinition } from 'kuzzle-device-manager';

/**
 * Definition of a Sample measurement type
 */
export type SampleMeasurement = {
  aMeasure: number;
  anotherMeasure: string;
};

/**
 * Definition of a Sample measurement Elasticsearch mapping
 *
 */
export const sampleMeasureDefinition: MeasureDefinition = {
  valuesMappings: {
    aMeasure: { type: 'float' },
    anotherMeasure: { type: 'keyword' },
  },
};
