import { createStore } from 'barm-redux';
import { createRoute } from 'barm-redux-route';

const initState = {
  name: 'dog',
  age: 10,
  paths: [],
  history: {
    '/': {},
  },
};

export const store = createStore(undefined, initState);
export const routeMap = createRoute(store);

store.defineConsumer('app-consumer');
routeMap.defineRoute('app-route');

if (process.env.NODE_ENV === 'development') {
  window.store = store;
}
