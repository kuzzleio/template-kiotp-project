import { WorkflowsPlugin } from '@kuzzleio/plugin-workflows';
import { SampleLogTask } from './SampleLogTask';
import { sampleEventWorkflow } from './SampleEventWorkflow';
import { sampleNotificationWorkflow } from './SampleNotificationWorkflow';
import { sampleScheduledWorkflow } from './SampleSchudledWorkflow';

import { Module } from '../shared';

export class WorkflowsModule extends Module {
  register(): void {
    const workflowManager = this.app.plugin.get<WorkflowsPlugin>('workflows');

    workflowManager.registerTask(new SampleLogTask());
    workflowManager.registerDefaultWorkflow(sampleEventWorkflow);
    workflowManager.registerDefaultWorkflow(sampleNotificationWorkflow);
    workflowManager.registerDefaultWorkflow(sampleScheduledWorkflow);
  }
}
