import { MeasureDefinition } from 'kuzzle-device-manager';

export type CO2Measurement = {
  co2: number;
};

export const co2MeasureDefinition: MeasureDefinition = {
  valuesMappings: { co2: { type: 'float' } },
};
