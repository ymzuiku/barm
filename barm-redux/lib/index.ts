import { Component, define, html } from 'barm';

export type IMiddleware = <T>(getState: any, dispatch: any) => { getState: any; dispatch: any };

export interface IConsumer<S> {
  subscribe: (state: S) => any[];
  children: any;
}

const hash = () =>
  Math.random()
    .toString(36)
    .slice(2, 8);

export interface IStore<T> {
  dispatch: (action: any) => any;
  update: (action: (state: T) => any) => any;
  getState: () => T;
  defineConsumer: (tag: string) => void;
  subscribe: (fn: (state: T) => any) => any;
  connect: (mapStateToProps?: (state: T) => any, mapDispatchToProps?: (dispatch: any) => any) => (tag: string) => any;
  defineConnect: (
    tag: string,
    mapStateToProps?: (state: T) => any,
    mapDispatchToProps?: (dispatch: any) => any,
  ) => (Ele: any) => any;
  applyMiddleware: (...middleWares: IMiddleware[]) => any;
  applyReducer: (newReducer: any) => void;
}

export function reducerInAction(state: any, action: any) {
  if (typeof action === 'function') {
    action(state);
  }

  return state;
}

reducerInAction.key = 'reducerInAction';

export const createStore = <T>(reducer: any, initState: T): IStore<T> => {
  let state = initState as any;

  const subscribes = new Set();

  const store = {
    cache: {} as any,
    connect: <P>(mstp?: any, mdtp?: any) => {
      return (tag: string) => {
        return class extends Component<P> {
          public state = mstp ? mstp(store.getState()) : undefined;
          public dispatchs = mdtp ? mdtp(store.getState()) : undefined;
          public unSubscribe = null as any;
          public componentWillMount = () => {
            this.unSubscribe = store.subscribe((data: any) => {
              this.setState(mstp(data));
            });
          };
          public componentWillUnmount = () => {
            if (this.unSubscribe) {
              this.unSubscribe();
              this.unSubscribe = null;
            }
          };
          public render = () => {
            return html`
              <${tag} dispatch=${store.dispatch} ...${this.dispatchs} ...${this.state} />
            `;
          };
        };
      };
    },
    defineConnect: <P>(tag: string, mstp?: any, mdtp?: any) => {
      return (Ele: any) => {
        const hashTag = `${tag}-${hash()}`;

        define(hashTag)(Ele);
        define(tag)(store.connect(mstp, mdtp)(hashTag));
      };
    },
    dispatch: (action: any) => {
      state = reducer(state, action);
      subscribes.forEach((fn: any) => {
        fn(state);
      });
    },
    update: (action: any) => store.dispatch(action),
    defineConsumer: (tag: string) => {
      define(tag)(
        class extends Component<IConsumer<T>> {
          public lastMemo = [] as any;
          public unSubscribe = null as any;
          public componentWillMount = () => {
            const { subscribe } = this.props;
            this.lastMemo = subscribe(store.getState());

            const len = this.lastMemo.length;

            this.unSubscribe = store.subscribe((data: any) => {
              const nextMemo = subscribe(data);

              let isNeedUpdate = false;
              for (let i = 0; i < len; i++) {
                if (this.lastMemo[i] !== nextMemo[i]) {
                  isNeedUpdate = true;
                  break;
                }
              }

              this.lastMemo = nextMemo;
              if (isNeedUpdate) {
                this.focusUpdate();
              }
            });
          };
          public componentWillUnmount = () => {
            if (this.unSubscribe) {
              this.unSubscribe();
              this.unSubscribe = null;
            }
          };
          public render = () => {
            const { children } = this.props;

            return children(...this.lastMemo);
          };
        },
      );
    },
    getState: () => state,
    subscribe: (fn: any) => {
      if (!subscribes.has(fn)) {
        subscribes.add(fn);
      }

      return () => {
        subscribes.delete(fn);
      };
    },
    applyMiddleware: (...middleWares: IMiddleware[]) => {
      middleWares.forEach(mw => {
        const { getState, dispatch } = mw(store.getState, store.dispatch);

        store.dispatch = dispatch;
        store.getState = getState;
      });
    },
    applyReducer: (newReducer: any) => {
      if (newReducer.key) {
        if (!store.cache[newReducer.key]) {
          store.cache[newReducer.key] = newReducer.key;
        } else {
          return;
        }
      }

      const oldReducer = reducer;

      reducer = (theState: any, action: any) => {
        const oldState = oldReducer(theState, action);

        return newReducer(oldState, action);
      };
    },
  };

  return store;
};
