import { ScheduledTask, ScheduledTaskContent } from '@kuzzleio/iot-platform-backend/node_modules/@kuzzleio/scheduler';

const taskContent: ScheduledTaskContent = {
  name: 'reset-air-quality-fixtures',
  action: {
    type: 'api',
    request: {
      controller: 'fixtures',
      action: 'reset',
      tenant: 'air_quality',
    },
  },
  description: 'Reset air quality fixtures every day at 4am',
  schedule: {
    syntax: 'cron',
    value: '0 4 * * *',
  },
};

export const resetAirQualityFixturesScheduledTask = new ScheduledTask(taskContent);
