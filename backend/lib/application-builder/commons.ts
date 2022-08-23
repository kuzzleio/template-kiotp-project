import { ApplicationBuilder, DeviceManagerPlugin } from '@kuzzleio/iot-backend';

import {
  SrettDecoder,
  maintenanceMeasure,
  channelMeasure,
  activeChannelMeasure,
} from '../modules/measures';
import { HyvisionApplication } from '../HyvisionApplication';
import {
  AlertHoseRuptureTask,
  AlertLeakDetectionTask,
  AlertLostCommunicationTask,
  AlertLowH2LevelTask,
} from '../modules/alerts';

export function registerCommons(app: HyvisionApplication) {
  ApplicationBuilder.commons((common) => {
    const deviceManager = app.plugin.get<DeviceManagerPlugin>('device-manager');

    // @todo this should be available in the AppBuilder
    deviceManager.measures.register('activeChannel', activeChannelMeasure);
    deviceManager.measures.register('channel', channelMeasure);
    deviceManager.measures.register('maintenance', maintenanceMeasure);

    common.decoder.register(new SrettDecoder(deviceManager.measures));

    common.task.register(new AlertLowH2LevelTask());
    common.task.register(new AlertHoseRuptureTask());
    common.task.register(new AlertLostCommunicationTask());
    common.task.register(new AlertLeakDetectionTask());
  });
}
