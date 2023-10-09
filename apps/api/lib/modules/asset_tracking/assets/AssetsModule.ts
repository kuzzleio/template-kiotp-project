import { DeviceManagerPlugin } from "kuzzle-device-manager";

import { Module } from "../../shared";

import { containerAssetDefinition } from "./Container";
import { truckAssetDefinition } from "./Truck";
import { warehouseAssetDefinition } from "./Warehouse";

export class AssetsModule extends Module {
  register(): void {
    const deviceManager =
      this.app.plugin.get<DeviceManagerPlugin>("device-manager");

    deviceManager.models.registerAsset(
      "asset_tracking",
      "Container",
      containerAssetDefinition,
    );

    deviceManager.models.registerAsset(
      "asset_tracking",
      "Truck",
      truckAssetDefinition,
    );

    deviceManager.models.registerAsset(
      "asset_tracking",
      "Warehouse",
      warehouseAssetDefinition,
    );
  }
}
