import { WorkflowsPlugin } from '@kuzzleio/plugin-workflows';

import { Module } from '../shared';

import { resetAirQualityFixturesScheduledTask } from './air_quality/ResetAirQualityFixturesScheduledTask';
import { resetAssetTrackingFixturesScheduledTask } from './asset_tracking/ResetAssetTrackingFixturesScheduledTask';
import { FixturesController } from './FixturesController';

export class FixturesModule extends Module {
  register(): void {
    const workflows = this.app.plugin.get<WorkflowsPlugin>('workflows');

    workflows.registerDefaultWorkflow(resetAirQualityFixturesScheduledTask);
    workflows.registerDefaultWorkflow(resetAssetTrackingFixturesScheduledTask);

    this.app.controller.use(new FixturesController(this.app));
  }
}
