import { Backend, JSONObject } from "kuzzle";
import {
  ApiAssetCreateRequest,
  ApiAssetCreateResult,
  ApiDeviceCreateRequest,
  ApiDeviceCreateResult,
  ApiDeviceLinkAssetRequest,
  ApiDeviceLinkAssetResult,
} from "kuzzle-device-manager";

import { Log, LogType } from "../../types/Log";

import { parseCsv } from "./CsvParser";

type Content = {
  asset_id?: string;
  asset_reference?: string;
  device_id?: string;
  device_reference?: string;
} & JSONObject;

export class BulkImportService {
  private readonly app: Backend;
  private logs: Log[];

  constructor(app: Backend) {
    this.app = app;
    this.logs = [];
  }

  async parseAndImport(
    rawContent: string,
    currentIndex: string,
    uniqueId: string,
  ): Promise<void> {
    this.logs = [];
    const content = await this.parseFile(rawContent, uniqueId);
    return this.importAssetsAndDevices(content, currentIndex, uniqueId);
  }

  async parseFile(content: string, uniqueId: string): Promise<Content> {
    try {
      return parseCsv(content);
    } catch (error) {
      await this.addLog(uniqueId, "csv-parse-error", "error");
      return [];
    }
  }

  async importAssetsAndDevices(
    content: Content,
    currentIndex: string,
    uniqueId: string,
  ): Promise<void> {
    try {
      const promises = [];
      for (const [lineNumber, line] of content.entries()) {
        if (promises.length >= 75) {
          await Promise.all(promises);
          promises.splice(0, promises.length);
        }

        const createDeviceAndAsset: Promise<void>[] = [];
        const isAsset = line.asset_model && line.asset_reference;
        const isDevice = line.device_model && line.device_reference;

        if (isAsset) {
          createDeviceAndAsset.push(
            this.createAsset(line, uniqueId, currentIndex),
          );
        }

        if (isDevice) {
          createDeviceAndAsset.push(
            this.createDevice(line, lineNumber, uniqueId, currentIndex),
          );
        }

        const createDeviceAndAssetPromise = Promise.all(createDeviceAndAsset);

        if (isDevice && isAsset) {
          promises.push(
            createDeviceAndAssetPromise.then(() =>
              this.linkDeviceToAsset(line, uniqueId, currentIndex),
            ),
          );
          continue;
        }

        promises.push(createDeviceAndAssetPromise);

        if (!isAsset && !isDevice) {
          promises.push(
            this.addLog(uniqueId, "invalid", "error", {
              lineNumber: lineNumber + 1,
            }),
          );
        }
      }
      await Promise.all(promises);
    } catch (error) {
      await this.addLog(uniqueId, error.message, "kuzzle_error");
    }
  }

  async createAsset(
    value: Content,
    uniqueId: string,
    currentIndex: string,
  ): Promise<void> {
    try {
      await this.app.sdk.query<ApiAssetCreateRequest, ApiAssetCreateResult>({
        controller: "device-manager/assets",
        action: "create",
        engineId: currentIndex,
        body: {
          model: value.asset_model,
          reference: value.asset_reference,
        },
      });
      await this.addLog(uniqueId, "asset-created", "success", {
        assetModel: value.asset_model,
        assetReference: value.asset_reference,
      });
    } catch (error) {
      if (error.id !== "services.storage.document_already_exists") {
        await this.addLog(uniqueId, error.message, "kuzzle_error");
      }
    }
    const metadata = await this.parseMetadata("asset", value);
    const id = `${value.asset_model}-${value.asset_reference}`;
    await this.updateMetadata(
      "asset",
      id,
      value,
      metadata,
      uniqueId,
      currentIndex,
    );
  }

