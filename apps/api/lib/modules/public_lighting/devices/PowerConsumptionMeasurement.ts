import { MeasureDefinition } from 'kuzzle-device-manager';

export type PowerConsumptionMeasurement = {
  watt: number;
};

export const powerConsumptionMeasureDefinition: MeasureDefinition = {
  valuesMappings: { watt: { type: 'float' } },
};
