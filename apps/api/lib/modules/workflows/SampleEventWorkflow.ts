import { Workflow } from '@kuzzleio/plugin-workflows';

export const sampleEventWorkflow = new Workflow({
  name: 'Sample Event workflow',
  description: `This workflow will trigger a task when a document is created in the index in which it is enabled.`,
  payloadPath: '.',
  disabled: false,
  trigger: {
    type: 'event',
    event: 'document:afterCreate',
  },
  actions: [
    {
      name: 'log-task',
      type: 'task',
      args: {
        level: 'info',
        message: 'Document created in index :  {{context.engineIndex}}',
      },
    },
  ],
  lifecycle: {},
});
