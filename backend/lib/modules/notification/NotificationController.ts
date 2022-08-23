import { Controller, KuzzleRequest } from 'kuzzle';

import { HyvisionApplication } from '../../HyvisionApplication';
import { ContactService } from './ContactService';

export class NotificationController extends Controller {
  private contactService: ContactService;

  constructor (app: HyvisionApplication, contactService: ContactService) {
    super(app);

    this.name = 'byes/notification';

    this.contactService = contactService;

    this.definition = {
      actions: {
        sms: {
          handler: this.sms,
        }
      }
    };
  }

  async sms (request: KuzzleRequest) {
    const engineId = request.getString('engineId');
    const smsContent = request.getBodyString('smsContent');

    const { successes, errors } = await this.contactService.sendSms(engineId, smsContent);

    return { successes, errors };
  }
}