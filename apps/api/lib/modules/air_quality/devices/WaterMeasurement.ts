import { MeasureDefinition } from 'kuzzle-device-manager';

export type WaterMeasurement = {
  water: number;
};

export const waterMeasureDefinition: MeasureDefinition = {
  valuesMappings: { water: { type: 'float' } },
};
