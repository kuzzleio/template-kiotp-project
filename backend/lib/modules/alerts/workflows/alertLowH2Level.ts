import { DynamicObject, Workflow, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { Inflector, KDocument } from "kuzzle";
import { BaseAssetContent } from "kuzzle-device-manager";

import { ProcessMeasurePayload } from "../../measures";
import { AlertTask, AlertTaskArgs } from "./AlertTask";

export const alertLowH2LevelWorkflow: Workflow = new Workflow({
  name: 'Alerte Seuil de H2 bas',
  description: 'Alerte déclenchée lorsque le seuil de H2 est bas dans les 4 voies',
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
      name: 'alert-low-h2-level',
      args: {
        name: "Seuil H2 bas",
        severity: "warning",
        enableOnMaintenance: false,
        notify: {
          disabled: false,
          message: "Hyvision: Seuil H2 bas pour \"{assetReference}\""
        },

        lowLevelThreshold: "10%",
      }
    },
  ],
  lifecycle: {},
});

interface AlertLowH2LevelTaskArgs extends AlertTaskArgs {
  /**
   * Threshold below which the level is considered low
   *
   * @example "10%"
   */
  lowLevelThreshold: string;
}

export class AlertLowH2LevelTask extends AlertTask {
  constructor () {
    super('alert-low-h2-level');
  }

  async runAlert (context: WorkflowContext, initiator: DynamicObject, args: AlertLowH2LevelTaskArgs): Promise<WorkflowContext> {
    const { asset } = context.payload as ProcessMeasurePayload;

    const percentageThreshold = parseFloat(args.lowLevelThreshold);

    if (isNaN(percentageThreshold)) {
      // @todo mechanism to verify workflow args
      this.app.log.error(`[${context.engineIndex}] Cannot parse "args.lowLevelThreshold" percentage for low h2 level alert. Expected "xx%"`);
      return context;
    }

    let lowFrameCount = 0;

    for (const measure of asset._source.measures) {
      if (measure.type !== 'channel') {
        continue;
      }

      const frameName = `frame${Inflector.upFirst(measure.assetMeasureName)}`;

      const frame = asset._source.metadata.find(({ key }) => key === frameName);

      if (! frame) {
        continue;
      }

      const maxH2Metadata = frame.value.object.find(({ key }) => key === 'maxH2');

      if (! maxH2Metadata) {
        this.app.log.warn(`Cannot find "${frameName}.maxH2" metadata for asset "${asset._id}"`);
        continue;
      }

      // @todo value is a float but stored in "value.integer"
      const lowThreshold = maxH2Metadata.value.integer * percentageThreshold / 100;
      if (measure.values.weight <= lowThreshold) {
        lowFrameCount++;
      }
    }

    if (lowFrameCount === 4) {
      if (! await this.pendingAlertExists(context, args, asset._id)) {
        await this.createAlert(context, args, 'asset');
        const message = this.getMessage(args.notify.message, asset);
        await this.notifySms(context, args, message);
      }
    }
    else {
      await this.acknowledgeAlert(context, args, asset._id);
    }

    return context;
  }

  private getMessage (templatedMessage: string, asset: KDocument<BaseAssetContent>) {
    return templatedMessage
      .replace('{assetReference}', asset._source.reference);
  }
}