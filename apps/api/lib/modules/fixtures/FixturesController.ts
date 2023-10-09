import { Backend, BadRequestError, Controller, KuzzleRequest } from "kuzzle";

import { AirQualityFixtures } from "./air_quality/AirQualityFixtures";
import { AssetTrackingFixtures } from "./asset_tracking/AssetTrackingFixtures";
import { PublicLightingFixtures } from "./public_lighting/PublicLightingFixtures";

export class FixturesController extends Controller {
  private assetTracking: AssetTrackingFixtures;
  private airQuality: AirQualityFixtures;
  private publicLighting: PublicLightingFixtures;

  constructor(app: Backend) {
    super(app);

    this.definition = {
      actions: {
        load: {
          handler: this.load,
        },
        reset: {
          handler: this.reset,
        },
      },
    };

    this.assetTracking = new AssetTrackingFixtures(app);
    this.airQuality = new AirQualityFixtures(app);
    this.publicLighting = new PublicLightingFixtures(app);
  }

  async load(request: KuzzleRequest) {
    const tenant = request.getString("tenant");
    const stage = request.getString("stage", "all");

    switch (tenant) {
      case "asset_tracking":
        return this.assetTracking.runStage(stage as any);
      case "air_quality":
        return this.airQuality.runStage(stage as any);
      case "public_lighting":
        return this.publicLighting.runStage(stage as any);
      default:
        throw new BadRequestError(`Unknown tenant: ${tenant}`);
    }
  }

  async reset(request: KuzzleRequest) {
    const tenant = request.getString("tenant");

    switch (tenant) {
      case "asset_tracking":
        return this.assetTracking.reset();
      case "air_quality":
        return this.airQuality.reset();
      case "public_lighting":
        return this.publicLighting.reset();
      default:
        throw new BadRequestError(`Unknown tenant: ${tenant}`);
    }
  }
}
