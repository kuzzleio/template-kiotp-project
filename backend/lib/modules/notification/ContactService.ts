import { HyvisionApplication } from '../../HyvisionApplication';
import { ContactContent } from './types/ContactContent';

export class ContactService {
  private app: HyvisionApplication;

  private exampleContactId = 'contact-example';

  private get sdk () {
    return this.app.sdk;
  }

  constructor (app: HyvisionApplication) {
    this.app = app;
  }

  async sendSms (tenantIndex: string, smsContent: string) {
    const phones = await this.listPhones(tenantIndex);

    const promises = [];
    const successes = [];
    const errors = [];

    for (const phone of phones) {
      const promise = this.sdk.query({
        controller: 'hermes/twilio',
        action: 'sendSms',
        account: 'default',
        body: {
          to: phone,
          text: smsContent
        }
      })
        .then(() => successes.push(phone))
        .catch(() => errors.push(phone));

      promises.push(promise);
    }

    await Promise.all(promises);

    return { successes, errors };
  }

  async list (tenantIndex: string): Promise<ContactContent[]> {
    const result = await this.sdk.document.search<ContactContent>(
      tenantIndex,
      'config',
      {
        query: { equals: { type: 'contact' } }
      },
      { size: 1000, lang: 'koncorde' });

    return result.hits
      .filter(doc => doc._id !== this.exampleContactId)
      .map(doc => doc._source);
  }

  async listPhones (tenantIndex: string): Promise<string[]> {
    const contacts = await this.list(tenantIndex);

    return contacts
      .filter(contact => contact.contact.phone)
      .map(contact => contact.contact.phone);
  }

  async listEmails (tenantIndex: string): Promise<string[]> {
    const contacts = await this.list(tenantIndex);

    return contacts
      .filter(contact => contact.contact.email)
      .map(contact => contact.contact.email);
  }

  async updateConfigCollection (tenantIndex: string) {
    await this.sdk.collection.update(tenantIndex, 'config', {
      mappings: {
        properties: {
          contact: {
            properties: {
              username: { type: 'keyword' },
              description: { type: 'keyword' },
              email: { type: 'keyword' },
              phone: { type: 'keyword' },
            }
          }
        }
      } as any
    });
  }

  async createExampleContact (tenantIndex) {
    await this.sdk.document.createOrReplace(tenantIndex, 'config', this.exampleContactId, {
      type: 'contact',
      contact: {
        username: 'William Gibson',
        description: 'Neuromancer',
        email: 'william@freeside.space',
        phone: '+33612345678',
      }
    });
  }
}