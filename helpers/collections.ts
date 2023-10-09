import { Kuzzle } from 'kuzzle-sdk';

export async function truncateCollection(sdk: Kuzzle, index: string, collection: string) {
  await sdk.collection.refresh(index, collection);
  await sdk.document.deleteByQuery(index, collection, {});
  await sdk.collection.refresh(index, collection);
}

/**
 * @deprecated alias to truncateCollection
 */
export const resetCollection = truncateCollection;

export async function beforeEachTruncateCollections(sdk: Kuzzle) {
  await Promise.all([
    truncateCollection(sdk, 'platform', 'devices'),
    truncateCollection(sdk, 'tenant-asset_tracking-kuzzle', 'assets'),
    truncateCollection(sdk, 'tenant-asset_tracking-kuzzle', 'devices'),
    truncateCollection(sdk, 'tenant-asset_tracking-kuzzle', 'assets-history'),
    truncateCollection(sdk, 'tenant-asset_tracking-kuzzle', 'measures'),
    truncateCollection(sdk, 'tenant-asset_tracking-kuzzle', 'alerts'),
  ]);
}
