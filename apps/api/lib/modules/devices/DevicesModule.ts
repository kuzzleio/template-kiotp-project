import { DeviceModel, ModelsModule } from '@kuzzleio/iot-platform-backend';
import { SampleDevice } from './SampleDevice';

export class DevicesModule extends ModelsModule {
  protected readonly deviceModels: DeviceModel[] = [SampleDevice];
}
