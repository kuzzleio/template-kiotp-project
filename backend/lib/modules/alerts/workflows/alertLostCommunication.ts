import ms from 'ms';
import { DynamicObject, Workflow, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { KDocument } from "kuzzle";
import { DeviceContent } from "kuzzle-device-manager";

import { AlertTask, AlertTaskArgs } from "./AlertTask";
import { ProcessMeasurePayload } from '../../measures';

export const alertLostCommunicationWorkflow: Workflow = new Workflow({
  name: 'Alerte de perte de communication',
  description: 'Alerte déclenchée lorsque le dernier message a été reçu après un certain délai',
  payloadPath: '.',
  trigger: {
    type: 'event',
    event: 'engine:{engine-index}:device-manager:measures:process:after',
    filters: {}
  },
  actions: [
    {
      type: 'task',
      name: 'alert-lost-communication',
      args: {
        name: "Perte de communication",
        severity: "warning",
        enableOnMaintenance: true,
        notify: {
          disabled: false,
          message: "Hyvision: Perte de communication pour le capteur \"{deviceReference}\""
        },

        delay: "1h",
      }
    },
  ],
  lifecycle: {},
});

interface AlertLostCommunicationTaskArgs extends AlertTaskArgs {
  /**
   * Delay before considering we lost communication
   *
   * @example "1h"
   */
  delay: string;
}

export class AlertLostCommunicationTask extends AlertTask {
  constructor () {
    super('alert-lost-communication');
  }

  async runAlert (context: WorkflowContext, initiator: DynamicObject, args: AlertLostCommunicationTaskArgs): Promise<WorkflowContext> {
    const { device, measures } = context.payload as ProcessMeasurePayload;
    const delay = ms(args.delay);

    if (! delay) {
      // @todo mechanism to verify workflow args
      this.app.log.error(`[${context.engineIndex}] Cannot parse "args.delay". Expected "1h"`);
      return context;
    }

    const thresholdDate = Date.now() - delay;
    for (const measure of measures) {
      if (measure.type !== 'channel') {
        continue;
      }

      if (measure.measuredAt <= thresholdDate) {
        if (! await this.pendingAlertExists(context, args, device._id)) {
          await this.createAlert(context, args, 'device');
          const message = this.getMessage(args.notify.message, device);
          await this.notifySms(context, args, message);
        }
      }
      else {
        await this.acknowledgeAlert(context, args, device._id);
      }
  }

    return context;
  }

  private getMessage (templatedMessage: string, device: KDocument<DeviceContent>) {
    return templatedMessage
      .replace('{deviceReference}', device._source.reference);
  }
}