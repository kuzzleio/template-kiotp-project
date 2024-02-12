import { MeasureDefinition } from 'kuzzle-device-manager';

export type MovementRecordMeasurement = {
  in: string | null;
  out: string | null;
};

export const movementRecordMeasureDefinition: MeasureDefinition = {
  valuesMappings: {
    in: { type: 'keyword' },
    out: { type: 'keyword' },
  },
};
