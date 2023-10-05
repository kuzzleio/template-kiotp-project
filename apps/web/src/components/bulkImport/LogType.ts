import { locales } from '~/locales/en.json';

const bulkImportLocales = locales.bulkImport;

export enum LogType {
  error = 'red',
  warning = 'orange',
  success = 'black',
}

interface BulkImportLog {
  message: string;
  params: string;
}

interface BulkImportError {
  type: 'kuzzle_error';
  log: BulkImportLog;
}

interface BulkImportMessage {
  type: keyof typeof LogType;
  log: BulkImportLog & {
    message: Extract<keyof (typeof bulkImportLocales)['log'], string>;
  };
}

export type BulkImportContent = BulkImportError | BulkImportMessage;
