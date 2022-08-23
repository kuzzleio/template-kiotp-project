const { When } = require('cucumber');

const deviceModel = 'Srett';

function getAssetInfo (number) {
  const deviceReferences = [];

  for (let i = number; i < number + 4; i++) {
    deviceReferences.push(i.toString());
  }

  const assetId = `H2Frame-H2-Cadre${number}`;
  const asset = {
    "type": "H2Frame",
    "model": "H2",
    "reference": `Cadre${number}`,
    "metadata": {
      "friendlyName": "Meyrargues",
      "geolocation": {
        "lat": 43.621833,
        "lon": 5.5168333
      },
      "frameChannel1": {
        "reference": "C16",
        "volume": 0.8,
        "maxH2": 11.6
      },
      "frameChannel2": {
        "reference": "C16",
        "volume": 0.8,
        "maxH2": 11.6
      },
      "frameChannel3": {
        "reference": "C16",
        "volume": 0.8,
        "maxH2": 11.6
      },
      "frameChannel4": {
        "reference": "C16",
        "volume": 0.8,
        "maxH2": 11.6
      }
    }
  };

  return { asset, assetId, deviceReferences };
}

When(
  'I create an asset H2Frame Cadre{int} with its devices for tenant {string}',
  async function (referenceNumber, tenant) {
    const engineId = `tenant-hyvision-${tenant}`;

    const { asset, assetId, deviceReferences } = getAssetInfo(referenceNumber);

    await this.sdk.query({
      controller: 'device-manager/asset',
      action: 'create',
      engineId,
      body: asset
    });

    let idx = 1;
    for (const deviceReference of deviceReferences) {
      const deviceId = `${deviceModel}-${deviceReference}`;

      if (await this.sdk.document.exists('platform', 'devices', deviceId)) {
        continue;
      }

      await this.sdk.query({
        controller: 'device-manager/device',
        action: 'create',
        engineId,
        body: {
          model: deviceModel,
          reference: deviceReference,
          assetId,
          measureNamesLinks: [
            {
              assetMeasureName: `channel${idx}`,
              deviceMeasureName: 'channel'
            }
          ]
        }
      });

      idx++;
    }
  }
);
