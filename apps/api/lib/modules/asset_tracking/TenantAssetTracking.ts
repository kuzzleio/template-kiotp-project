import { WorkflowsPlugin } from '@kuzzleio/plugin-workflows';
import { DeviceManagerPlugin } from 'kuzzle-device-manager';

import { Module } from '../shared';

import { AssetsModule } from './assets';
import { DevicesModule } from './devices';
import { movementRecordMeasureDefinition } from './measures';
import {
  enrichmentWorkflow,
  assetTruckGeofencingRule,
  CreateMovementRecordTask,
} from './rules-engine';
import { PermissionsModule } from './permissions';

export class TenantAssetTracking extends Module {
  private modules: Module[] = [];

  register(): void {
    const workflowsPlugin = this.app.plugin.get<WorkflowsPlugin>('workflows');
    workflowsPlugin.registerDefaultRule(assetTruckGeofencingRule, {
      group: 'asset_tracking',
    });
    workflowsPlugin.registerDefaultWorkflow(enrichmentWorkflow, {
      group: 'asset_tracking',
    });
    workflowsPlugin.registerTask(new CreateMovementRecordTask());

    const deviceManagerPlugin = this.app.plugin.get<DeviceManagerPlugin>('device-manager');
    deviceManagerPlugin.models.registerMeasure('movementRecord', movementRecordMeasureDefinition);

    this.modules.push(new DevicesModule(this.app));
    this.modules.push(new AssetsModule(this.app));
    this.modules.push(new PermissionsModule(this.app));

    for (const module of this.modules) {
      module.register();
    }
  }
}
