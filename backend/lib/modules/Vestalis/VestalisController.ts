import { Backend, Controller } from 'kuzzle';

import { VestalisApi } from './VestalisApi';

export class VestalisController extends Controller {
  constructor(app: Backend) {
    super(app);

    this.name = 'byes/vestalis';

    this.definition = {
      actions: {
        fetch: {
          handler: this.fetch,
          http: [{ verb: 'post', path: 'vestalis/fetch' }],
        },
      },
    };
  }

  get as() {
    return (user) => this.app.sdk.as(user, { checkRights: true });
  }

  async fetch() {
    let loginRes;
    try {
      loginRes = await VestalisApi.login(
        'n.may@bouygues-construction.com',
        'nicolasmay'
      );
    } catch (e) {
      return this.app.log.error(
        `Something went wrong while logging in to Vestalis: ${e}`
      );
    }
    const token = loginRes.access_token;

    const devices = await VestalisApi.getDeviceList(token);
    const deviceIds = [];
    for (const content of devices.content) {
      if (content.associations) {
        for (const association of content.associations) {
          if (association.device.identifier) {
            //let assetId = association.asset.identifier; // or association.identifier ?

            const deviceId = association.device.identifier; // association.device.identifier;
            try {
              const res = await VestalisApi.fetch(token, deviceId);

              await this.sdk.query({
                controller: 'device-manager/payload',
                action: 'srett',
                body: {
                  reference: deviceId,
                  date: res.receipt_date,
                  temperature: res.pressure_sensor_temperature,
                  pressure: res.pressure,
                },
              });

              deviceIds.push(deviceId);
            }
            catch (error) {
              this.app.log.error(`Cannot process measures for device "${deviceId}": ${error}`);
            }
            break;
          }
        }
      }
    }

    return { devices: deviceIds };
  }
}
