import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import {
  AppChunk,
  KRouteWrapper,
  IoTPlatformChunks,
  DashboardWidget,
} from '@kuzzleio/iot-platform-frontend';

import BulkImport from '~/views/bulkImport/BulkImport.vue';
import CatalogList from '~/views/catalog/CatalogList.vue';
import LevelWidget from '~/widgets/level-widget/LevelWidget.vue';
import LevelWidgetForm from '~/widgets/level-widget/LevelWidgetForm.vue';
import OnOffWidget from '~/widgets/on-off-widget/OnOffWidget.vue';
import OnOffWidgetForm from '~/widgets/on-off-widget/OnOffWidgetForm.vue';
import StatusMapWidget from '~/widgets/statusMap-widget/StatusMapWidget.vue';
import StatusMapWidgetForm from '~/widgets/statusMap-widget/StatusMapWidgetForm.vue';

const admin = IoTPlatformChunks.find((chunk) => chunk.name === 'admin');
if (admin?.children !== undefined) {
  admin.children.push({
    name: 'bulk-import',
    label: 'locales.sidebar.bulkImport',
    icon: faDatabase,
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

export const appDefinitions: AppChunk[] = [
  ...IoTPlatformChunks,
  {
    name: 'catalog',
    label: 'locales.sidebar.catalog',
    icon: faBookmark,
    vuejsRoute: {
      path: '/catalog',
      component: KRouteWrapper,
      children: [
        {
          path: '',
          name: 'catalog',
          component: CatalogList,
        },
      ],
    },
  },
];

export const dashboardWidgets: DashboardWidget[] = [
  // Public Lighting
  {
    name: 'statusMap',
    label: 'Status Map',
    component: StatusMapWidget,
    formComponent: StatusMapWidgetForm,
    icon: 'map',
  },
  {
    name: 'light-level',
    label: 'Light level',
    component: LevelWidget,
    formComponent: LevelWidgetForm,
    icon: 'sun',
  },
  {
    name: 'on-off',
    label: 'On / Off',
    component: OnOffWidget,
    formComponent: OnOffWidgetForm,
    icon: 'toggle-on',
  },
];
