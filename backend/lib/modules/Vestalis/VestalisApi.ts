import https from 'https';

import { ExternalServiceError } from 'kuzzle';

export class VestalisApi {
  static async getDeviceList(token: any) {
    try {
      const ret = await this._send(
        'ws.optimum-vision.com',
        '/device/search?size=2000&sort=serial,desc&fieldCodes=serial,ownerOrganization,associations,longitude,latitude',
        'GET',
        {},
        `Bearer ${token}`,
        // 8097
      );
      return JSON.parse(ret as string);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async _send(
    hostname,
    path,
    verb = 'POST',
    data = {},
    token = null,
  ) {
    const dataString = JSON.stringify(data);

    // @todo put this in the vault
    if (token === null) {
      token =
        'Basic ' +
        Buffer.from('bumblebee-vision:ko9k0JlN5dcW').toString('base64');
    }

    const options: https.RequestOptions = {
      hostname,
      port: 443,
      path,
      method: verb,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        'Content-Length': dataString.length,
        Authorization: token,
      },
      timeout: 1000,
      rejectUnauthorized: false,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(
            new ExternalServiceError(`${res.statusCode}: ${res.statusMessage}`)
          );
          return;
        }

        const body = [];
        res.on('data', (chunk) => body.push(chunk));
        res.on('end', () => {
          const resString = Buffer.concat(body).toString();
          resolve(resString);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new ExternalServiceError('Request time out'));
      });

      req.write(dataString);
      req.end();
    });
  }

  static async login(username: string, password: string) {
    try {
      const ret = await this._send(
        'oauth.optimum-vision.com',
        `/oauth/token?username=${username}&password=${password}&grant_type=password&client_id=bumblebee-vision&scope=READ%20WRITE`,
        'POST',
        {},
        null
      );
      return JSON.parse(ret as string);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async fetch(token: string, deviceId: string) {
    try {
      const ret = await this._send(
        'ws.optimum-vision.com',
        `/device/${deviceId}/measurements/last?fieldCodes=pressure,pressure_sensor_temperature,receipt_date`,
        'GET',
        {},
        `Bearer ${token}`,
        // 8097
      );
      return JSON.parse(ret as string);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
