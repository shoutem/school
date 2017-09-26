import { getActiveRoute } from '@shoutem/core/navigation';
import { triggerScreenView } from './redux';

let activeRoute;

function watchRouteChangeAndDispatchAnalyticsScreenViewActions(app) {
  const store = app.getStore();
  store.subscribe(() => {
    const state = store.getState();
    const newActiveRoute = getActiveRoute(state);
    if (newActiveRoute && activeRoute !== newActiveRoute) {
      activeRoute = newActiveRoute;
      store.dispatch(triggerScreenView(activeRoute.title));
    }
  });
}

export const appWillMount = function (app) {
  watchRouteChangeAndDispatchAnalyticsScreenViewActions(app);
};