  async createDevice(
    value: Content,
    lineNumber: number,
    uniqueId: string,
    currentIndex: string,
  ): Promise<void> {
    const id = `${value.device_model}-${value.device_reference}`;
    const otherTenant = await this.getExistingDeviceTenant(
      value,
      id,
      uniqueId,
      currentIndex,
    );
    if (otherTenant && otherTenant !== "platform") {
      await this.addLog(uniqueId, "device-link-to-another-tenant", "error", {
        deviceModel: value.device_model,
        deviceReference: value.device_reference,
        otherTenant: otherTenant,
        lineNumber,
      });
      return;
    }
    if (!otherTenant) {
      try {
        await this.app.sdk.query<ApiDeviceCreateRequest, ApiDeviceCreateResult>(
          {
            controller: "device-manager/devices",
            action: "create",
            engineId: currentIndex,
            body: {
              model: value.device_model,
              reference: value.device_reference,
            },
          },
        );
        await this.addLog(uniqueId, "device-created", "success", {
          deviceModel: value.device_model,
          deviceReference: value.device_reference,
        });
      } catch (error) {
        if (error.id !== "services.storage.document_already_exists") {
          await this.addLog(uniqueId, error.message, "kuzzle_error");
        }
      }
    }
    const metadata = await this.parseMetadata("device", value);
    await this.updateMetadata(
      "device",
      id,
      value,
      metadata,
      uniqueId,
      currentIndex,
    );
  }

  /**
   * Get the tenant where the device already exists (if it exists)
   * @return {string | null} the engineId of the tenant where the device already exists or null if it doesn't exist
   */
  async getExistingDeviceTenant(
    value: Content,
    id: string,
    uniqueId: string,
    currentIndex: string,
  ): Promise<"platform" | string | null> {
    try {
      const { result } = await this.app.sdk.query({
        controller: "device-manager/devices",
        action: "get",
        engineId: "platform",
        _id: id,
      });
      const source = result._source;
      if (source.engineId === null) {
        // the device exists in the platform tenant
        await this.app.sdk.query({
          controller: "device-manager/devices",
          action: "attachEngine",
          engineId: currentIndex,
          _id: id,
        });
        await this.addLog(uniqueId, "orphan-device-link", "success", {
          deviceModel: value.device_model,
          deviceReference: value.device_reference,
          currentIndex,
        });
        return "platform";
      }
      return source.engineId !== currentIndex ? source.engineId : null;
    } catch (error) {
      if (error.status === 404) {
        return null; // the device doesn't exist yet
      }
      await this.addLog(uniqueId, error.message, "kuzzle_error");
      return null;
    }
  }

  async linkDeviceToAsset(
    value: Content,
    uniqueId: string,
    currentIndex: string,
  ): Promise<void> {
    try {
      await this.app.sdk.query<
        ApiDeviceLinkAssetRequest,
        ApiDeviceLinkAssetResult
      >({
        controller: "device-manager/devices",
        action: "linkAsset",
        _id: `${value.device_model}-${value.device_reference}`,
        assetId: `${value.asset_model}-${value.asset_reference}`,
        engineId: currentIndex,
        implicitMeasuresLinking: true,
      });
      await this.addLog(uniqueId, "device-linked", "success", {
        deviceModel: value.device_model,
        deviceReference: value.device_reference,
        assetModel: value.asset_model,
        assetReference: value.asset_reference,
      });
    } catch (error) {
      await this.addLog(uniqueId, error.message, "kuzzle_error");
    }
  }

  async parseMetadata(type: string, value: JSONObject) {
    const metadata: JSONObject = {};
    for (const [key, _value] of Object.entries(value)) {
      if (key.startsWith(type + "_metadata") && _value) {
        metadata[key.replace(type + "_metadata_", "")] = _value;
      }
    }
    return metadata;
  }

  async updateMetadata(
    type: string,
    id: string,
    value: Content,
    metadata: JSONObject,
    uniqueId: string,
    currentIndex: string,
  ): Promise<void> {
    try {
      const collection = type + "s";
      await this.app.sdk.query({
        controller: "device-manager/" + collection,
        action: "update",
        engineId: currentIndex,
        _id: id,
        body: {
          metadata: metadata,
        },
      });
      const typeString = type.charAt(0).toUpperCase() + type.slice(1);
      await this.addLog(uniqueId, "metadata-updated", "success", {
        type: typeString,
        model: value[type + "_model"],
        reference: value[type + "_reference"],
      });
    } catch (error) {
      await this.addLog(uniqueId, error.message, "kuzzle_error");
    }
  }

  async addLog(
    uniqueId: string,
    message: string,
    type: LogType,
    params = {},
  ): Promise<void> {
    const log = {
      log: {
        message,
        params,
      },
      type,
    };
    await this.app.sdk.realtime.publish("bulk-import", "log", {
      ...log,
      uniqueId,
    });
    this.logs.push(log);
  }
}
