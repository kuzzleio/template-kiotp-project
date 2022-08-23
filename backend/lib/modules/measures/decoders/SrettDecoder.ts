import { BadRequestError, JSONObject } from 'kuzzle';
import { DecodedPayload, Decoder, MeasuresRegister } from '@kuzzleio/iot-backend';
import { ChannelMeasurement } from '../ChannelMeasure';

export class SrettDecoder extends Decoder {
  constructor(measuresRegister: MeasuresRegister) {
    super('Srett', {
      channel: 'channel',
    }, measuresRegister);

    this.payloadsMappings = {
      reference: { type: 'keyword' },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ['reference', 'temperature', 'pressure', 'date']);

    return true;
  }

  async decode(payload: JSONObject): Promise<DecodedPayload> {
    let measuredAt;

    if (payload.date.includes('T')) {
      measuredAt = new Date(payload.date).getTime();
    }
    else {
      const [date, time] = payload.date.toString().split(' ');
      measuredAt = new Date(`${date}T${time}Z`).getTime();
    }

    if (isNaN(measuredAt)) {
      throw new BadRequestError(`Malformed date "${payload.date}". Expect "YYYY-MM-DD hh:mm:ss"`);
    }

    const channel: ChannelMeasurement = {
      type: 'channel',
      measuredAt,
      values: {
        temperature: Number(payload.temperature) + 273.15,
        pressure: payload.pressure * 100000,
      }
    };

    const decodedPayload: DecodedPayload = {
      [payload.reference]: [channel],
    };

    return decodedPayload;
  }
}
