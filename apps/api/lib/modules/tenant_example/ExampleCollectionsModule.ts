import { TenantModule } from '@kuzzleio/iot-platform-backend';

export class ExampleCollectionsModule extends TenantModule {
  /**
   * * The register methods are useful to add some custom registration for the tenant
   */
  register(): void {
    /**
     * * Here, we register custom collections templates for our tenant group
     */
    this.multiTenancy.registerCollectionsTemplates(this.tenantGroup, {
      my_collection: {
        mappings: {
          properties: {
            field: { type: 'keyword' },
          },
        },
      },
    });
  }
}
