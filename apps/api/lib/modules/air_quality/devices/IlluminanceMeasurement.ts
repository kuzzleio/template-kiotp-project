import { MeasureDefinition } from 'kuzzle-device-manager';

export type IlluminanceMeasurement = {
  illuminance: number;
};

export const illuminanceMeasureDefinition: MeasureDefinition = {
  valuesMappings: { illuminance: { type: 'float' } },
};
