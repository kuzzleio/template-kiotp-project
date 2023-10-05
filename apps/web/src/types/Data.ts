export interface LatLon {
  lat: number;
  lon: number;
}

interface BaseMetadata {
  key: string;
  value: unknown;
}

export interface MetadataWorkNumber extends BaseMetadata {
  key: 'workNumber';
  value: {
    keyword: string;
  };
}

export interface MetadataFriendlyName extends BaseMetadata {
  key: 'friendlyName';
  value: {
    keyword: string;
  };
}

export interface MetadataGeolocation extends BaseMetadata {
  key: 'geolocation';
  value: {
    geo_point: LatLon;
  };
}

export type Metadata = MetadataWorkNumber | MetadataFriendlyName | MetadataGeolocation;
