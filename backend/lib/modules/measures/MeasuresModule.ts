import { KIoTPApplication } from "../../KIoTPApplication";
import { Module } from "../Module";

export class MeasuresModule extends Module {
  constructor (app: KIoTPApplication) {
    super(app);
  }

  register () {
  }

  async init () {
    // Nothing here
  }
}