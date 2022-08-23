import { Inflector, KDocument } from "kuzzle";
import { BaseAssetContent, DeviceContent, MeasureContent, OriginType } from "kuzzle-device-manager";

import { HyvisionApplication } from "../../HyvisionApplication";

export type ActiveChannelEnhancerArgs = {
  averageConsumptionThreshold: number;

  windowSize: number;
}

export type ChannelEnhancerArgs = {
  defaultVolume: 0.8;
}

export class MeasureEnhancer {
  private app: HyvisionApplication;

  private get sdk () {
    return this.app.sdk;
  }

  constructor (app: HyvisionApplication) {
    this.app = app;
  }

  async computeActiveChannel (
    engineId: string,
    measure: MeasureContent,
    device: KDocument<DeviceContent>,
    args: ActiveChannelEnhancerArgs,
  ) {
    if (measure.type !== 'channel') {
      return;
    }

    const query = {
      bool: {
        must: [
          {
            nested: {
              path: 'origin',
              query: {
                bool: {
                  must: [
                    {
                      term: {
                        'origin.id': device._id,
                      },
                    },
                  ],
                },
              },
            },
          },
        ]
      }
    };

    const sort = { measuredAt: 'desc' };

    const result = await this.sdk.document.search<MeasureContent>(
      engineId,
      'measures',
      { query, sort },
      { size: args.windowSize - 1 });

    if (result.fetched !== args.windowSize - 1) {
      return null;
    }

    let consumptionSum = measure.values.consumption;
    for (const previousMeasure of result.hits) {
      consumptionSum += previousMeasure._source.values.consumption;
    }

    const averageConsumption = consumptionSum / args.windowSize;

    if (averageConsumption < args.averageConsumptionThreshold) {
      return null;
    }

    const activeChannel: MeasureContent = {
      type: 'activeChannel',
      assetMeasureName: 'activeChannel',
      deviceMeasureName: 'activeChannel',
      measuredAt: measure.measuredAt,
      values: {
        activeChannel: measure.assetMeasureName,
        averageConsumption,
      },
      origin: {
        type: OriginType.USER,
        payloadUuids: measure.origin.payloadUuids,
      },
      unit: {
        name: 'Active Channel',
        sign: '',
        type: 'string',
      }
    };

    return activeChannel;
  }

  enrichChannel (
    measure: MeasureContent,
    device: KDocument<DeviceContent>,
    asset: KDocument<BaseAssetContent>,
    args: ChannelEnhancerArgs,
  ) {
    if (measure.type !== 'channel') {
      return null;
    }

    const frameName = `frame${Inflector.upFirst(measure.assetMeasureName)}`;

    const frame = asset._source.metadata.find(({ key }) => key === frameName);

    if (! frame) {
      return null;
    }

    const volumeMetadata = frame.value.object.find(({ key }) => key === 'volume');
    const volume = volumeMetadata.value.integer || args.defaultVolume;

    const { mole, weight } = this.computeMoleVanDerWaals(
      measure.values.pressure,
      measure.values.temperature,
      volume);

    measure.values.mole = mole;
    measure.values.weight = weight;

    const lastMeasure = device._source.measures.find(m => m.deviceMeasureName === measure.deviceMeasureName);

    if (! lastMeasure || ! lastMeasure.values.mole) {
      return null;
    }

    measure.values.consumption = lastMeasure.values.mole - mole;
  }

  private computeMoleVanDerWaals(
    pressure: number,
    temperature: number,
    volume: number,
  ): { mole: number; weight: number } {
    const a = 0.02476;
    const b = 2.661e-5;
    const P = pressure;
    const V = volume; // 0.8;
    const R = 8.3144621;
    const T = temperature;
    const _sqrt = Math.sqrt(
      (4 * a * a * P * V * V * V * V +
        (-a * R * R * T * T - 20 * a * b * P * R * T + 8 * a * b * b * P * P) *
          V *
          V +
        4 * b * R * R * R * T * T * T +
        12 * b * b * P * R * R * T * T +
        12 * b * b * b * P * P * R * T +
        4 * b * b * b * b * P * P * P) /
        a
    );
    const _sqrt2 = Math.sqrt(
      (4 * a * a * P * V * V * V * V +
        (-a * R * R * T * T - 20 * a * b * P * R * T + 8 * a * b * b * P * P) *
          V *
          V +
        4 * b * R * R * R * T * T * T +
        12 * b * b * P * R * R * T * T +
        12 * b * b * b * P * P * R * T +
        4 * b * b * b * b * P * P * P) /
        a
    );
    const n =
      Math.pow(
        _sqrt / (2 * Math.sqrt(27) * a * b * b) +
          (2 * a * V * V * V - 9 * b * R * T * V + 18 * b * b * P * V) /
            (54 * a * b * b * b),
        1 / 3
      ) +
      (a * V * V - 3 * b * R * T - 3 * b * b * P) /
        (9 *
          a *
          b *
          b *
          Math.pow(
            _sqrt2 / (2 * Math.sqrt(27) * a * b * b) +
              (2 * a * V * V * V - 9 * b * R * T * V + 18 * b * b * P * V) /
                (54 * a * b * b * b),
            1 / 3
          )) +
      V / (3 * b);

    return {
      mole: n,
      weight: (n * 2.01588) / 1000,
    };
  }
}