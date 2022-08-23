import { Measurement, MeasureDefinition } from '@kuzzleio/iot-backend';

export interface ActiveChannelMeasurement extends Measurement {
  values: {
    activeChannel: string;
    averageConsumption: number;
  };
}

export const activeChannelMeasure: MeasureDefinition = {
  valuesMappings: {
    activeChannel: { type: 'keyword' },
    averageConsumption: { type: 'float' },
  },
  unit: {
    name: 'Active Channel',
    sign: '',
    type: 'boolean',
  },
};

