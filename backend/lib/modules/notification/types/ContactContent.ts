import { KDocumentContent } from 'kuzzle';

export interface ContactContent extends KDocumentContent {
  type: 'contact';

  contact: {
    username: string;
    description: string;
    phone: string;
    email: string;
  };
}