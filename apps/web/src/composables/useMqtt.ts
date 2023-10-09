import { useKuzzle, useI18n, useToast } from '@kuzzleio/iot-platform-frontend';
import { DocumentNotification, JSONObject, Notification } from 'kuzzle-sdk';

import { AcknowledgeMessage, AcknowledgeStatus } from '../types/AcknowledgeMessage';

interface UseMqtt {
  sendToMqtt: <T extends string>(
    deviceId: string,
    topic: T,
    payload: { [topic in T]: JSONObject },
  ) => Promise<void>;
}
export function useMqtt(): UseMqtt {
  // Composables
  const $kuzzle = useKuzzle();
  const $toast = useToast();
  const $i18n = useI18n();

  // Functions
  async function sendToMqtt<T extends string>(
    deviceId: string,
    topic: T,
    payload: { [topic in T]: JSONObject },
  ): Promise<void> {
    if (payload[topic] === undefined) {
      throw new Error($i18n.t('locales.widget.common.malformed-payload') as string);
    }

    let roomId: string | null = null;

    // eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
    const subscribeAndSend = new Promise<false>(async (resolve) => {
      try {
        const cid = window.crypto.getRandomValues(new Uint32Array(1))[0];

        roomId = await $kuzzle.realtime.subscribe(
          'mqtt',
          'acknowledgement',
          {
            equals: { 'message.ackMessage.cid': cid },
          },
          async (notification) => await handleAcknowledgement(notification, resolve),
        );

        (payload[topic] as JSONObject).cid = cid;
        await $kuzzle.query({
          controller: 'kawantech/mqtt',
          action: 'send',
          body: {
            topic: `${deviceId}/${topic}`,
            payload,
          },
        });
      } catch (error) {
        $toast.showError((error as Error).message);
        resolve(false);
      }
    });

    const timeout = new Promise<true>((resolve) => {
      setTimeout(() => resolve(true), 5000);
    });

    const hasTimedOut = await Promise.race([subscribeAndSend, timeout]);

    if (hasTimedOut) {
      $toast.showError(
        $i18n.t('locales.acknowledgement.statut.not-received'),
        $i18n.t('locales.acknowledgement.timeout'),
      );
    }

    if (roomId !== null) {
      await $kuzzle.realtime.unsubscribe(roomId);
    }
  }

  async function handleAcknowledgement(
    notification: Notification,
    resolve: (value: false) => void,
  ): Promise<void> {
    const { result } = notification as DocumentNotification;

    const { topic, type, statut } = (result._source as AcknowledgeMessage).message.ackMessage;

    const topicTranslated = $i18n.te(`locales.acknowledgement.topics.${topic}`)
      ? ($i18n.t(`locales.acknowledgement.topics.${topic}`) as string)
      : topic;
    const typeTranslated = $i18n.te(`locales.acknowledgement.types.${topic}.${type}`)
      ? ($i18n.t(`locales.acknowledgement.types.${topic}.${type}`) as string)
      : type;
    const statutTranslated = $i18n.te(`locales.acknowledgement.statut.${statut}`)
      ? ($i18n.t(`locales.acknowledgement.statut.${statut}`) as string)
      : statut;

    const content = `Commande : ${topicTranslated}\nType : ${typeTranslated}\nStatut : ${statutTranslated}`;

    if (statut === AcknowledgeStatus.RECEIVED_APPLIED) {
      $toast.showSuccess(content, $i18n.t('locales.acknowledgement.acknowledgement'));
    } else {
      $toast.showError(content, $i18n.t('locales.acknowledgement.acknowledgement'));
    }

    resolve(false);
  }

  return {
    sendToMqtt,
  };
}
