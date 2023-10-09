import { DeviceManagerPlugin } from "kuzzle-device-manager";

import { Module } from "../../shared";
import { brightnessMeasureDefinition } from "./BrightnessMeasurement";

import { karaDeviceDefinition } from "./Kara";
import { powerConsumptionMeasureDefinition } from "./PowerConsumptionMeasurement";

export class DevicesModule extends Module {
  register(): void {
    const deviceManager =
      this.app.plugin.get<DeviceManagerPlugin>("device-manager");

    deviceManager.models.registerDevice("Kara", karaDeviceDefinition);
    deviceManager.models.registerMeasure(
      "brightness",
      brightnessMeasureDefinition,
    );
    deviceManager.models.registerMeasure(
      "powerConsumption",
      powerConsumptionMeasureDefinition,
    );
  }
}
