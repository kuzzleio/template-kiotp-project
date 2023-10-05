import {
  DecodedPayload,
  Decoder,
  BatteryMeasurement,
  HumidityMeasurement,
  TemperatureMeasurement,
} from 'kuzzle-device-manager';
import { JSONObject } from 'kuzzle';
import { has } from 'lodash';

export class IneoSenseACSSwitchDecoder extends Decoder {
  public measures = [
    { name: 'battery', type: 'battery' },
    { name: 'temperature', type: 'temperature' },
    { name: 'humidity', type: 'humidity' },
  ] as const;

  constructor() {
    super();

    this.action = 'ineo-sense-acs-switch';

    this.payloadsMappings = {
      deviceInfo: {
        properties: {
          devEui: { type: 'keyword' },
        },
      },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['deviceInfo.devEui']);

    const properties = ['data'];
    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<IneoSenseACSSwitchDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const rawPayload = Buffer.from(payload.data, 'base64');

    const deviceId = payload.deviceInfo.devEui;
    const measuredAt = new Date(payload.time).getTime() || Date.now();

    decodedPayload.addMeasurement<BatteryMeasurement>(deviceId, 'battery', {
      measuredAt,
      type: 'battery',
      values: {
        battery: 100 - rawPayload.readUInt8(16),
      },
    });

    decodedPayload.addMeasurement<TemperatureMeasurement>(deviceId, 'temperature', {
      measuredAt,
      type: 'temperature',
      values: {
        temperature: rawPayload.readUInt16BE(17) / 256,
      },
    });

    decodedPayload.addMeasurement<HumidityMeasurement>(deviceId, 'humidity', {
      measuredAt,
      type: 'humidity',
      values: {
        humidity: rawPayload.readUInt16BE(19) / 256,
      },
    });

    return decodedPayload;
  }
}
