import { Module } from "../shared";

import { DevicesModule } from "./devices";

export class TenantDecoders extends Module {
  private modules: Module[] = [];

  register(): void {
    this.modules.push(new DevicesModule(this.app));

    for (const module of this.modules) {
      module.register();
    }
  }
}
