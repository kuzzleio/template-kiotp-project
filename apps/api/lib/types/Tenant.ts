// ? Duplicate from frontend (maybe merge this types in third packages)
import { KDocument, KDocumentContent } from 'kuzzle-sdk';

export interface Tenant {
  _id: string;
  group: string;
  index: string;
  name: string;
  softTenants?: SoftTenant[];
}

export interface SoftTenant {
  id: string;
  name: string;
}

export type TenantDocumentContent = Exclude<Tenant, '_id'> & KDocumentContent;
export type TenantDocument = KDocument<TenantDocumentContent>;
