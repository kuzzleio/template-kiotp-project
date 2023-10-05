import { Task, WorkflowContext } from '@kuzzleio/plugin-workflows';
import { MeasureContent } from 'kuzzle-device-manager';
import { KDocument } from 'kuzzle-sdk';

import { TruckAssetContent } from '../assets/Truck';
import { MovementRecordMeasurement } from '../measures';

export class CreateMovementRecordTask extends Task {
  constructor() {
    super('create-movement-record');

    this.description = `This task will create a new "movementRecord" measure for the asset if the asset entered or exited a geofence`;
  }

  async run(context: WorkflowContext) {
    const measures = context.payload.measures as MeasureContent[];
    const asset = context.payload.asset as KDocument<TruckAssetContent>;

    if (context.props.previousGeofence === asset._source.metadata.geofencing.state) {
      return context;
    }

    const movementRecord: MeasureContent<MovementRecordMeasurement> = {
      type: 'movementRecord',
      values: {
        out: context.props.previousGeofence,
        in: asset._source.metadata.geofencing.state,
      },
      measuredAt: asset._source.measures.position.measuredAt,
      asset: {
        _id: asset._id,
        model: asset._source.model,
        reference: asset._source.reference,
        measureName: 'movementRecord',
        metadata: asset._source.metadata,
      },
      origin: {
        _id: asset._source.measures.position.originId,
        payloadUuids: asset._source.measures.position.payloadUuids,
        type: 'computed',
        measureName: 'movementRecord',
      },
    };

    measures.push(movementRecord);

    asset._source.measures.movementRecord = {
      name: 'movementRecord',
      type: 'computed',
      measuredAt: movementRecord.measuredAt,
      values: movementRecord.values,
      originId: movementRecord.origin._id,
      payloadUuids: movementRecord.origin.payloadUuids,
    };

    return context;
  }
}
