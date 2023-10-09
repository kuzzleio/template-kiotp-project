export enum AcknowledgeStatus {
  RECEIVED_APPLIED = 0,
  RECEIVED_IGNORED = 1,
  RECEIVED_UNKNOWN_TOPIC = 2,
  RECEIVED_ERROR_CONTENT = 3,
  RECEIVED_ERROR_APPLY = 4,
  RECEIVED_ERROR_HEADER = 5,
  RECEIVED_UNKNOWN_PARAMETER = 6,
  RECEIVED_INVALID_JSON = 7,
}

export interface AcknowledgeMessage {
  topic: string;
  message: {
    ackMessage: {
      topic: string;
      type: number;
      statut: AcknowledgeStatus;
      cid: number;
    };
  };
}
