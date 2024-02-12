import { BulkImportController } from './BulkImportController';
import { BulkImportService } from './BulkImportService';

import { Module } from '../shared';
import { IoTApplication } from '../../IoTApplication';

export class BulkImportModule extends Module {
  constructor(app: IoTApplication) {
    super(app);
  }

  register(): void {
    const service = new BulkImportService(this.app);
    this.app.controller.use(new BulkImportController(this.app, service));
  }

  async init() {
    // Nothing here
  }
}
