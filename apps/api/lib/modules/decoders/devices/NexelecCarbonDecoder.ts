import {
  DecodedPayload,
  Decoder,
  HumidityMeasurement,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';
import { CO2Measurement } from '../../air_quality/devices/CO2Measurement';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

export class NexelecCarbonDecoder extends Decoder {
  public measures = [
    { name: 'humidity', type: 'humidity' },
    { name: 'co2', type: 'co2' },
    { name: 'temperature', type: 'temperature' },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      devEUI: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['devEUI']);

    const properties = ['humidity', 'co2', 'temperature'];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<NexelecCarbonDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.devEUI;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<CO2Measurement>(deviceId, 'co2', {
      measuredAt,
      type: 'co2',
      values: {
        co2: payload.co2,
      },
    });

    decodedPayload.addMeasurement<HumidityMeasurement>(deviceId, 'humidity', {
      measuredAt,
      type: 'humidity',
      values: {
        humidity: payload.humidity,
      },
    });

    decodedPayload.addMeasurement<TemperatureMeasurement>(deviceId, 'temperature', {
      measuredAt,
      type: 'temperature',
      values: {
        temperature: payload.temperature,
      },
    });

    return decodedPayload;
  }
}
