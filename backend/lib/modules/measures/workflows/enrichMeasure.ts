import { DynamicObject, Task, Workflow, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { Inflector, KDocument } from "kuzzle";
import { BaseAssetContent, DeviceContent, MeasureContent, OriginType } from "kuzzle-device-manager";
import { ActiveChannelEnhancerArgs, ChannelEnhancerArgs, MeasureEnhancer } from "../MeasureEnhancer";

import { ProcessMeasurePayload } from "../types/ProcessMeasurePayload";

export const enrichMeasureWorkflow: Workflow = new Workflow({
  name: 'Workflow d\'enrichissement des mesures des cadres H2Frame',
  description: 'Calcul le nombre de mole, le poids et la voie active à la réception d\'une mesure',
  payloadPath: '.',
  trigger: {
    type: 'event',
    event: 'engine:{engine-index}:device-manager:measures:process:before',
    filters: {
      equals: { 'asset._source.type': 'H2Frame' }
    }
  },
  actions: [
    {
      type: 'task',
      name: 'enrich-measure',
      args: {
        activeChannel: {
          averageConsumptionThreshold: 3,
          windowSize: 10,
        },

        channel: {
          defaultVolume: 0.8,
        },
      }
    },
  ],
  lifecycle: {},
});

interface EnrichMeasureTaskArgs {
  activeChannel: ActiveChannelEnhancerArgs;

  channel: ChannelEnhancerArgs;
}

export class EnrichMeasureTask extends Task {
  private measureEnhancer: MeasureEnhancer;

  constructor (measureEnhancer: MeasureEnhancer) {
    super('enrich-measure');

    this.measureEnhancer = measureEnhancer;
  }

  async run (context: WorkflowContext, initiator: DynamicObject, args: EnrichMeasureTaskArgs): Promise<WorkflowContext> {
    const { measures, device, asset } = context.payload as ProcessMeasurePayload;

    const measuresCopy = measures.map(m => m);

    for (const measure of measuresCopy) {
      this.measureEnhancer.enrichChannel(measure, device, asset, args.channel);

      const activeChannel = await this.measureEnhancer.computeActiveChannel(
        context.engineIndex,
        measure,
        device,
        args.activeChannel);

      if (activeChannel) {
        measures.push(activeChannel);
      }
    }

    return context;
  }
}