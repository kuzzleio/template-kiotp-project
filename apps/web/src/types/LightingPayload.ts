import type { driverType } from '~/composables/useLamp';

export interface LightingOnOff {
  type: 0;
  onoff: 0 | 1;
  date?: Date;
}

export interface LightingLevel {
  type: 1;
  driver?: driverType;
  levels: number[];
}

interface LightingSchedulerBase {
  type: 2;
  driver?: driverType;
  levels: number[];
  start: Date;
  end?: Date;
}

export interface LightingSchedulerSingle extends LightingSchedulerBase {
  period: 0;
}

export interface LightingSchedulerDaily extends LightingSchedulerBase {
  period: 1;
}

export interface LightingSchedulerYearly extends LightingSchedulerBase {
  period: 2;
}
export interface LightingSchedulerWeekDay extends LightingSchedulerBase {
  period: 3;
  wday?: number[];
}

export type LightingScheduler =
  | LightingSchedulerSingle
  | LightingSchedulerDaily
  | LightingSchedulerYearly
  | LightingSchedulerWeekDay;
export type LightingRule = LightingOnOff | LightingLevel | LightingScheduler;
