import './style.css';
import { IotPlatform } from '@kuzzleio/iot-platform-frontend';

import { appConfig } from './config';
import locales from './locales';

import SampleWidget from '~/widgets/sample-widget/SampleWidget.vue';
import SampleWidgetForm from '~/widgets/sample-widget/SampleWidgetForm.vue';

const app = new IotPlatform({
  locales,
  config: appConfig,
});

// Load custom views :
// app.appChunks.get('admin')?.addChildrenView({
//   name: 'bulk-import',
//   label: 'locales.sidebar.bulkImport',
//   icon: faDatabase,
//   route: {
//     path: '/bulk-import',
//     component: BulkImport,
//     meta: {
//       breadcrumb: 'locales.sidebar.bulkImport',
//     },
//   },
//   enabled: {
//     rights: {
//       controller: 'bulk-import',
//       action: 'import',
//       index: null,
//     },
//   },
// });

// Load custom widgets :
app.widgets.set('sample-widget', {
  label: 'widget.sample-widget.label',
  component: SampleWidget,
  formComponent: SampleWidgetForm,
  icon: 'face-meh',
});

// ! Fix unwanted triggered events on window refresh
// This behavior should be added in kuzzle-sdk package to clean listener before unload
window.addEventListener('beforeunload', () => {
  kuzzle.removeAllListeners('disconnected');
});

app.initVue()
