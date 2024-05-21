import { DecodedPayload, Decoder } from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

import { SampleMeasurement } from '../measures/SampleMeasurement';

export class SampleDeviceDecoder extends Decoder {
  public measures = [
    { name: 'aSampleMeasureSlot1', type: 'SampleMeasure' },
    { name: 'aSampleMeasureSlot2', type: 'SampleMeasure' },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceId: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['deviceId']);

    const properties = ['floatValue', 'textValue'];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<SampleDeviceDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceId;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<SampleMeasurement>(deviceId, 'aSampleMeasureSlot1', {
      measuredAt,
      type: 'SampleMeasure',
      values: {
        aMeasure: payload.floatValue,
        anotherMeasure: payload.textValue,
      },
    });

    decodedPayload.addMeasurement<SampleMeasurement>(deviceId, 'aSampleMeasureSlot2', {
      measuredAt,
      type: 'SampleMeasure',
      values: {
        aMeasure: payload.floatValue,
        anotherMeasure: payload.textValue,
      },
    });

    return decodedPayload;
  }
}
