import { DeviceModelDefinition } from 'kuzzle-device-manager';

import { IneoSenseACSSwitchDecoder } from './IneoSenseACSSwitchDecoder';

export const IneoSenseACSSwitchDefinition: DeviceModelDefinition = {
  decoder: new IneoSenseACSSwitchDecoder(),
};
