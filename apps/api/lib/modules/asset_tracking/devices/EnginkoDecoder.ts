import {
  BatteryMeasurement,
  DecodedPayload,
  Decoder,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

export class EnginkoDecoder extends Decoder {
  public measures = [
    { name: 'temperature', type: 'temperature' },
    { name: 'battery', type: 'battery' },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceEUI: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['deviceEUI']);

    const properties = ['temperature', 'battery'];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<EnginkoDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceEUI;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<TemperatureMeasurement>(deviceId, 'temperature', {
      measuredAt,
      type: 'temperature',
      values: {
        temperature: payload.temperature,
      },
    });

    decodedPayload.addMeasurement<BatteryMeasurement>(deviceId, 'battery', {
      measuredAt,
      type: 'battery',
      values: {
        battery: payload.battery,
      },
    });

    return decodedPayload;
  }
}
