import {
  DecodedPayload,
  Decoder,
  HumidityMeasurement,
  TemperatureMeasurement,
} from "kuzzle-device-manager";
import { JSONObject } from "kuzzle";
import { has } from "lodash";

import { CO2Measurement } from "./CO2Measurement";
import { IlluminanceMeasurement } from "./IlluminanceMeasurement";

export class AirlyDecoder extends Decoder {
  public measures = [
    { name: "temperature", type: "temperature" },
    { name: "humidity", type: "humidity" },
    { name: "co2", type: "co2" },
    { name: "illuminance", type: "illuminance" },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceId: { type: "keyword" },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ["deviceId"]);

    const properties = ["temperature", "humidity", "co2", "illuminance"];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<AirlyDecoder>,
    payload: JSONObject,
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
      },
    );

    decodedPayload.addMeasurement<HumidityMeasurement>(deviceId, "humidity", {
      measuredAt,
      type: "humidity",
      values: {
        humidity: payload.humidity,
      },
    });

    decodedPayload.addMeasurement<CO2Measurement>(deviceId, "co2", {
      measuredAt,
      type: "co2",
      values: {
        co2: payload.co2,
      },
    });

    decodedPayload.addMeasurement<IlluminanceMeasurement>(
      deviceId,
      "illuminance",
      {
        measuredAt,
        type: "illuminance",
        values: {
          illuminance: payload.illuminance,
        },
      },
    );

    return decodedPayload;
  }
}
