import { Component, define, html } from 'barm';

import { createHistory, IHistory as TheIHistory } from './createHistory';

const SHOW_DISPLAY = 'block';
const HIDDEN_DISPLAY = 'block';
const HIDDEN_ZINDEX = 1;
const SHOW_ZINDEX = 3;
const LAST_ZINDEX = 2;
const HIDDEN_POSITION = 'absolute';
const SHOW_POSIRION = 'relative';
const SHOW_POINTEREVENTS = 'auto';
const HIDDEN_POINTEREVENTS = 'none';

export type IHistory = TheIHistory;

export interface IRouteProps {
  /* component 可以是组件对象，也可以是 import() 函数, 其中 import() 函数需要配合 loadTime 实现 */
  component?: any;
  /* 如果历史路由中包含path，使用 div包裹子组件，并设置 dispatch=none 代替 return null */
  keep?: boolean;
  /* 预留给页面跳转的时间，等待若干毫秒，才将当前画面设置为 display: none */
  leaveTime?: number;
  /* 等待若干毫秒，异步读取组件，若未定义，则同步读取组件; 如果路由提前切换到目标组件，会忽略延迟加载，直接开始异步 */
  delay?: number;
  /* 用于校验路由的路径 */
  path: string;
  class: string;
}

/**
 *  为了单一数据驱动，Route 需要和 redux 进行绑定
 *  Route 使用 history.listen 而不使用 consumer 是因为 Route 属于非常固定的模式.
 *  Route 会常驻 VNode 对象树，使用 listen 可以有效减少不必要的 consumer 订阅。
 */
export function createRoute(store: any) {
  const routeMap = createHistory(store);

  class Route extends Component<IRouteProps> {
    public static defaultProps = {
      sync: 'sync',
      keep: true,
      animeTime: 0,
    };
    public animeTimer: any = null;
    public realChild: any = null;
    public state = {
      isRenderChild: null,
      realChild: null,
      style: {
        display: HIDDEN_DISPLAY,
        position: HIDDEN_POSITION,
        zIndex: HIDDEN_ZINDEX,
      },
    };
    public unListen: () => any = null as any;

    public componentWillMount = () => {
      const { delay, component: Comp } = this.props;
      // 预先加载
      if (delay !== undefined && delay !== 0) {
        setTimeout(() => {
          if (!this.state.realChild) {
            Comp();
          }
        }, delay);
      }
    };

    public componentDidMount = () => {
      this.unListen = routeMap.listen(this.onHistoryUpdate);
    };

    public componentWillUnmount = () => {
      if (this.unListen) {
        this.unListen();
      }
      this.realChild = null;
      this.animeTimer = null;
    };

    public onHistoryUpdate = () => {
      const { path, delay, component, keep, leaveTime } = this.props;
      const { isRenderChild } = this.state;
      const { match, stackMatch, lastPage } = routeMap.checkUrlMatch(path);

      if (match) {
        // 如果没有 child, 先读取，再重新执行
        if (!this.realChild) {
          if (delay === undefined) {
            this.realChild = html`
              <${component} />
            `;
            this.onHistoryUpdate();
          } else {
            component().then((V: any) => {
              this.realChild = html`
                <${V} />
              `;
              this.onHistoryUpdate();
            });
          }
        }

        this.setState({
          isRenderChild: true,
          style: {
            pointerEvents: SHOW_POINTEREVENTS,
            display: SHOW_DISPLAY,
            position: SHOW_POSIRION,
            zIndex: SHOW_ZINDEX,
          },
        });
      } else {
        // 如果不需要保持组件，清空child
        const isKeepChild = keep && stackMatch;

        if (isRenderChild === undefined || isRenderChild === true) {
          if (lastPage && leaveTime && leaveTime > 0) {
            this.setState(
              {
                style: {
                  pointerEvents: SHOW_POINTEREVENTS,
                  display: SHOW_DISPLAY,
                  position: HIDDEN_POSITION,
                  zIndex: SHOW_DISPLAY,
                },
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    isRenderChild: isKeepChild,
                    style: {
                      pointerEvents: HIDDEN_POINTEREVENTS,
                      display: HIDDEN_DISPLAY,
                      position: HIDDEN_POSITION,
                      zIndex: HIDDEN_ZINDEX,
                    },
                  });
                }, leaveTime);
              }
            );
          } else {
            this.setState({
              isRenderChild: isKeepChild,
              style: {
                pointerEvents: HIDDEN_POINTEREVENTS,
                display: HIDDEN_DISPLAY,
                position: HIDDEN_POSITION,
                zIndex: lastPage ? LAST_ZINDEX : HIDDEN_ZINDEX,
              },
            });
          }
        }
      }
    };

    public render = () => {
      const { path, class: className } = this.props;
      const { style, isRenderChild } = this.state;

      if (!isRenderChild) {
        return null;
      }

      const styleStr = `width: 100%; height: 100%; overflow: hidden; left: 0px; top: 0px; ${style}`;

      return html`
        <div about=${path} class=${className} style=${styleStr}>
          ${this.realChild}
        </div>
      `;
    };
  }

  routeMap.defineRoute = (name: string) => {
    define(name)(Route);

    return name;
  };

  return routeMap;
}
