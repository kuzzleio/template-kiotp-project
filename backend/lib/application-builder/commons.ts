import { ApplicationBuilder, DeviceManagerPlugin } from '@kuzzleio/iot-backend';

import {
  ExampleDecoder,
} from '../modules/measures';
import { KIoTPApplication } from '../KIoTPApplication';

export function registerCommons(app: KIoTPApplication) {
  ApplicationBuilder.commons((common) => {
    const deviceManager = app.plugin.get<DeviceManagerPlugin>('device-manager');

    common.decoder.register(new ExampleDecoder(deviceManager.measures));
  });
}
