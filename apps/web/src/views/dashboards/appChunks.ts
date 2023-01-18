import { AppChunk } from '@kuzzleio/kuzzle-application-builder';
import Dashboard from './views/dashboards/Dashboard.vue';
import DashboardList from './views/dashboards/DashboardList.vue';
import DashboardWrapper from './views/dashboards/DashboardsWrapper.vue';

export const chunk: AppChunk[] = [
  {
    name: 'dashboards',
    label: 'Dashboards',
    vuejsRoute: {
      path: '/dashboards',
      name: 'dashboards',
      component: DashboardWrapper,
      meta: {
        breadcrumb: 'locales.nav.dashboards',
      },
      children: [
        {
          path: 'v/:dashboardId',
          name: 'dashboard-view',
          component: Dashboard,
          meta: {
            breadcrumb: 'locales.dashboards.nav.view',
          },
          props: (route) => ({
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
          props: {
            currentIndex: null,
          },
        },
      ],
    },
  },
];
