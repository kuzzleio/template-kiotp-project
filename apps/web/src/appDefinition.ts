import { IoTConsoleChunks } from '@kuzzleio/iot-console';
import { Route } from 'vue-router';

// ---- Font Awesome ----
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';

// --- Dashboards ---
import DashboardWrapper from './views/dashboards/DashboardsWrapper.vue';
import DashboardList from './views/dashboards/DashboardList.vue';
import Dashboard from './views/dashboards/Dashboard.vue';

export const appDefinition = [
  {
    name: 'dashboards',
    label: 'locales.sidebar.dashboards',
    icon: faTachometerAlt,
    vuejsRoute: {
      path: '/dashboards',
      name: 'dashboards',
      component: DashboardWrapper,
      meta: {
        breadcrumb: 'locales.sidebar.dashboards',
      },
      children: [
        {
          path: 'v/:dashboardId',
          name: 'dashboard-view',
          component: Dashboard,
          meta: {
            breadcrumb: 'locales.dashboards.nav.view',
          },
          props: (route: Route): { id: string } => ({
            id: route.params.dashboardId,
          }),
        },
        {
          path: 'new',
          name: 'create-dashboard',
          component: Dashboard,
          meta: {
            breadcrumb: 'locales.dashboards.nav.create',
          },
        },
        {
          path: '',
          name: 'dashboards',
          component: DashboardList,
          meta: {
            breadcrumb: 'locales.dashboards.nav.list',
          },
        },
      ],
    },
  },
  ...IoTConsoleChunks,
];
