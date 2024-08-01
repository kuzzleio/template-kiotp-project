import { useSdk } from './useSdk';

export async function truncateCollection(index: string, collection: string) {
  const sdk = useSdk();

  await sdk.collection.refresh(index, collection);
  await sdk.document.deleteByQuery(index, collection, {});
  await sdk.collection.refresh(index, collection);
}
