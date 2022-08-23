import { ApplicationBuilder } from '@kuzzleio/iot-backend';

import { enrichMeasureWorkflow } from '../modules/measures';
import {
  alertLowH2LevelWorkflow,
  alertHoseRuptureWorkflow,
  alertLostCommunicationWorkflow,
  alertLeakDetectionWorkflow,
} from '../modules/alerts';
import {
  tenantCustomer,
  tenantMaintainer,
  tenantAdmin,
  tenantApi,
} from '../modules/permissions';

export function registerTenantHyvision() {
  ApplicationBuilder.tenantGroup('hyvision', (tenantGroup) => {
    tenantGroup.profile.register('api', tenantApi);
    tenantGroup.profile.register('customer', tenantCustomer);
    tenantGroup.profile.register('maintainer', tenantMaintainer);
    tenantGroup.profile.register('admin', tenantAdmin);

    tenantGroup.workflow.register(alertLowH2LevelWorkflow);
    tenantGroup.workflow.register(alertHoseRuptureWorkflow);
    tenantGroup.workflow.register(alertLostCommunicationWorkflow);
    tenantGroup.workflow.register(alertLeakDetectionWorkflow);
    tenantGroup.workflow.register(enrichMeasureWorkflow);
  });
}
