import {
  registerKIoTP,
  EventIoTPlatformErrorSave,
  Module as KIoTPModule,
} from '@kuzzleio/iot-platform-backend';
import { Backend } from 'kuzzle';

import { registerTenantAirQuality } from './modules/air_quality';
import { TenantAssetTracking } from './modules/asset_tracking/TenantAssetTracking';
import { BulkImportModule } from './modules/bulkImport/BulkImportModule';
import { TenantDecoders } from './modules/decoders/TenantDecoders';
import { FixturesModule } from './modules/fixtures';
import { TenantPublicLighting } from './modules/public_lighting/TenantPublicLighting';
import { Module } from './modules/shared';

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

    this.kiotpModules = registerKIoTP(this);

    this.modules.push(new FixturesModule(this));
    this.modules.push(new BulkImportModule(this));

    // Register tenants modules
    this.modules.push(new TenantAssetTracking(this));
    this.modules.push(new TenantDecoders(this));
    this.modules.push(new TenantPublicLighting(this));

    this.config.content.plugins['kuzzle-plugin-logger'].services.stdout.level = 'debug';

    for (const module of this.modules) {
      module.register();
    }
    registerTenantAirQuality(this);
  }

  async start() {
    await super.start();

    for (const module of this.kiotpModules) {
      await module.init();
    }

    this.log.info('Application started');
  }
}
