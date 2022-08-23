import { KuzzleRequest } from 'kuzzle';
import { HermesMessengerPlugin } from 'kuzzle-plugin-hermes-messenger';

import { Module } from '../Module';
import { HyvisionApplication } from '../../HyvisionApplication';
import { ContactService } from './ContactService';
import { NotificationController } from './NotificationController';

export class NotificationModule extends Module {
  private contactService: ContactService;
  private hermesMessengerPlugin: HermesMessengerPlugin;

  constructor (app: HyvisionApplication) {
    super(app);

    this.hermesMessengerPlugin = new HermesMessengerPlugin();
    this.contactService = new ContactService(app);
  }

  register () {
    this.app.controller.use(new NotificationController(this.app, this.contactService));

    this.registerPlugin();

    this.app.pipe.register(
      'multi-tenancy/tenant:afterCreate',
      async (request: KuzzleRequest) => {
        const engineId = request.result.index;

        await this.contactService.updateConfigCollection(engineId);
        await this.contactService.createExampleContact(engineId);

        return request;
      });
  }

  async init () {
    // Nothing here
  }

  private registerPlugin () {
    const defaultSender = this.app.appConfig.hermes.twilio.defaultSender;
    const accountSid = this.app.appConfig.hermes.twilio.accountSid;
    const authToken = this.app.vault.secrets.hermes.twilio.authToken;

    this.hermesMessengerPlugin.clients.twilio.addAccount('default', accountSid, authToken, defaultSender);

    this.app.plugin.use(this.hermesMessengerPlugin);
  }
}
