import { Backend, BadRequestError, JSONObject } from 'kuzzle';
import {
  ApiAssetCreateRequest as BaseAssetCreateRequest,
  ApiAssetDeleteRequest,
  ApiDeviceCreateRequest,
  ApiDeviceDeleteRequest,
  ApiDeviceLinkAssetRequest,
  ApiGroupAddAssetsRequest,
  ApiGroupCreateRequest,
} from 'kuzzle-device-manager';

import { FixtureStage, Tenant } from '../../types';

interface ApiAssetCreateRequest extends BaseAssetCreateRequest {
  softTenantId?: string;
}

export abstract class FixturesGenerator {
  protected app: Backend;
  protected tenantName: string;
  protected tenantGroup: string;
  protected tenantIndex: string;

  constructor(app: Backend, tenantName: string, tenantGroup: string) {
    this.app = app;
    this.tenantName = tenantName;
    this.tenantGroup = tenantGroup;
    this.tenantIndex = `tenant-${tenantGroup}-${tenantName}`;
  }

  abstract loadDigitalTwins(): Promise<void>;
  abstract loadMeasures(): Promise<void>;
  abstract loadDashboards(): Promise<void>;
  abstract resetDigitalTwins(): Promise<void>;

  async runAll(): Promise<void> {
    await this.loadUsers();
    await this.loadDigitalTwins();
    await this.loadMeasures();
    await this.loadDashboards();
  }

  async reset() {
    await this.resetDigitalTwins();
    await this.resetMeasures();
    await this.truncate('alerts');
    await this.truncate('assets-history');
    await this.loadDigitalTwins();
    await this.loadMeasures();
  }

  async runStage(stage: keyof typeof FixtureStage) {
    await this.createIfNoExists();

    switch (stage) {
      case FixtureStage.all:
        return this.runAll();
      case FixtureStage.users:
        return this.loadUsers();
      case FixtureStage.digital_twins:
        return this.loadDigitalTwins();
      case FixtureStage.dashboards:
        return this.loadDashboards();
      case FixtureStage.measures:
        return this.loadMeasures();
      default:
        throw new BadRequestError(`Unknown stage: ${stage}`);
    }
  }

  /**
   * We must create the engines manually because the IoT Backend register pipes
   * to create them after the multi tenancy plugin actions but pipes are not
   * triggered from the backend.
   */
  async createIfNoExists() {
    const { result } = await this.app.sdk.query({
      controller: 'multi-tenancy/tenant',
      action: 'exists',
      name: this.tenantName,
      group: this.tenantGroup,
    });

    if (!result.exists) {
      const { result: tenant } = await this.app.sdk.query({
        controller: 'multi-tenancy/tenant',
        action: 'create',
        name: this.tenantName,
        group: this.tenantGroup,
      });

      await this.createEngine('device-manager', 'create', this.tenantIndex, this.tenantGroup);
      await this.createEngine('workflows', 'create', this.tenantIndex, this.tenantGroup);
      await this.createEngine('scheduler', 'create', this.tenantIndex, this.tenantGroup);
      await this.createEngine('dashboard-builder', 'create', this.tenantIndex, this.tenantGroup);
      await this.createSoftTenant(tenant as Exclude<Tenant, '_id'>, 'sdet');
    }
  }

  async loadUsers() {
    await Promise.all([
      this.createUser('tenant_admin', this.tenantGroup),
      this.createUser('tenant_reader', this.tenantGroup),
    ]);
  }

  async createAsset<TMetadata extends JSONObject = JSONObject>(
    model: string,
    reference: string,
    metadata: TMetadata = {} as TMetadata,
    softTenantId?: string,
  ) {
    try {
      await this.app.sdk.query<ApiAssetCreateRequest>({
        controller: 'device-manager/assets',
        action: 'create',
        engineId: this.tenantIndex,
        softTenantId,
        body: {
          model,
          reference,
          metadata: metadata as any,
        },
      });

      return `Create Asset: ${model}-${reference}`;
    } catch (error) {
      if (error.id !== 'services.storage.document_already_exists') {
        throw error;
      }
    }
  }

