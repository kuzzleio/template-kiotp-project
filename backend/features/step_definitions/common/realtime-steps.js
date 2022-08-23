'use strict';

const util = require('util');

const should = require('should');
const { When, Then } = require('cucumber');

When('I wait {int}ms', async function (ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
});

Then(
  'I subscribe to {string}:{string} notifications',
  async function (index, collection) {
    if (!this.props.subscriptions) {
      this.props.subscriptions = {};
    }

    const roomId = await this.sdk.realtime.subscribe(
      index,
      collection,
      {},
      (notification) => {
        this.props.subscriptions[`${index}:${collection}`].notifications.push(
          notification
        );
      }
    );

    this.props.subscriptions[`${index}:${collection}`] = {
      unsubscribe: () => this.sdk.realtime.unsubscribe(roomId),
      notifications: [],
    };
  }
);

Then(
  'I should have receive {string} notifications for {string}:{string}',
  async function (rawNumber, index, collection) {
    const expectedCount = parseInt(rawNumber, 10);

    let retryCount = 10;
    let success = false;

    while (retryCount !== 0 && !success) {
      try {
        retryCount -= 1;
        await new Promise((resolve) => setTimeout(resolve, 100));

        should(
          this.props.subscriptions[`${index}:${collection}`].notifications
        ).have.length(expectedCount);
      } catch {}

      success = true;
    }

    should(
      this.props.subscriptions[`${index}:${collection}`].notifications
    ).have.length(expectedCount);
  }
);

Then(
  'I should receive realtime notifications for {string}:{string} matching:',
  async function (index, collection, datatable) {
    const expectedNotifications = this.parseObjectArray(datatable);

    let retryCount = 10;
    let received = false;

    while (retryCount !== 0 && !received) {
      retryCount -= 1;
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (this.props.subscriptions[`${index}:${collection}`]) {
        received =
          this.props.subscriptions[`${index}:${collection}`].length ===
          expectedNotifications.length;
      }
    }

    let subscription;
    try {
      should(
        this.props.subscriptions[`${index}:${collection}`]
      ).not.be.undefined();

      subscription = this.props.subscriptions[`${index}:${collection}`];
      should(subscription.notifications).be.length(
        expectedNotifications.length
      );

      for (let i = 0; i < expectedNotifications.length; i++) {
        should(subscription.notifications[i]).matchObject(
          expectedNotifications[i]
        );
      }
    } catch (error) {
      console.log(
        'expected',
        util.inspect(expectedNotifications, false, null, true)
      );

      if (subscription) {
        console.log(
          'received',
          util.inspect(subscription.notifications, false, null, true)
        );
      }

      throw error;
    }
  }
);
