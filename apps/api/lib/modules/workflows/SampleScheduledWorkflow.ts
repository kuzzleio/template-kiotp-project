import { Workflow } from '@kuzzleio/plugin-workflows';

export const sampleScheduledWorkflow = new Workflow({
  name: 'Sample Scheduled workflow',
  description: `This workflow will trigger every other minute for each tenant in which it is enabled.`,
  payloadPath: '.',
  disabled: false,
  trigger: {
    type: 'scheduler',
    schedule: {
      syntax: 'cron',
      value: '*/2 * * * *',
    },
  },

  actions: [
    {
      name: 'log-task',
      type: 'task',
      args: {
        level: 'info',
        message: 'Schedule notification :  {{context.engineIndex}}',
      },
    },
  ],
  lifecycle: {},
});
