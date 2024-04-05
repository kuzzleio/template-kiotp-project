import { Workflow, WorkflowContent } from '@kuzzleio/plugin-workflows';

const content: WorkflowContent = {
  name: 'reset-air-quality-fixtures',
  description: 'Reset air quality fixtures every day at 4am',
  payloadPath: '.',
  trigger: {
    type: 'scheduler',
    schedule: {
      syntax: 'cron',
      value: '0 4 * * *',
    },
  },
  actions: [
    {
      type: 'api',
      request: {
        controller: 'fixtures',
        action: 'reset',
        tenant: 'air_quality',
      },
    },
  ],
};

export const resetAirQualityFixturesScheduledTask = new Workflow(content);
