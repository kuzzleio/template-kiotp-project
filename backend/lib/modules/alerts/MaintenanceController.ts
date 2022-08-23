import { Controller, KuzzleRequest } from 'kuzzle';

import { HyvisionApplication } from '../../HyvisionApplication';

export class MaintenanceController extends Controller {
  constructor(app: HyvisionApplication) {
    super(app);

    this.name = 'byes/maintenance';

    this.definition = {
      actions: {
        maintenance: {
          handler: this.maintenance,
          http: [{ verb: 'put', path: 'hyvision/:engineId/assets/:assetId/_maintenance' }],
        },
      },
    };
  }

  async maintenance (request: KuzzleRequest) {
    const engineId = request.getString('engineId');
    const assetId = request.getString('assetId');
    const maintenance = request.getBodyBoolean('maintenance');

    await this.sdk.query({
      controller: 'device-manager/asset',
      action: 'pushMeasures',
      engineId,
      _id: assetId,
      body: {
        measures: [
          {
            type: 'maintenance',
            values: { maintenance },
          }
        ]
      }
    });
  }
}
