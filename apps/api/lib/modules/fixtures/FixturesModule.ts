import { SchedulerPlugin } from '@kuzzleio/iot-platform-backend/node_modules/@kuzzleio/scheduler';

import { Module } from '../shared';

import { resetAirQualityFixturesScheduledTask } from './air_quality/ResetAirQualityFixturesScheduledTask';
import { resetAssetTrackingFixturesScheduledTask } from './asset_tracking/ResetAssetTrackingFixturesScheduledTask';
import { FixturesController } from './FixturesController';

export class FixturesModule extends Module {
  register(): void {
    const schedulerPlugin = this.app.plugin.get<SchedulerPlugin>('scheduler');

    schedulerPlugin.registerEngineTask(resetAirQualityFixturesScheduledTask, {
      group: 'platform',
    });
    schedulerPlugin.registerEngineTask(resetAssetTrackingFixturesScheduledTask, {
      group: 'platform',
    });
    this.app.controller.use(new FixturesController(this.app));
  }
}
