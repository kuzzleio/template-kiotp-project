import { Module } from "../Module";
import { VestalisController } from "./VestalisController";

export class VestalisModule extends Module {
  register () {
    this.app.controller.use(new VestalisController(this.app));
  }

  async init () {
    // Nothing here
  }
}