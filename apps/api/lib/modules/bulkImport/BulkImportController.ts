import { Backend, Controller, KuzzleRequest } from "kuzzle";

import { BulkImportService } from "./BulkImportService";

export class BulkImportController extends Controller {
  private readonly service: BulkImportService;

  constructor(app: Backend, service: BulkImportService) {
    super(app);

    this.service = service;
    this.name = "bulk-import";

    this.definition = {
      actions: {
        import: {
          handler: this.parseAndImport,
        },
      },
    };
  }

  async parseAndImport(request: KuzzleRequest) {
    const currentIndex = request.getBodyString("currentIndex");
    const uniqueId = request.getBodyString("uniqueId");
    const fileContent = request.getBodyString("content");
    return this.service.parseAndImport(fileContent, currentIndex, uniqueId);
  }
}
