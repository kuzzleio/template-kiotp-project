import { DeviceManagerPlugin } from "kuzzle-device-manager";

import { IoTApplication } from "../../../IoTApplication";

import { roomAssetDefinition } from "./Room";

export function registerAssetsModule(app: IoTApplication) {
  const deviceManager = app.plugin.get<DeviceManagerPlugin>("device-manager");

  deviceManager.models.registerAsset(
    "air_quality",
    "Room",
    roomAssetDefinition,
  );
}
