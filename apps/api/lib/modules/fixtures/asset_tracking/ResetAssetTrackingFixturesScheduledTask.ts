import { Workflow, WorkflowContent } from '@kuzzleio/plugin-workflows';

const content: WorkflowContent = {
  name: 'reset-asset-tracking-fixtures',
  description: 'Reset asset tracking fixtures every day at 4am',
  payloadPath: '.',
  trigger: {
    type: 'scheduler',
    schedule: {
      syntax: 'cron',
      value: '0 4 30 * *',
    },
  },
  actions: [
    {
      type: 'api',
      request: {
        controller: 'fixtures',
        action: 'reset',
        tenant: 'asset_tracking',
      },
    },
  ],
};

export const resetAssetTrackingFixturesScheduledTask = new Workflow(content);
