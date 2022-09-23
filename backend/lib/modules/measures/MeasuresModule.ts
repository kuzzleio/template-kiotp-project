import { KIoTPApplication } from "../../KIoTPApplication";
import { Module } from "../Module";

export class MeasuresModule extends Module {
  constructor(app: KIoTPApplication) {
    super(app);
  }

  register() {
    // Nothing here
  }

  async init() {
    // Nothing here
  }
}
