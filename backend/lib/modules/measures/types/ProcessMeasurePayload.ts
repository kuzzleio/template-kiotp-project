import { KDocument } from "kuzzle";
import { BaseAssetContent, Device, MeasureContent } from "kuzzle-device-manager";

export type ProcessMeasurePayload = {
  asset: KDocument<BaseAssetContent>;
  device: Device;
  measures: MeasureContent[];
}
