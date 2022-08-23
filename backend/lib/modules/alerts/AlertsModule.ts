import { MaintenanceController } from './MaintenanceController';
import { hyvisionAlertsCollection } from './collections/alerts';
import { Module } from '../Module';

export class AlertsModule extends Module {
  register () {
    this.app.pipe.register(
      'multi-tenancy/tenant:afterCreate',
      async (request) => {
        // @todo this should be done with AppBuilder
        await this.registerHyvisionAlerts(request.result.index);

        return request;
      });

    this.app.controller.use(new MaintenanceController(this.app));
  }

  async init () {
    // Nothing here
  }

  private async registerHyvisionAlerts (engineId: string) {
    await this.sdk.collection.update(engineId, 'alerts', hyvisionAlertsCollection as any);
  }
}