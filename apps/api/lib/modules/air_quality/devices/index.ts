import { DeviceManagerPlugin } from "kuzzle-device-manager";

import { IoTApplication } from "../../../IoTApplication";

import { AirlyDeviceDefinition } from "./Airly";
import { co2MeasureDefinition } from "./CO2Measurement";
import { waterMeasureDefinition } from "./WaterMeasurement";
import { illuminanceMeasureDefinition } from "./IlluminanceMeasurement";
import { IneoSenseACSSwitchDefinition } from "./IneoSenseACSSwitch";

export function registerDevicesModule(app: IoTApplication) {
  const deviceManager = app.plugin.get<DeviceManagerPlugin>("device-manager");

  deviceManager.models.registerMeasure("co2", co2MeasureDefinition);
  deviceManager.models.registerMeasure("water", waterMeasureDefinition);
  deviceManager.models.registerMeasure(
    "illuminance",
    illuminanceMeasureDefinition,
  );

  deviceManager.models.registerDevice("Airly", AirlyDeviceDefinition);
  deviceManager.models.registerDevice(
    "IneoSenseACSSwitch",
    IneoSenseACSSwitchDefinition,
  );
}
