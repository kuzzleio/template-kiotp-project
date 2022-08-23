import { Module } from "../Module";
import { assetsMaintainer } from "./roles/assetsMaintainer";
import { devicesMaintainer } from "./roles/devicesMaintainer";

export class PermissionsModule extends Module {
  register () {
    this.app.import.roles({
      assets_maintainer: assetsMaintainer,
      devices_maintainer: devicesMaintainer,
    });
  }

  async init () {
    // Nothing here
  }
}
