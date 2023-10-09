import { ScheduledTask, ScheduledTaskContent } from "@kuzzleio/scheduler";

const taskContent: ScheduledTaskContent = {
  name: "reset-air-quality-fixtures",
  action: {
    type: "api",
    request: {
      controller: "fixtures",
      action: "reset",
      tenant: "public_lighting",
    },
  },
  description: "Reset public lighting fixtures every day at 4am",
  schedule: {
    syntax: "cron",
    value: "0 4 * * *",
  },
};

export const resetPublicLightingFixturesScheduledTask = new ScheduledTask(
  taskContent,
);
