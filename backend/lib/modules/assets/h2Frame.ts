import { HyvisionApplication } from "../../HyvisionApplication";

const h2FrameMetadataList = [
  {
    "name": "friendlyName",
    "valueType": "keyword",
    "mandatory": false
  },
  {
    "name": "geolocation",
    "valueType": "geo_point",
    "mandatory": false
  },
  {
    "name": "frameChannel1",
    "valueType": "object",
    "mandatory": false
  },
  {
    "name": "frameChannel2",
    "valueType": "object",
    "mandatory": false
  },
  {
    "name": "frameChannel3",
    "valueType": "object",
    "mandatory": false
  },
  {
    "name": "frameChannel4",
    "valueType": "object",
    "mandatory": false
  },
  {
    "name": "serialNumber",
    "valueType": "keyword",
    "mandatory": false
  },
  {
    "name": "inspectionDate",
    "valueType": "keyword",
    "mandatory": false
  }
];

export async function registerAssetCategoryH2Frame (app: HyvisionApplication, engineId: string) {
  await app.sdk.query({
    controller: 'device-manager/assetCategory',
    action: 'create',
    engineId,
    body: {
      name: "H2Frame"
    }
  });

  for (const metadata of h2FrameMetadataList) {
    await app.sdk.query({
      controller: "device-manager/metadata",
      action: "create",
      engineId,
      body: metadata
    });


    await app.sdk.query({
      controller: "device-manager/assetCategory",
      action: "linkMetadata",
      _id: "H2Frame",
      metadataId: metadata.name,
      engineId
    });
  }
}