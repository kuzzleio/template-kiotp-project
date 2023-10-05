import { Workflow, WorkflowContent } from '@kuzzleio/plugin-workflows';

const enrichmentWorkflowContent: WorkflowContent = {
  name: 'Enrichment Workflow',
  description: 'Workflow to enrich devices, assets and measures in the ingestion pipeline',
  payloadPath: '.',
  trigger: {
    type: 'event',
    event: 'engine:{engine-index}:device-manager:measures:persist:before',
  },
  actions: [
    {
      type: 'rule',
      name: 'asset-truck-geofencing',
    },
  ],
};

export const enrichmentWorkflow = new Workflow(enrichmentWorkflowContent);
