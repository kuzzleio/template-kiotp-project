import { DecodedPayload, Decoder } from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

import { BrightnessMeasurement } from './BrightnessMeasurement';
import { PowerConsumptionMeasurement } from './PowerConsumptionMeasurement';

export class KaraDecoder extends Decoder {
  public measures = [
    { name: 'brightness', type: 'brightness' },
    { name: 'powerConsumption', type: 'powerConsumption' },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceEUI: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['deviceEUI']);

    const properties = ['brightness', 'powerConsumption'];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<KaraDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceEUI;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<BrightnessMeasurement>(deviceId, 'brightness', {
      measuredAt,
      type: 'brightness',
      values: {
        lumens: payload.brightness,
      },
    });

    decodedPayload.addMeasurement<PowerConsumptionMeasurement>(deviceId, 'powerConsumption', {
      measuredAt,
      type: 'powerConsumption',
      values: {
        watt: payload.powerConsumption,
      },
    });

    return decodedPayload;
  }
}
