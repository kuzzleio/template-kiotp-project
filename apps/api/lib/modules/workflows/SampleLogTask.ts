import { Rule, Task, Workflow, WorkflowContext, WorkflowTrigger } from '@kuzzleio/plugin-workflows';
import { JSONObject } from 'kuzzle-sdk';

export class SampleLogTask extends Task {
  constructor() {
    super('log-task');

    this.description = 'Produce a log message when triggered by a workflow';

    this.argumentsDescription = {
      level: {
        description: 'Log level (debug, info, warn, error)',
        type: 'string',
      },
      message: {
        description: 'Log message to produce',
        type: 'string',
      },
    };
  }

  async run(
    workflowContext: WorkflowContext,
    initiator: Workflow<WorkflowTrigger> | Rule,
    args: JSONObject,
  ): Promise<WorkflowContext> {
    try {
      this.context.log[args.level](args.message);
    } catch (error) {
      this.context.log.error(`Invalid log level: ${args.level} in workflow ${initiator._id}`);
    }
    return workflowContext;
  }
}
