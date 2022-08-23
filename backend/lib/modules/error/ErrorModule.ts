import { JSONObject, KuzzleError, KuzzleRequest } from 'kuzzle';

import { Module } from '../Module';
import { errorsCollection } from './collections/errors';

// golfed version of uuid-v4
// cf amazing https://gist.github.com/jed/982883
const uuidv4 = (a?) => a
  ? (
    a ^
    Math.random()
    * 16
    >> a/4
  ).toString(16)
  : (
    [1e7] as any +
    -1e3 +
    -4e3 +
    -8e3 +
    -1e11
  ).replace(
    /[018]/g,
    uuidv4
  );

// @todo this should be in KIoTP
export class ErrorModule extends Module {
  private index = 'platform';
  private collection = 'errors';

  private filteredStatuses = [412, 404, 401, 403];

  register () {
    this.app.hook.register('request:onError', request => this.requestError(request));

    this.app.hook.register(
      'error:save',
      ({ error, context }) => this.eventError(error, context));

    this.app.hook.register(
      'workflows:execution:error',
      (...args) => {
        console.log(args)
        this.eventError(args[0].error, args[0].workflowContext)
      });

    this.app.import.mappings({
      platform: {
        errors: errorsCollection,
      }
    });
  }

  async init () {
    // Nothing here
  }

  private eventError (error: KuzzleError, context: JSONObject) {
    const document = {
      error: error.toJSON ? error.toJSON() : { message: error.message, stack: error.stack },
      context,
    };
    const id = `${error.message} ${uuidv4()}`;

    this.createError(id, document);
  }

  private requestError (request: KuzzleRequest) {
    const error = request.error.toJSON();

    if (this.filteredStatuses.includes(error.status)) {
      return;
    }

    const document = {
      error,
      input: request.input,
      context: request.context.toJSON(),
    };
    const id = `${error.message} ${request.id}`;

    this.createError(id, document);
  }

  private createError (id: string, document: JSONObject) {
    this.app.sdk.document.create(this.index, this.collection, document, id)
      .catch(err => this.app.log.error(`Cannot log application error: ${err}`));
  }
}