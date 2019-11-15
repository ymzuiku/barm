import { Component } from './Component';
import { createBabelConstruct } from './createBabelConstruct';

export const createComponent = <T>(FN: any) => {
  if (FN.isClass) {
    return createBabelConstruct(FN);
  }

  class PureDefineComponent extends Component<T> {
    public render = () => {
      return FN(this.props, this);
    };
  }

  return createBabelConstruct(PureDefineComponent);
};

declare function IDefineCb<P extends any>(functionComponent: (props: P, hooks: Component<P>) => any): any;
declare function IDefineCb<P extends any>(classComponent: any): any;

declare function IDefine(name: string): typeof IDefineCb;

export const useHooks = (setHooks: <P extends any>(hooks: Component<P>, ...args: any[]) => any) => setHooks;

export const define: typeof IDefine = (name: string) => {
  return (Ele: any) => {
    customElements.define(name, createComponent<any>(Ele));
  };
};
