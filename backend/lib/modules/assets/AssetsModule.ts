import { KuzzleRequest } from "kuzzle";

import { HyvisionApplication } from "../../HyvisionApplication";
import { Module } from "../Module";
import { registerAssetCategoryH2Frame } from './h2Frame';

const frameReferenceMappings = {
  mappings: {
    dynamic: 'true',
    properties: {
      name: { type: "keyword" },
      volume: { type: "float" },
      maxH2: { type: "float" }
    }
  }
};

const frameReferenceDocuments = [
  {
    "_id": "frame-reference-c8",
    "body": {
      "name": "C8",
      "volume": 0.4,
      "maxH2": 6.4
    }
  },
  {
    "_id": "frame-reference-c16",
    "body": {
      "name": "C16",
      "volume": 0.8,
      "maxH2": 12.8
    }
  },
  {
    "_id": "frame-reference-c16x2",
    "body": {
      "name": "C16x2",
      "volume": 1.6,
      "maxH2": 25.6
    }
  },
  {
    "_id": "frame-reference-c28",
    "body": {
      "name": "C28",
      "volume": 1.4,
      "maxH2": 20.18
    }
  },
  {
    "_id": "frame-reference-c28x2",
    "body": {
      "name": "C28x2",
      "volume": 2.8,
      "maxH2": 40.36
    }
  },
  {
    "_id": "frame-reference-trailer",
    "body": {
      "name": "Trailer",
      "volume": 18.75,
      "maxH2": 300
    }
  },
];

export class AssetsModule extends Module {
  private index = 'platform';
  private collection = 'frame-reference';

  constructor (app: HyvisionApplication) {
    super(app);

    this.app = app;
  }

  register () {
    this.app.pipe.register(
      'multi-tenancy/tenant:afterCreate',
      async (request: KuzzleRequest) => {
        // @todo this should be done with AppBuilder
        await registerAssetCategoryH2Frame(this.app, request.result.index);

        return request;
      });

    // @todo obsolete use metadata instead
    this.app.import.mappings({
      [this.index]: {
        [this.collection]: frameReferenceMappings
      }
    });
  }

  async init () {
    await this.app.sdk.document.mCreateOrReplace(
      this.index,
      this.collection,
      frameReferenceDocuments,
      { strict: true });
  }
}
