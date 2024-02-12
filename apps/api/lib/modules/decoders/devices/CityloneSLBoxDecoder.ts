import { BatteryMeasurement, DecodedPayload, Decoder } from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

export class CityloneSLBoxDecoder extends Decoder {
  public measures = [{ name: 'battery', type: 'battery' }] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceEUI: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['deviceEUI']);

    const properties = [];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<CityloneSLBoxDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceEUI;

    const measuredAt = payload.timestamp || Date.now();

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
