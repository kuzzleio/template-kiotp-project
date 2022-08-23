import { ScheduledTask } from '@kuzzleio/scheduler';

export const fetchMeasuresTask = new ScheduledTask({
  name: 'fetchMeasuresTask',
  description: 'fetch measures',
  schedule: {
    syntax: 'cron',
    value: '*/5 * * * *',
  },
  action: {
    request: {
      action: 'fetch',
      controller: 'byes/vestalis',
    },
    type: 'api',
  },
});
