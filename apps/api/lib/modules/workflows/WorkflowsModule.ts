import { Module } from '@kuzzleio/iot-platform-backend';
import { WorkflowsPlugin } from '@kuzzleio/plugin-workflows';

import { SampleLogTask } from './SampleLogTask';
import { sampleEventWorkflow } from './SampleEventWorkflow';
import { sampleNotificationWorkflow } from './SampleNotificationWorkflow';
import { sampleScheduledWorkflow } from './SampleScheduledWorkflow';

export class WorkflowsModule extends Module {
  register(): void {
    const workflowManager = this.app.plugin.get<WorkflowsPlugin>('workflows');

    workflowManager.registerTask(new SampleLogTask());
    workflowManager.registerDefaultWorkflow(sampleEventWorkflow);
    workflowManager.registerDefaultWorkflow(sampleNotificationWorkflow);
    workflowManager.registerDefaultWorkflow(sampleScheduledWorkflow);
  }
}
