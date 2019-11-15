import { Component } from "./Component";
import { createBabelConstruct } from "./createBabelConstruct";

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

export const define = (name: string) => {
  return (Ele: any) => {
    customElements.define(name, createComponent<any>(Ele));
  };
};
