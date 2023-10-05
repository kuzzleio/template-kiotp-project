import { Rule, RuleContent } from '@kuzzleio/plugin-workflows';

const assetTruckGeofencingRuleContent: RuleContent = {
  name: 'asset-truck-geofencing',
  description: 'Rule to enrich geofencing Truck assets by using the Warehouse geofence',
  filters: {
    and: [
      // Only if the asset is geofencing enabled
      {
        not: {
          equals: { 'asset._source.metadata.geofencing.disabled': true },
        },
      },
      // Only if the asset model is Truck
      {
        equals: { 'asset._source.model': 'Truck' },
      },
    ],
  },
  actions: [
    {
      type: 'task',
      name: 'prepare-geofencing',
    },
    {
      type: 'rule-group',
      name: 'warehouse',
    },
    {
      type: 'task',
      name: 'create-movement-record',
    },
  ],
};

export const assetTruckGeofencingRule = new Rule(assetTruckGeofencingRuleContent);
