import { Measurement, MeasureDefinition } from '@kuzzleio/iot-backend';

export interface ChannelMeasurement extends Measurement {
  values: {
    temperature: number;
    pressure: number;
    mole?: number;
    weight?: number;
    consumption?: number;
  };
}

export const channelMeasure: MeasureDefinition = {
  valuesMappings: {
    temperature: { type: 'float' },
    pressure: { type: 'float' },
    mole: { type: 'float' },
    weight: { type: 'float' },
    consumption: { type: 'float' },
  },
  unit: {
    name: 'Channel',
    sign: '',
    type: '',
  },
};
