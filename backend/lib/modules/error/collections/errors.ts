export const errorsCollection = {
  mappings: {
    dynamic: 'false',
    properties: {
      id: { type: 'keyword' },
      name: { type: 'keyword' },
      status: { type: 'integer' },
      message: { type: 'text' },
      stack: { type: 'text' },
      input: {
        properties: {
          controller: { type: 'keyword' },
          action: { type: 'keyword' },
        }
      },
      context: {
        properties: {
          user: {
            properties: {
              _id: { type: 'keyword' },
              profileIds: { type: 'keyword' },
            }
          }
        }
      },
    }
  }
};