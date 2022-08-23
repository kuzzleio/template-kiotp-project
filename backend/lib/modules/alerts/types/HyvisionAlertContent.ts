import { AlertContent } from "@kuzzleio/iot-backend";

export type HyvisionAlertSeverity = 'critical' | 'warning';

export interface HyvisionAlertContent extends Partial<AlertContent> {
  severity: HyvisionAlertSeverity;
}
