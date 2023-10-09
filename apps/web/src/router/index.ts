// In this example we use the `KIoTCViews` chunk, but you can use any other chunk,
// as explained above.
import {
  KIoTPBase as AppLayout,
  AppChunk,
  createAuthenticationGuard,
  createOnlineGuard,
  generateMenuItems,
  generateRoutes,
  KPageNotFound,
  KLogin,
  RootState,
} from '@kuzzleio/iot-platform-frontend';
import VueRouter from 'vue-router';
import { Store } from 'vuex';

import { kuzzle } from '../services/kuzzle';

export const createRouter = (
  store: Store<RootState>,
  appDefinition: AppChunk[] = [],
): VueRouter => {
  const appRoutes = generateRoutes(appDefinition);
  const sidebarItems = generateMenuItems(appDefinition);

  const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'history',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: KLogin,
        meta: {
          defaultRedirect: { name: 'dashboards' },
        },
      },
      {
        path: '/',
        beforeEnter: createAuthenticationGuard(store, 'login'),
        component: AppLayout,
        props: { navbarItems: [], sidebarItems },
        children: appRoutes,
        redirect: { name: 'dashboards' },
      },
      {
        path: '*',
        component: KPageNotFound,
      },
    ],
  });

  router.beforeEach(createOnlineGuard<RootState>(store, kuzzle));

  return router;
};
