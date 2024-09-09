import { MeasureModel } from '@kuzzleio/iot-platform-backend';

/**
 * Definition of a Sample measurement type
 */
export type SampleMeasurement = {
  aMeasure: number;
  anotherMeasure: string;
};

export const sampleMeasurement: MeasureModel = {
  /**
   * * Name of measurement
   */
  modelName: 'SampleMeasure',
  /**
   * * Definition of a Sample measurement Elasticsearch mapping
   */
  definition: {
    valuesMappings: {
      aMeasure: { type: 'float' },
      anotherMeasure: { type: 'keyword' },
    },
  },
};
