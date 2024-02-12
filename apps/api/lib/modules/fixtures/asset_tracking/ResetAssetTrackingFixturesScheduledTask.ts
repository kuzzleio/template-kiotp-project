import { ScheduledTask, ScheduledTaskContent } from '@kuzzleio/iot-platform-backend/node_modules/@kuzzleio/scheduler';

const taskContent: ScheduledTaskContent = {
  name: 'reset-asset-tracking-fixtures',
  action: {
    type: 'api',
    request: {
      controller: 'fixtures',
      action: 'reset',
      tenant: 'asset_tracking',
    },
  },
  description: 'Reset asset tracking fixtures every day at 4am',
  schedule: {
    syntax: 'cron',
    value: '0 4 30 * *',
  },
};

export const resetAssetTrackingFixturesScheduledTask = new ScheduledTask(taskContent);
