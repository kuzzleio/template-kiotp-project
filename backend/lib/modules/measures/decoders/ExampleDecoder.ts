import { JSONObject } from "kuzzle";
import {
  DecodedPayload,
  Decoder,
  MeasuresRegister,
  TemperatureMeasurement,
} from "@kuzzleio/iot-backend";

export class ExampleDecoder extends Decoder {
  constructor(measuresRegister: MeasuresRegister) {
    super(
      "Example",
      {
        temperature: "temperature",
      },
      measuresRegister
    );

    this.payloadsMappings = {
      reference: { type: "keyword" },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ["reference", "temperature", "date"]);

    return true;
  }

  async decode(payload: JSONObject): Promise<DecodedPayload> {
    const temperature: TemperatureMeasurement = {
      type: "temperature",
      measuredAt: payload.date,
      values: {
        temperature: Number(payload.temperature) + 273.15,
      },
    };

    const decodedPayload: DecodedPayload = {
      [payload.reference]: [temperature],
    };

    return decodedPayload;
  }
}
