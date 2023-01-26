import {
  DecodedPayload,
  Decoder,
  HumidityMeasurement,
  TemperatureMeasurement,
} from "@kuzzleio/iot-backend";
import { JSONObject } from "kuzzle";
import { has } from "lodash";
import { CO2Measurement } from "./CO2Measurement";

export class ExampleDecoder extends Decoder {
  public measures = [
    { name: "temperature", type: "temperature" },
    { name: "co2", type: "co2" },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceId: { type: "keyword" },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ["deviceId"]);

    const properties = ["temperature", "co2"];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<ExampleDecoder>,
    payload: JSONObject
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceId;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<TemperatureMeasurement>(
      deviceId,
      "temperature",
      {
        measuredAt,
        type: "temperature",
        values: {
          temperature: payload.temperature,
        },
      }
    );

    decodedPayload.addMeasurement<CO2Measurement>(deviceId, "co2", {
      measuredAt,
      type: "co2",
      values: {
        co2: payload.co2,
      },
    });

    return decodedPayload;
  }
}