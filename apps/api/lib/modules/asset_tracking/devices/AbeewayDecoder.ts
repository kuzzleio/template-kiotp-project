import {
  BatteryMeasurement,
  DecodedPayload,
  Decoder,
  PositionMeasurement,
  TemperatureMeasurement,
} from "kuzzle-device-manager";
import { JSONObject } from "kuzzle";
import { has } from "lodash";

export class AbeewayDecoder extends Decoder {
  public measures = [
    { name: "position", type: "position" },
    { name: "externalTemperature", type: "temperature" },
    { name: "internalTemperature", type: "temperature" },
    { name: "battery", type: "battery" },
  ] as const;

  constructor() {
    super();

    this.payloadsMappings = {
      deviceEUI: { type: "keyword" },
    };
  }

  async validate(payload: JSONObject): Promise<boolean> {
    this.ensureProperties(payload, ["deviceEUI"]);

    const properties = [
      "lat",
      "lon",
      "battery",
      "externalTemperature",
      "internalTemperature",
    ];

    return properties.every((property) => has(payload, property));
  }

  async decode(
    decodedPayload: DecodedPayload<AbeewayDecoder>,
    payload: JSONObject,
  ): Promise<DecodedPayload<Decoder>> {
    const deviceId = payload.deviceEUI;

    const measuredAt = payload.timestamp || Date.now();

    decodedPayload.addMeasurement<PositionMeasurement>(deviceId, "position", {
      measuredAt,
      type: "position",
      values: {
        position: {
          lat: payload.lat,
          lon: payload.lon,
        },
      },
    });

    decodedPayload.addMeasurement<BatteryMeasurement>(deviceId, "battery", {
      measuredAt,
      type: "battery",
      values: {
        battery: payload.battery,
      },
    });

    decodedPayload.addMeasurement<TemperatureMeasurement>(
      deviceId,
      "externalTemperature",
      {
        measuredAt,
        type: "temperature",
        values: {
          temperature: payload.externalTemperature,
        },
      },
    );

    decodedPayload.addMeasurement<TemperatureMeasurement>(
      deviceId,
      "internalTemperature",
      {
        measuredAt,
        type: "temperature",
        values: {
          temperature: payload.internalTemperature,
        },
      },
    );

    return decodedPayload;
  }
}
