import {
  registerKIoTP,
  EventIoTPlatformErrorSave,
  Module as KIoTPModule,
} from '@kuzzleio/iot-platform-backend';
import { Backend } from 'kuzzle';

import { registerExempleTenant } from './modules/tenant_exemple';
import { Module } from './modules/shared';
import { DevicesModule } from './modules/devices';
import { MeasuresModule } from './modules/measures/MeasuresModule';
import { WorkflowsModule } from './modules/workflows';

export type IoTApplicationConfig = {
  someValue: string;
};

export class IoTApplication extends Backend {
  private readonly kiotpModules: KIoTPModule[] = [];

  private modules: Module[] = [];

  get appConfig() {
    return this.config.content.application as IoTApplicationConfig;
  }

  constructor() {
    super('iot-application');

    this.hook.register<EventIoTPlatformErrorSave>('iot-platform:error:save', ({ error }) => {
      this.log.error(error);
    });

    // this.config.content.plugins['kuzzle-plugin-logger'].services.stdout.level = 'debug';

    this.kiotpModules = registerKIoTP(this);

    // Register custom modules here
    this.modules.push(new MeasuresModule(this)); // Register the measures models for your application
    this.modules.push(new DevicesModule(this)); // Register the devices models and decoders for your application
    this.modules.push(new WorkflowsModule(this)); // Register the  Workflows, Tasks, Predicates for your application

    for (const module of this.modules) {
      module.register();
    }

    // Register the exemple tenant that will be used to demonstrate the application
    // It defines a tenant with :
    // * custom asset model,
    // * custom roles, profiles, and policies,
    // * additionnal data collections

    registerExempleTenant(this);
  }

  async start() {
    await super.start();

    for (const module of this.kiotpModules) {
      await module.init();
    }

    this.log.info('Application started');
  }
}
