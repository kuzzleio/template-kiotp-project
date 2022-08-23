const { When } = require('cucumber');

When(
  'The last alert for tenant {string} content match:',
  async function (tenant, dataTable) {
    const expectedContent = this.parseObject(dataTable);

    await this.sdk.collection.refresh(tenant, 'alerts');

    const sort = { '_kuzzle_info.createdAt': 'desc' };

    await this.sdk.collection.refresh(tenant, 'alerts');
    const result = await this.sdk.document.search(tenant, 'alerts', { sort });

    if (result.hits.length === 0) {
      throw new Error('0 alerts found');
    }

    should(result.hits[0]._source).matchObject(expectedContent);
  }
);

When(
  'The last alert {string} for {string} of tenant {string} content match:',
  async function (alertName, documentId, tenant, dataTable) {
    const expectedContent = this.parseObject(dataTable);

    await this.sdk.collection.refresh(tenant, 'alerts');

    const query = {
      and: [
        {
          equals: { 'alertRule._source.name': alertName }
        },
        {
          equals: { 'document._id': documentId }
        },
      ]
    };

    const sort = { '_kuzzle_info.createdAt': 'desc' };

    await this.sdk.collection.refresh(tenant, 'alerts');
    const result = await this.sdk.document.search(tenant, 'alerts', { query, sort }, { lang: 'koncorde' });

    if (result.hits.length === 0) {
      throw new Error('0 alerts found');
    }

    should(result.hits[0]._source).matchObject(expectedContent);
  });

When(
  'I acknowledge the alert {string} of {string} for tenant {string}',
  async function (alertName, documentId, tenant) {
    const query = {
      and: [
        {
          equals: { 'alertRule._source.name': alertName }
        },
        {
          equals: { 'document._id': documentId }
        },
        {
          equals: { status: 'pending' }
        }
      ]
    };
    const changes = {
      status: 'acknowledge',
    };
    await this.sdk.collection.refresh(tenant, 'alerts');
    await this.sdk.document.updateByQuery(tenant, 'alerts', query, changes, { lang: 'koncorde' });
    await this.sdk.collection.refresh(tenant, 'alerts');
  });
