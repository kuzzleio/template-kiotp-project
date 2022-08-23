import { Controller, KuzzleRequest } from "kuzzle";
import { BaseAssetContent, DeviceContent, MeasureContent } from "kuzzle-device-manager";

import { HyvisionApplication } from "../../HyvisionApplication";
import { MeasureEnhancer } from "./MeasureEnhancer";
import { EnrichMeasureTask } from "./workflows/enrichMeasure";

export class MeasureController extends Controller {
  private measureEnhancer: MeasureEnhancer;

  constructor (app: HyvisionApplication, measureEnhancer: MeasureEnhancer) {
    super(app);

    this.measureEnhancer = measureEnhancer;

    this.definition = {
      actions: {
        computeChannel: {
          handler: this.computeChannel
        }
      }
    };
  }

  async computeChannel (request: KuzzleRequest) {
    const engineId = request.getString('engineId');

    const query = {
      and: [
        {
          not: {
            exists: 'values.mole',
          }
        },
        {
          equals: { type: 'channel' },
        }
      ]
    };

    const sort = {
      measuredAt: 'asc'
    };

    let result = await this.sdk.document.search<MeasureContent>(
      engineId,
      'measures',
      { query, sort },
      { lang: 'koncorde', scroll: '1m' });

    let updated = 0;
    while (result) {
      for (const measure of result.hits) {
        if (! measure._source.origin.assetId) {
          continue;
        }

        const [device, asset] = await Promise.all([
          this.sdk.document.get<DeviceContent>(engineId, 'devices', measure._source.origin.id),
          this.sdk.document.get<BaseAssetContent>(engineId, 'assets', measure._source.origin.assetId)
        ]);

        this.measureEnhancer.enrichChannel(measure._source, device, asset, {
          defaultVolume: 0.8
        });

        updated++;
      }
      const documents = result.hits.map(hit => ({ _id: hit._id, body: hit._source }));

      await this.sdk.document.mUpdate(engineId, 'measures', documents, { strict: true });

      result = await result.next();
    }

    return { updated };
  }
}