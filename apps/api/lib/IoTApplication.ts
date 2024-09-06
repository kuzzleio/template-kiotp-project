import { registerKIoTP, EventIoTPlatformErrorSave, Module } from '@kuzzleio/iot-platform-backend';
import { Backend } from 'kuzzle';

import { DevicesModule } from './modules/devices';
import { MeasuresModule } from './modules/measures/MeasuresModule';
import { WorkflowsModule } from './modules/workflows';
import { TenantExample } from './modules/tenant_example/TenantExample';

export type IoTApplicationConfig = {
  someValue: string;
};

export class IoTApplication extends Backend {
  private modules: Module[] = [];

  get appConfig() {
    return this.config.content.application as IoTApplicationConfig;
  }

  constructor() {
    super('iot-application');

    this.hook.register<EventIoTPlatformErrorSave>('iot-platform:error:save', ({ error }) => {
      this.log.error(error);
    });

    this.modules = registerKIoTP(this, false);

    // Register custom modules here
    this.modules.push(new MeasuresModule(this)); // Register the measures models for your application
    this.modules.push(new DevicesModule(this)); // Register the devices models and decoders for your application
    this.modules.push(new WorkflowsModule(this)); // Register the  Workflows, Tasks, Predicates for your application

    // Register the example tenant that will be used to demonstrate the application
    // It defines a tenant with :
    // * custom asset model,
    // * custom roles, profiles, and policies,
    // * additionnal data collections
    this.modules.push(new TenantExample(this));

    for (const module of this.modules) {
      module.register();
    }
  }

  async start() {
    await super.start();

    for (const module of this.modules) {
      await module.init();
    }

    this.log.info('Application started');
  }
}
