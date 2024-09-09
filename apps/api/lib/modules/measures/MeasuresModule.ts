import { MeasureModel, ModelsModule } from '@kuzzleio/iot-platform-backend';

import { sampleMeasurement } from './SampleMeasurement';

export class MeasuresModule extends ModelsModule {
  protected measuresModels: MeasureModel[] = [sampleMeasurement];
}
