import { AssetContent, MeasureContent } from "kuzzle-device-manager";

import {
  beforeAllCreateTenants,
  beforeEachTruncateCollections,
  sendPayloads,
  useSdk,
} from "../../../../../helpers";

jest.setTimeout(10000);

describe("Geofencing: create movement record measure", () => {
  const sdk = useSdk();

  const insideIDFSud = [
    {
      lat: 48.59992236307457,
      lon: 2.659880335714945,
    },
    {
      lat: 48.60148778787524,
      lon: 2.6603530803797355,
    },
  ];
  const insideIDFNord = [
    {
      lat: 49.00756531881916,
      lon: 2.4858072479120494,
    },
    {
      lat: 49.00646826752515,
      lon: 2.4854230434447686,
    },
  ];
  const outsideEverything = [
    {
      lat: 48.60295023447267,
      lon: 2.6561274713374132,
    },
    {
      lat: 48.60259514497082,
      lon: 2.6580890797178824,
    },
  ];

  function moveTruck(position: { lat: number; lon: number }) {
    return sendPayloads(sdk, "loka", [
      {
        deviceEUI: "LOK2",
        battery: 100,
        ...position,
      },
    ]);
  }

  beforeAll(async () => {
    await sdk.connect();
    await beforeAllCreateTenants(sdk);
    // update the workflows
    await sdk.query({
      controller: "multi-tenancy/tenant",
      action: "update",
      name: "kuzzle",
      group: "asset_tracking",
      // should be available in the next version of the workflows plugin (>0.5.2)
      force: true,
    });
  });

  beforeEach(async () => {
    await beforeEachTruncateCollections(sdk);
    await sdk.query({
      controller: "fixtures",
      action: "load",
      tenant: "asset_tracking",
      stage: "digital-twins",
    });
    // create rules associated to Warehouses
    // @todo remove this when we have global pipes
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "assets");
    await sdk.document.updateByQuery(
      "tenant-asset_tracking-kuzzle",
      "assets",
      {},
      {},
    );
  });

  afterAll(async () => {
    sdk.disconnect();
  });

  it("asset outside of everything moving inside a geofence", async () => {
    await moveTruck(outsideEverything[0]);

    await moveTruck(insideIDFSud[0]);
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "measures");

    const measures = await sdk.document.search<MeasureContent>(
      "tenant-asset_tracking-kuzzle",
      "measures",
      {
        query: {
          equals: { type: "movementRecord" },
        },
        sort: { measuredAt: "asc" },
      },
      { lang: "koncorde" },
    );

    expect(measures.hits).toHaveLength(2);
    expect(measures.hits[0]._source).toMatchObject({
      values: {
        in: null,
      },
    });
    expect(measures.hits[1]._source).toMatchObject({
      values: {
        out: null,
        in: "IDFSud",
      },
    });

    const assets = await sdk.document.get<AssetContent>(
      "tenant-asset_tracking-kuzzle",
      "assets",
      "Truck-sierra",
    );

    expect(assets._source.metadata).toMatchObject({
      geofencing: {
        state: "IDFSud",
      },
    });
  });

  it("asset outside everything moving outside everything", async () => {
    await moveTruck(outsideEverything[0]);

    await moveTruck(outsideEverything[1]);
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "measures");

    const measures = await sdk.document.search<MeasureContent>(
      "tenant-asset_tracking-kuzzle",
      "measures",
      {
        query: {
          equals: { type: "movementRecord" },
        },
        sort: { measuredAt: "asc" },
      },
      { lang: "koncorde" },
    );

    expect(measures.hits).toHaveLength(1);
    expect(measures.hits[0]._source).toMatchObject({
      values: {
        in: null,
      },
    });

    const assets = await sdk.document.get<AssetContent>(
      "tenant-asset_tracking-kuzzle",
      "assets",
      "Truck-sierra",
    );

    expect(assets._source.metadata).toMatchObject({
      geofencing: {
        state: null,
      },
    });
  });

  it("asset inside a geofence moving inside the same geofence", async () => {
    await moveTruck(insideIDFSud[0]);

    await moveTruck(insideIDFSud[1]);
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "measures");

    const result = await sdk.document.search<MeasureContent>(
      "tenant-asset_tracking-kuzzle",
      "measures",
      {
        query: {
          equals: { type: "movementRecord" },
        },
        sort: { measuredAt: "asc" },
      },
      { lang: "koncorde" },
    );

    expect(result.hits).toHaveLength(1);
    expect(result.hits[0]._source).toMatchObject({
      values: {
        in: "IDFSud",
      },
    });

    const assets = await sdk.document.get<AssetContent>(
      "tenant-asset_tracking-kuzzle",
      "assets",
      "Truck-sierra",
    );

    expect(assets._source.metadata).toMatchObject({
      geofencing: {
        state: "IDFSud",
      },
    });
  });

  it("asset inside a geofence moving inside another geofence", async () => {
    await moveTruck(insideIDFSud[0]);

    await moveTruck(insideIDFNord[0]);
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "measures");

    const result = await sdk.document.search<MeasureContent>(
      "tenant-asset_tracking-kuzzle",
      "measures",
      {
        query: {
          equals: { type: "movementRecord" },
        },
        sort: { measuredAt: "asc" },
      },
      { lang: "koncorde" },
    );

    expect(result.hits).toHaveLength(2);
    expect(result.hits[0]._source).toMatchObject({
      values: {
        in: "IDFSud",
      },
    });
    expect(result.hits[1]._source).toMatchObject({
      values: {
        out: "IDFSud",
        in: "IDFNord",
      },
    });

    const assets = await sdk.document.get<AssetContent>(
      "tenant-asset_tracking-kuzzle",
      "assets",
      "Truck-sierra",
    );

    expect(assets._source.metadata).toMatchObject({
      geofencing: {
        state: "IDFNord",
      },
    });
  });

  it("asset inside a geofence moving outside everything", async () => {
    await moveTruck(insideIDFSud[0]);

    await moveTruck(outsideEverything[0]);
    await sdk.collection.refresh("tenant-asset_tracking-kuzzle", "measures");

    const result = await sdk.document.search<MeasureContent>(
      "tenant-asset_tracking-kuzzle",
      "measures",
      {
        query: {
          equals: { type: "movementRecord" },
        },
        sort: { measuredAt: "asc" },
      },
      { lang: "koncorde" },
    );

    expect(result.hits).toHaveLength(2);
    expect(result.hits[0]._source).toMatchObject({
      values: {
        in: "IDFSud",
      },
    });
    expect(result.hits[1]._source).toMatchObject({
      values: {
        out: "IDFSud",
        in: null,
      },
    });

    const assets = await sdk.document.get<AssetContent>(
      "tenant-asset_tracking-kuzzle",
      "assets",
      "Truck-sierra",
    );

    expect(assets._source.metadata).toMatchObject({
      geofencing: {
        state: null,
      },
    });
  });
});
