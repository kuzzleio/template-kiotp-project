import { Backend } from "kuzzle";
import { registerKIoTP } from "@kuzzleio/iot-backend";

import { registerCommons } from "./application-builder/commons";

import { AssetsModule } from "./modules/assets";
import { MeasuresModule } from "./modules/measures";

export type KIoTPApplicationConfig = {
  hermes: {
    twilio: {
      accountSid: string;
      defaultSender: string;
    };
  };
};

export class KIoTPApplication extends Backend {
  private assets: AssetsModule;
  private measures: MeasuresModule;

  get appConfig() {
    return this.config.content.application as KIoTPApplicationConfig;
  }

  constructor() {
    super("<name>-application");

    this.measures = new MeasuresModule(this);
    this.assets = new AssetsModule(this);
  }

  async start() {
    registerKIoTP(this);

    registerCommons(this);

    this.measures.register();
    this.assets.register();

    await super.start();

    await this.measures.init();
    await this.assets.init();
  }
}
