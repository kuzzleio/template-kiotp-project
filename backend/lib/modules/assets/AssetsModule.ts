import { KIoTPApplication } from "../../KIoTPApplication";
import { Module } from "../Module";

export class AssetsModule extends Module {
  constructor (app: KIoTPApplication) {
    super(app);

    this.app = app;
  }

  register () {
  }

  async init () {
  }
}
