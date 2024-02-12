import { JSONObject } from 'kuzzle';

export interface LogMessage {
  message: string;
  params?: JSONObject;
}

export type LogType = 'error' | 'warning' | 'success' | 'kuzzle_error';

export interface Log {
  log: LogMessage;
  type: LogType;
}
