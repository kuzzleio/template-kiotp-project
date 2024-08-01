import { Workflow } from '@kuzzleio/plugin-workflows';

export const sampleNotificationWorkflow = new Workflow({
  name: 'Sample Notification workflow',
  description: `This workflow will trigger a task when a document is created in the index in which it is enabled.`,
  payloadPath: '.',
  disabled: false,
  trigger: {
    type: 'notification',
    collection: 'assets',
    filters: {
      exists: 'field',
    },
  },

  actions: [
    {
      name: 'log-task',
      type: 'task',
      args: {
        level: 'info',
        message: 'Realtime notification :  {{context.engineIndex}}',
      },
    },
  ],
  lifecycle: {},
});
