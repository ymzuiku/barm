import { Component } from './Component';
import { createBabelConstruct } from './createBabelConstruct';

function randomName() {
  const hash = Math.random()
    .toString(36)
    .slice(2, -1);

  const time = Date.now()
    .toString(36)
    .slice(2, -1);

  return `barm-${hash}-${time}`;
}

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

const defineSet = new Set();

export const define = (name?: string) => {
  let realName = name!;
  if (!name) {
    realName = randomName();
  }

  return (Ele: any) => {
    if (defineSet.has(realName)) {
      // tslint:disable-next-line
      console.error(`customElements.define(${realName}) is has`);

      return {
        name: realName!,
        define: (nextName?: string): any => {
          return define(nextName!)(Ele);
        },
      };
    }
    defineSet.add(realName);

    customElements.define(realName, createComponent<any>(Ele));

    return {
      name: realName!,
      define: (nextName?: string): any => {
        return define(nextName)(Ele);
      },
    };
  };
};
