import { Backend } from 'kuzzle';
import { registerKIoTP } from '@kuzzleio/iot-backend';

import { registerTenantHyvision } from './application-builder/tenant-hyvision';
import { registerCommons } from './application-builder/commons';

import { PermissionsModule } from './modules/permissions';
import { VestalisModule } from './modules/Vestalis';
import { NotificationModule } from './modules/notification';
import { AssetsModule } from './modules/assets';
import { MeasuresModule } from './modules/measures';
import { AlertsModule } from './modules/alerts';
import { ErrorModule } from './modules/error';

export type HyvisionApplicationConfig = {
  hermes: {
    twilio: {
      accountSid: string;
      defaultSender: string;
    };
  };
};

export class HyvisionApplication extends Backend {
  private permissions: PermissionsModule;
  private notification: NotificationModule;
  private error: ErrorModule;
  private assets: AssetsModule;
  private alerts: AlertsModule;
  private measures: MeasuresModule;
  private vestalis: VestalisModule;

  get appConfig() {
    return this.config.content.application as HyvisionApplicationConfig;
  }

  constructor() {
    super('hyvision');

    this.permissions = new PermissionsModule(this);
    this.measures = new MeasuresModule(this);
    this.assets = new AssetsModule(this);
    this.notification = new NotificationModule(this);
    this.error = new ErrorModule(this);
    this.alerts = new AlertsModule(this);
    this.vestalis = new VestalisModule(this);
  }

  async start() {
    registerKIoTP(this);

    registerTenantHyvision();
    registerCommons(this);

    this.permissions.register();
    this.measures.register();
    this.assets.register();
    this.notification.register();
    this.error.register();
    this.alerts.register();
    this.vestalis.register();

    await super.start();

    await this.permissions.init();
    await this.measures.init();
    await this.assets.init();
    await this.notification.init();
    await this.error.init();
    await this.alerts.init();
    await this.vestalis.init();

    await this.initPlatformEngine();
  }

  private async initPlatformEngine () {
    const { result } = await this.sdk.query({
      action: 'exists',
      controller: 'scheduler/engine',
      index: 'platform',
      group: 'platform',
    });

    if (!result.exists) {
      await this.sdk.query({
        action: 'create',
        controller: 'scheduler/engine',
        index: 'platform',
        group: 'platform',
      });
    }
  }
}
