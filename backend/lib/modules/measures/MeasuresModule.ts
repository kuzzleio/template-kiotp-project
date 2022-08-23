import { WorkflowsPlugin } from "@kuzzleio/plugin-workflows";
import { SchedulerPlugin } from "@kuzzleio/scheduler";

import { HyvisionApplication } from "../../HyvisionApplication";
import { Module } from "../Module";
import { MeasureController } from "./MeasureController";
import { MeasureEnhancer } from "./MeasureEnhancer";
import { fetchMeasuresTask } from "./tasks/fetchMeasuresTask";
import { EnrichMeasureTask } from "./workflows/enrichMeasure";

export class MeasuresModule extends Module {
  private measureEnhancer: MeasureEnhancer;

  constructor (app: HyvisionApplication) {
    super(app);

    this.measureEnhancer = new MeasureEnhancer(this.app);
  }

  register () {
    const schedulerPlugin = this.app.plugin.get<SchedulerPlugin>('scheduler');

    schedulerPlugin.registerEngineTask(fetchMeasuresTask, { group: 'platform' });

    this.app.controller.use(new MeasureController(this.app, this.measureEnhancer));

    const enrichMeasureTask = new EnrichMeasureTask(this.measureEnhancer);
    this.app.plugin.get<WorkflowsPlugin>('workflows').registerTask(enrichMeasureTask);
  }

  async init () {
    // Nothing here
  }
}