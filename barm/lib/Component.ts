import { createBabelConstruct } from './createBabelConstruct';
import { diff } from './diff';

export interface IComponentProps {
  children?: any;
  key?: string;
  ref?: (fn: (ref: any) => any) => any;
}

const BabelHTMLElement = createBabelConstruct(HTMLElement);

export class Component<P> extends BabelHTMLElement {
  // update with newProps
  public static isClass = true;
  /** at update props, return new state */
  public static getDerivedStateFromProps: (nextProps: any, nowState: any) => any = null as any;

  /** web-component self state */
  public state: any = {};

  /** props is out params */
  public props: P = {} as any;

  /** at setState and change props, if return false, block update */
  public shouldComponentUpdate: (nextProps: any, nextState: any) => boolean = undefined as any;

  /** web-component is new init, before componentDidMount */
  public isInited = false;

  /** web-component is remove */
  public isRemoved = false;

  /** web-component at focusUpdate */
  private __isFocusUpdate = false;
  private __nextProps: P = {} as any;
  private __nextState = null as any;
  private readonly __attributes = {} as any;

  /** render dom */
  private __vdom = null as any;

  /** merge some setState at onece */
  private __setStateTimer = null as any;

  public constructor() {
    super();
    // return this;
  }

  private readonly update = (nextProps: any, nextState: any, fromSetState?: boolean) => {
    // 如果需要更新
    if (this.checkShouldUpdate(nextProps, nextState)) {
      // 实现 react 16.x 新API
      if (!fromSetState && Component.getDerivedStateFromProps) {
        const derivedState = Component.getDerivedStateFromProps(nextProps, nextState);
        if (derivedState !== undefined) {
          nextState = derivedState;
        }
      }

      // 更新当前 props 和 state
      this.props = nextProps;
      this.state = nextState;

      // do-update
      const node = this.render();

      if (Array.isArray(node)) {
        diff(null, node, this);
      } else {
        this.__vdom = diff(this.__vdom, node, undefined);
      }

      // life
      this.componentDidUpdate();
    }
  };

  private readonly checkShouldUpdate = (nextProps: any, nextState: any) => {
    if (this.isRemoved) {
      return false;
    }

    if (this.__isFocusUpdate) {
      this.__isFocusUpdate = false;

      return true;
    }

    let isNeedUpdate = false;
    if (this.shouldComponentUpdate) {
      isNeedUpdate = this.shouldComponentUpdate(nextProps, nextState);
    } else {
      // pureComponent
      const nextStateKeys = Object.keys(nextState);
      for (let i = 0; i < nextStateKeys.length; i++) {
        const k = nextStateKeys[i];
        if (nextState[k] !== this.state[k]) {
          isNeedUpdate = true;
          break;
        }
      }

      if (!isNeedUpdate) {
        const nextPropsKeys = Object.keys(nextProps);
        for (let i = 0; i < nextPropsKeys.length; i++) {
          const k = nextPropsKeys[i];
          if (nextProps[k] !== (this.props as any)[k]) {
            isNeedUpdate = true;
            break;
          }
        }
      }
    }

    return isNeedUpdate;
  };

  public newProps = (val: P) => {
    this.__nextProps = {
      ...val,
    };
    if (!this.isInited) {
      this.props = val;
    } else {
      this.update(this.__nextProps, this.state);
    }
  };

  public focusUpdate = () => {
    this.__isFocusUpdate = true;
    this.setState(this.__nextState);
  };

  /** change state, and run update */
  public setState = (value: any, updateCallback?: any) => {
    if (typeof value === 'function') {
      if (!this.__nextState) {
        this.__nextState = this.state;
      }
      this.__nextState = {
        ...this.__nextState,
        ...value(this.__nextState),
      };
    } else {
      this.__nextState = {
        ...this.__nextState,
        ...value,
      };
    }

    if (this.__setStateTimer) {
      clearTimeout(this.__setStateTimer);
      this.__setStateTimer = null;
    }

    this.__setStateTimer = setTimeout(() => {
      this.update(this.props, this.__nextState, true);

      if (updateCallback) {
        updateCallback(this.state);
      }
    }, 17);
  };
  // 元素插入到文档中时调用
  public connectedCallback() {
    if (!this.isInited) {
      // 初始化barm框架外部设置的属性
      Object.keys(this.attributes).forEach(key => {
        const { name, value } = (this.attributes as any)[key];
        (this.props as any)[name] = value;
        if (name === 'id') {
          (this as any).id = value;
        }
        this.__attributes[name] = true;
      });
    }

    const node = this.render();

    if (Array.isArray(node)) {
      diff(null, node, this);
    } else {
      this.__vdom = diff(this.__vdom, node, this);
    }

    this.isInited = true;
    this.componentDidMount();
  }

  public setAttribute = (name: string, value: any) => {
    // 1.拦截组件的 setAttribute，组件使用 newProps 去更新状态
    // 2.如果是barm外部设置的属性，使用更新
    if (this.__attributes[name]) {
      this.__nextProps = {
        ...this.props,
        [name]: value,
      };
    }
  };

  // 元素从文档中移除时调用
  public disconnectedCallback() {
    this.componentWillUnmount();
    this.isRemoved = true;
    this.isInited = false;
  }

  /** web-component constructor no have props, so keep this API  */
  public componentWillMount = () => {};

  /** web-component connectedCallback and render  */
  public componentDidMount = () => {};

  /** web-component after render  */
  public componentDidUpdate = () => {};

  /** web-component at disconnectedCallback */
  public componentWillUnmount = () => {};

  public render = () => {};
}
