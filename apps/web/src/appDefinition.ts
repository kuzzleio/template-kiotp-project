import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import {
  AppChunk,
  KRouteWrapper,
  IoTPlatformChunks,
  DashboardWidget,
} from '@kuzzleio/iot-platform-frontend';

import BulkImport from '~/views/bulkImport/BulkImport.vue';
import SampleWidget from '~/widgets/sample-widget/SampleWidget.vue';
import SampleWidgetForm from '~/widgets/sample-widget/SampleWidgetForm.vue';

const admin = IoTPlatformChunks.find((chunk) => chunk.name === 'admin');
if (admin?.children !== undefined) {
  admin.children.push({
    name: 'bulk-import',
    label: 'locales.sidebar.bulkImport',
    icon: faDatabase,
    enabled: {
      rights: {
        controller: 'bulk-import',
        action: 'import',
        index: null,
      },
    },
    vuejsRoute: {
      path: '/bulk-import',
      component: KRouteWrapper,
      meta: {
        breadcrumb: 'locales.sidebar.bulkImport',
      },
      children: [
        {
          path: '',
          name: 'bulk-import',
          component: BulkImport,
        },
      ],
    },
  });
}

export const appDefinitions: AppChunk[] = [...IoTPlatformChunks];

export const dashboardWidgets: DashboardWidget[] = [
  {
    name: 'sample-widget',
    label: 'My Sample Widget', // TODO : i18n
    component: SampleWidget,
    formComponent: SampleWidgetForm,
    icon: 'face-meh',
  },
];
