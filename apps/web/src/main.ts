import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { IotPlatform } from '@kuzzleio/iot-platform-frontend';

import { appConfig } from './config';
import locales from './locales';

// Views
import BulkImport from '~/views/bulkImport/BulkImport.vue';
import CatalogList from '~/views/catalog/CatalogList.vue';
// Widgets
import LevelWidget from '~/widgets/level-widget/LevelWidget.vue';
import LevelWidgetForm from '~/widgets/level-widget/LevelWidgetForm.vue';
import OnOffWidget from '~/widgets/on-off-widget/OnOffWidget.vue';
import OnOffWidgetForm from '~/widgets/on-off-widget/OnOffWidgetForm.vue';
import StatusMapWidget from '~/widgets/statusMap-widget/StatusMapWidget.vue';
import StatusMapWidgetForm from '~/widgets/statusMap-widget/StatusMapWidgetForm.vue';

const app = new IotPlatform({
  locales,
  config: appConfig,
});

// Views
app.appChunks.get('admin')?.addChildrenView({
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
  route: {
    path: '/bulk-import',
    meta: {
      breadcrumb: 'locales.sidebar.bulkImport',
    },
    component: BulkImport,
  },
});

app.appChunks.set('catalog', {
  label: 'locales.sidebar.catalog',
  icon: faBookmark,
  route: {
    path: '/catalog',
    component: CatalogList,
  },
});

// Widgets
app.widgets.set('statusMap', {
  label: 'locales.widget.status-map.label',
  component: StatusMapWidget,
  formComponent: StatusMapWidgetForm,
  icon: 'map',
});

app.widgets.set('light-level', {
  label: 'locales.widget.level.label',
  component: LevelWidget,
  formComponent: LevelWidgetForm,
  icon: 'sun',
});

app.widgets.set('on-off', {
  label: 'locales.widget.on-off.label',
  component: OnOffWidget,
  formComponent: OnOffWidgetForm,
  icon: 'toggle-on',
});
