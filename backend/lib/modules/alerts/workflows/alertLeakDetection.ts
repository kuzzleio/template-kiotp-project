import { DynamicObject, Workflow, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { KDocument } from "kuzzle";
import { BaseAssetContent, MeasureContent } from "kuzzle-device-manager";

import { ProcessMeasurePayload } from "../../measures";
import { AlertTask, AlertTaskArgs } from "./AlertTask";

export const alertLeakDetectionWorkflow: Workflow = new Workflow({
  name: 'Alerte fuite sur voie non active',
  description: 'Alerte déclenchée lorsqu\'une consommation est détectée sur la voie non active',
  payloadPath: '.',
  trigger: {
    type: 'event',
    event: 'engine:{engine-index}:device-manager:measures:process:after',
    filters: {}
  },
  actions: [
    {
      type: 'task',
      name: 'alert-leak-detection',
      args: {
        name: "Fuite",
        severity: "warning",
        enableOnMaintenance: false,
        notify: {
          disabled: false,
          message: "Hyvision: Fuite sur la voie non active \"{deviceReference}\" pour \"{assetReference}\""
        },
      }
    },
  ],
  lifecycle: {},
});

type AlertLeakDetectionTaskArgs = AlertTaskArgs

export class AlertLeakDetectionTask extends AlertTask {
  constructor () {
    super('alert-leak-detection');
  }

  async runAlert (context: WorkflowContext, initiator: DynamicObject, args: AlertLeakDetectionTaskArgs): Promise<WorkflowContext> {
    const { asset, measures, device } = context.payload as ProcessMeasurePayload;

    const activeChannel = asset._source.measures.find(m => m.type === 'activeChannel');

    if (! activeChannel) {
      return context;
    }

    for (const measure of measures) {
      if (measure.type !== 'channel') {
        continue;
      }

      if ( measure.assetMeasureName !== activeChannel.values.activeChannel
        && measure.values.consumption > 0
      ) {
        await this.createAlert(context, args, 'device');
        const message = this.templatedMessage(args, { asset, device });
        await this.notifySms(context, args, message);
      }
    }

    return context;
  }

  private getMessage (templatedMessage: string, asset: KDocument<BaseAssetContent>, measure: MeasureContent) {
    return templatedMessage
      // @todo put back reference in origin
      .replace('{deviceReference}', measure.origin.id.replace('Srett-', ''))
      .replace('{assetReference}', asset._source.reference);
  }
}