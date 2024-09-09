import {
  AssetModel,
  KuzzleProfile,
  ProfileTenantAdmin,
  ProfileTenantReader,
  TenantGroup,
} from '@kuzzleio/iot-platform-backend';
import { ExampleAsset } from './assets';
import { ProfileTenantManager } from './permissions';
import { ExampleCollectionsModule } from './ExampleCollectionsModule';
import { Backend } from 'kuzzle';

/**
 * * Here is an example of tenant group definition
 */
export class TenantExample extends TenantGroup {
  /**
   * * Tenant group name to registration
   */
  readonly tenantGroup = 'example';

  /**
   * * Register Assets models definitions
   */
  protected readonly assetModels: AssetModel[] = [ExampleAsset];

  /**
   * * Register profiles definitions
   */
  protected readonly profilesTemplates: KuzzleProfile[] = [
    ProfileTenantAdmin,
    ProfileTenantReader,
    ProfileTenantManager,
  ];

  /**
   * * Override constructor method to register more stuff like Tenants modules
   *
   * @param {Backend} app App backend instance
   */
  constructor(app: Backend) {
    // ! Caution: remember to call super constructor
    super(app);

    /**
     * * Register tenants modules here
     */
    this.modules.push(new ExampleCollectionsModule(this.tenantGroup, app));
  }
}
