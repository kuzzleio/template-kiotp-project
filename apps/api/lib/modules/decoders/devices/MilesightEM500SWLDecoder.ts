import { BatteryMeasurement, DecodedPayload, Decoder } from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';
import { WaterMeasurement } from '../../air_quality/devices/WaterMeasurement';

export class MilesightEM500SWLDecoder extends Decoder {
  /**
   * Declare the measure extracted by this Decoder
   */
  public measures = [
    { name: 'water', type: 'water' },
    { name: 'battery', type: 'battery' },
  ] as const;

  constructor() {
    super(); //DEVICE MODEL
    this.payloadsMappings = {
      devEUI: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['devEUI']);

    const properties = ['water'];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<MilesightEM500SWLDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.devEUI;
    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<BatteryMeasurement>(deviceId, 'battery', {
      measuredAt,
      type: 'battery',
      values: {
        battery: payload.battery,
      },
    });

    decodedPayload.addMeasurement<WaterMeasurement>(deviceId, 'water', {
      measuredAt,
      type: 'water',
      values: {
        water: payload.water,
      },
    });
    return decodedPayload;
  }
}
