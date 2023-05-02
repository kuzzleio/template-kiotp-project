import { DashboardWidget, dashboardChunks } from '@kuzzleio/dashboard-builder-frontend';
import { IoTConsoleChunks } from '@kuzzleio/iot-console';
import { AppChunk } from '@kuzzleio/kuzzle-application-builder';

export const appDefinitions: AppChunk[] = [...dashboardChunks, ...IoTConsoleChunks];

// Your custom widgets go here
export const dashboardWidgets: DashboardWidget[] = [
  // {
  //   name: 'my-component',
  //   label: 'The Label',
  //   icon: 'gear'
  //   component: YourImportedWidget,
  //   formComponent: YourImportedFormWidget
  // }
];