  async deleteAsset(model: string, reference: string) {
    try {
      await this.app.sdk.query<ApiAssetDeleteRequest>({
        controller: 'device-manager/assets',
        action: 'delete',
        engineId: this.tenantIndex,
        _id: `${model}-${reference}`,
      });

      return `Delete Asset: ${model}-${reference}`;
    } catch (error) {
      return error.message;
    }
  }

  async createDevice(model: string, reference: string) {
    try {
      await this.app.sdk.query<ApiDeviceCreateRequest>({
        controller: 'device-manager/devices',
        action: 'create',
        engineId: this.tenantIndex,
        body: {
          model,
          reference,
        },
      });

      return `Create Device: ${model}-${reference}`;
    } catch (error) {
      if (error.id !== 'services.storage.document_already_exists') {
        throw error;
      }
    }
  }

  async deleteDevice(model: string, reference: string) {
    try {
      await this.app.sdk.query<ApiDeviceDeleteRequest>({
        controller: 'device-manager/devices',
        action: 'delete',
        engineId: this.tenantIndex,
        _id: `${model}-${reference}`,
      });

      return `Delete Device: ${model}-${reference}`;
    } catch (error) {
      return error.message;
    }
  }

  async linkAsset(
    assetId: string,
    deviceId: string,
    measureNames: ApiDeviceLinkAssetRequest['body']['measureNames'],
  ) {
    try {
      await this.app.sdk.query<ApiDeviceLinkAssetRequest>({
        controller: 'device-manager/devices',
        action: 'linkAsset',
        engineId: this.tenantIndex,
        _id: deviceId,
        assetId,
        body: { measureNames },
      });

      return `Link Asset: ${assetId} to Device: ${deviceId}`;
    } catch (error) {
      return error.message;
    }
  }

  async groupAssets(groupName: string, assetIds: string[]) {
    const groupId = groupName.toLocaleLowerCase().replace(' ', '-');
    const groupExist = await this.app.sdk.document.exists(
      this.tenantIndex,
      'assets-groups',
      groupId,
    );
    if (!groupExist) {
      await this.app.sdk.query<ApiGroupCreateRequest>({
        controller: 'device-manager/assetsGroup',
        action: 'create',
        engineId: this.tenantIndex,
        _id: groupId,
        body: {
          name: groupName,
        },
      });
    }
    return this.app.sdk.query<ApiGroupAddAssetsRequest>({
      controller: 'device-manager/assetsGroup',
      action: 'addAsset',
      engineId: this.tenantIndex,
      _id: groupId,
      body: {
        assetIds,
      },
    });
  }

  async createUser(profile: string, name: string) {
    try {
      await this.app.sdk.query({
        controller: 'multi-tenancy/user',
        action: 'create',
        profile,
        _id: `${name}.${profile}`,
        tenantId: this.tenantIndex,
        body: {
          credentials: {
            local: {
              username: `${name}.${profile}`,
              password: 'password',
            },
          },
        },
      });

      return `Create User: ${name}.${profile}`;
    } catch (error) {
      return error.message;
    }
  }

  async resetMeasures() {
    await this.truncate('measures');
  }

  async truncate(collection: string) {
    await this.app.sdk.collection.refresh(this.tenantIndex, collection);
    await this.app.sdk.document.deleteByQuery(this.tenantIndex, collection);
  }

  randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async createEngine(plugin: string, action: string, index: string, group?: string) {
    return this.app.sdk
      .query({
        action,
        controller: `${plugin}/engine`,
        group,
        index,
      })
      .catch((error) => {
        this.app.log.error(`[${index}] Cannot ${action} ${plugin} engine: ${error}`);

        throw error;
      });
  }

  async createSoftTenant(tenant: Exclude<Tenant, '_id'>, name: string) {
    return this.app.sdk.query({
      controller: 'multi-tenancy/soft-tenant',
      action: 'create',
      tenantId: tenant.group,
      _tenant: {
        _id: tenant.index,
        _source: {
          group: tenant.group,
          name: tenant.name,
        },
      },
      name,
    });
  }
}
