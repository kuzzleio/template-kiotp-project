import { Module } from "../shared";

import { AssetsModule } from "./assets";
import { DevicesModule } from "./devices";
import { PermissionsModule } from "./permissions";

export class TenantPublicLighting extends Module {
  private modules: Module[] = [];

  register(): void {
    this.modules.push(new DevicesModule(this.app));
    this.modules.push(new AssetsModule(this.app));
    this.modules.push(new PermissionsModule(this.app));

    for (const module of this.modules) {
      module.register();
    }
  }
}
