import { Measurement, MeasureDefinition } from '@kuzzleio/iot-backend';

export interface MaintenanceMeasurement extends Measurement {
  values: {
    maintenance: boolean;
  };
}

export const maintenanceMeasure: MeasureDefinition = {
  valuesMappings: { maintenance: { type: 'boolean' } },
  unit: {
    name: 'Maintenance mode',
    sign: '',
    type: 'boolean',
  },
};

