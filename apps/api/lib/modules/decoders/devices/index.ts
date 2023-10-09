import { DeviceManagerPlugin } from "kuzzle-device-manager";

import { IoTApplication } from "../../../IoTApplication";

import { co2MeasureDefinition } from "../../air_quality/devices/CO2Measurement";
import { waterMeasureDefinition } from "../../air_quality/devices/WaterMeasurement";

export * from "./DevicesModule";

export function registerDevicesModule(app: IoTApplication) {
  const deviceManager = app.plugin.get<DeviceManagerPlugin>("device-manager");
  deviceManager.models.registerMeasure("co2", co2MeasureDefinition);
  deviceManager.models.registerMeasure("water", waterMeasureDefinition);
}
