import { DynamicObject, Workflow, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { KDocument } from "kuzzle";
import { BaseAssetContent, DeviceContent, MeasureContent } from "kuzzle-device-manager";

import { ProcessMeasurePayload } from "../../measures";
import { AlertTask, AlertTaskArgs } from "./AlertTask";

export const alertHoseRuptureWorkflow: Workflow = new Workflow({
  name: 'Alerte rupture de flexible',
  description: 'Alerte déclenchée lorsque la pression d\'une voie passe en dessous d\'un seuil',
  payloadPath: '.',
  trigger: {
    type: 'event',
    event: 'engine:{engine-index}:device-manager:measures:process:after',
    filters: {
      equals: { 'asset._source.type': 'H2Frame' }
    }
  },
  actions: [
    {
      type: 'task',
      name: 'alert-hose-rupture',
      args: {
        name: "Rupture de flexible",
        severity: "critical",
        enableOnMaintenance: false,
        notify: {
          disabled: false,
          message: "Hyvision: Rupture de flexible pour \"{assetReference}\" sur la voie \"{channel}\""
        },

        pressureRuptureThreshold: 50000,
      }
    },
  ],
  lifecycle: {},
});

interface AlertHoseRuptureTaskArgs extends AlertTaskArgs {
  /**
   * @example 50000
   */
   pressureRuptureThreshold: string;
}

export class AlertHoseRuptureTask extends AlertTask {
  constructor () {
    super('alert-hose-rupture');
  }

  async runAlert (context: WorkflowContext, initiator: DynamicObject, args: AlertHoseRuptureTaskArgs): Promise<WorkflowContext> {
    const { asset, device } = context.payload as ProcessMeasurePayload;

    const pressureRuptureThreshold = parseFloat(args.pressureRuptureThreshold);
    if (isNaN(pressureRuptureThreshold)) {
      // @todo mechanism to verify workflow args
      this.app.log.error(`[${context.engineIndex}] Cannot parse "args.pressureRuptureThreshold". Expect a number.`);
      return context;
    }

    for (const measure of device._source.measures) {
      if (measure.type !== 'channel') {
        continue;
      }

      if (measure.values.pressure < args.pressureRuptureThreshold) {
        // @todo should be on the device
        if (! await this.pendingAlertExists(context, args, device._id)) {
          await this.createAlert(context, args, 'device');
          const message = this.templatedMessage(args, { asset, device });
          await this.notifySms(context, args, message);
        }
      }
      else {
        await this.acknowledgeAlert(context, args, asset._id);
      }
    }

    return context;
  }
}