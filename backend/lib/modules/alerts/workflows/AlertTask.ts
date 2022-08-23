import { DynamicObject, Task, WorkflowContext } from "@kuzzleio/plugin-workflows";
import { Backend, KDocument } from "kuzzle";
import { BaseAssetContent, DeviceContent } from "kuzzle-device-manager";

import { HyvisionAlertContent, HyvisionAlertSeverity } from "../types/HyvisionAlertContent";

export interface AlertTaskArgs {
  /**
   * Display name of the alert
   */
  name: string;

  /**
   * Alert severity "warning" or "critical"
   */
  severity: HyvisionAlertSeverity;

  /**
   * If set to true, alert will be triggered in maintenance mode
   */
  enableOnMaintenance: boolean;

  notify: {
    /**
     * Templated message for notification
     */
    message: string;

    /**
     * If set to true, notification wont be sent
     */
    disabled: boolean;
  };
}
export abstract class AlertTask extends Task {
  protected get app (): Backend {
    return global.app;
  }

  protected get sdk () {
    return this.context.accessors.sdk;
  }

  constructor (name: string) {
    super(name);
  }

  /**
   * Main method for task logic
   */
  abstract runAlert (context: WorkflowContext, initiator: DynamicObject, args: AlertTaskArgs): Promise<WorkflowContext>;

  async run (context: WorkflowContext, initiator: DynamicObject, args: AlertTaskArgs): Promise<WorkflowContext> {
    this.app.log.debug(`Check alert ${this.name}`);

    if (args.enableOnMaintenance !== true && this.isMaintenance(context.payload.asset)) {
      return context;
    }

    return this.runAlert(context, initiator, args);
  }

  protected async createAlert (
    context: WorkflowContext,
    args: AlertTaskArgs,
    entity: 'asset' | 'device',
  ) {
    const document = context.payload[entity];
    const engineId = context.engineIndex;
    const severity = args.severity || 'warning';

    this.app.log.debug(`[${engineId}] Create alert "${args.name}" for ${entity} "${document._id}"`);

    const alertContent: HyvisionAlertContent = {
      alertRule: {
        _id: context.workflow._id,
        _source: {
          name: args.name,
          // needed by IoT Console to display alerts history
          filters: { and: [] }
        } as any
      },
      severity,
      status: "pending",
      document: {
        collection: `${entity}s`,
        _id: document._id,
        _source: document._source,
      }
    };

    await this.sdk.document.create<HyvisionAlertContent>(
      engineId,
      'alerts',
      alertContent);
  }

  protected async notifySms (context: WorkflowContext, args: AlertTaskArgs, message: string) {
    if (args.notify.disabled) {
      return;
    }

    await this.context.accessors.sdk.query({
      controller: 'byes/notification',
      action: 'sms',
      engineId: context.engineIndex,
      body: {
        smsContent: message,
      }
    });
  }

  protected isMaintenance (asset: KDocument<BaseAssetContent>): boolean {
    const maintenance = asset._source.measures.find(measure => measure.type === 'maintenance');

    return maintenance ? maintenance.values.maintenance : false;
  }

  protected async acknowledgeAlert (
    context: WorkflowContext,
    args: AlertTaskArgs,
    documentId: string,
  ) {
    const query = this.getAlertQuery(args.name, documentId, 'pending');

    await this.sdk.document.updateByQuery(
      context.engineIndex,
      'alerts',
       query,
       { status: 'acknowledged' },
       { lang: 'koncorde' });
  }

  protected async pendingAlertExists (
    context: WorkflowContext,
    args: AlertTaskArgs,
    documentId: string,
  ): Promise<boolean> {
    const query = this.getAlertQuery(args.name, documentId, 'pending');

    // @todo use count when it's support koncorde syntax
    const result = await this.sdk.document.search(
      context.engineIndex,
      'alerts',
       { query },
       { lang: 'koncorde', size: 1 });

    return result.total > 0;
  }

  private getAlertQuery (alertName: string, documentId: string, status: string) {
    return {
      and: [
        {
          equals: { 'alertRule._source.name': alertName }
        },
        {
          equals: { 'document._id': documentId }
        },
        {
          equals: { status }
        }
      ]
    };
  }

  protected templatedMessage (
    args: AlertTaskArgs,
    { device, asset }: { device?: KDocument<DeviceContent>, asset?: KDocument<BaseAssetContent> },
  ) {
    let friendlyName = asset?._source?.reference;

    if (asset) {
      const friendlyNameMetadata = asset._source.metadata.find(({ key }) => key === 'friendlyName');

      friendlyName = friendlyNameMetadata ? friendlyNameMetadata.value.keyword : friendlyName;
    }

    let channel;

    if (device && asset) {
      const deviceLink = asset._source.deviceLinks.find(link => link.deviceId === device._id);

      channel = deviceLink ? deviceLink.measureNamesLinks[0].assetMeasureName : channel;
    }

    const tenantName = device._source.engineId.split('-')[2];

    return args.notify.message
      .replace('{assetReference}', asset._source.reference)
      .replace('{assetFriendlyName}', friendlyName)
      .replace('{channel}', friendlyName)
      .replace('{tenant}', tenantName);
  }
}