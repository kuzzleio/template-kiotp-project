import { KIoTPApplication } from "../KIoTPApplication";

export abstract class Module {
  protected app: KIoTPApplication;

  protected get sdk () {
    return this.app.sdk;
  }

  constructor (app: KIoTPApplication) {
    this.app = app;
  }

  abstract register (): void;

  abstract init (): Promise<void>;
}