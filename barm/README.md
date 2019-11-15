# barm

![](./barmImage.jpg)

## 前端分岔口

笔者认为，前端行业现在处于一个分岔口：

- 渐进式 WebApp
- 框平台原生 App

其中 WebApp 随着各行各业业务的不断发展，仅仅 SPA 应用已经很难满足现有的迭代开发；各类微服务方案开始被提上议程，其中以 web-components 为基础的微服务方案关注度较高。

barm 是一个渐进式、微服务胶水框架，基于 web-components，并且对 React 开发者友好。

这意味着 barm 必须满足以下条件：

- 声明式的开发方式，和 react 雷同的 API，这才能对 React 开发者友好
- 自身体积足够小(gzip: 4KB)，可以无痛嵌入在其他大型框架中
- 渐进式，可以成为一个独立框架进行运作，满足常用的开发需求，并且可以独立发布部署
- 可以和 Vanilla JS 很好的配合

## 基本使用

因为 barm 定位是一个前端微服务的胶水方案，所以它不应该特别依赖于编译环境；

为此，barm 使用 html 字符串解析，不需要配置 JSX 解析的 babel，我们来看一个例子：

注册 web-component

```js
import { html, Component, define } from 'barm';

class User extends Component {
  render = () => {
    return html`
      <div>page-user</div>
    `;
  };
}

define('page-user')(User);
```

渲染到页面

```js
const pageUser = document.createElement('page-user');
document.body.append(pageUser);
```

barm 每个组件都是一个 web-component, 遵循 react API 及生命周期

注册一个组件：

```js
import { define, html, Component } from 'barm';

class Home extends Component {
  state = {
    num: 0,
  };

  handleAddNum = () => {
    this.setState(({ num }) => {
      return {
        num: num + 1,
      };
    });
  };

  render = () => {
    return html`
      <div>
        <div>page-home: ${this.state.num}</div>
        <button onclick=${this.handleAddNum}>add num</button>
      </div>
    `;
  };
}

define('page-home')(Home);
```

在其他组件内使用之前注册的组件

```js
import { html, Component, define } from 'barm';

class User extends Component {
  render = () => {
    return html`
      <div>
        <div>render-other-component</div>
        <page-home />
      </div>
    `;
  };
}

define('page-user')(User);
```

### 支持组件名为函数

```js
import { html, Component, define } from 'barm';

class User extends Component {
  renderBody = ({ name }) => {
    return html`
      <div>render-${name}</div>
    `;
  };

  render = () => {
    return html`
      <div>
        <${this.renderBody} name="hello" />
      </div>
    `;
  };
}

define('page-user')(User);
```

## 设计模式汇总

我们将一步步演示如何实现 react 的所有设计模式：

- Class Component
- Pure Component
- Hooks
- Render Props
- HOC

### 支持 Pure Component

```js
import { html, define } from 'barm';

define('page-user')(() => {
  return html`
    <div>
      <div>page-user</div>
    </div>
  `;
});
```

### 支持 Hooks: Function Component 支持生命周期

函数组件的第二个参数是一个 hooks，它会暴露一个 Class Component 完整的生命周期及类成员变量给到函数组件;

函数组件可以借此实现所有类组件的功能:

```js
import { html, define, useHooks } from 'barm';

define('render-hooks')((props, hooks) => {
  if (!hooks.isInited) {
    hooks.state = {
      name: '',
    };
    hooks.componentDidMount = () => {
      //
    };
    hooks.handleOnInput = e => {
      hooks.setState({ name: e.target.value });
    };
  }

  return html`
    <div>
      <div>${hooks.state.name}</div>
      <input placeholder="test-hooks" oninput=${hooks.handleOnInput} />
    </div>
  `;
});
```

### 支持 Hooks 抽象

React hooks 的一个特点就是可以将生命周期的逻辑抽离并复用，在 barm 中我们也可以实现同质效果；

barm 的 hooks 实现和官方的有出入，这是因为 react-hooks 是将状态捆绑在 React Firber 上，这将要求整个项目上下文仅有 1 个 react 对象，barm 是一个前端微服务框架，更适合使用类组件的方式将每个状态隔离在各自组件中，所以继续沿用类组件的生命周期：

```js
import { html, define, useHooks } from 'barm';

// 将逻辑抽离到公共区域，以复用
const useSetName = useHooks(hooks => {
  if (!hooks.isInited) {
    hooks.state = {
      name: '',
    };
    hooks.componentDidMount = () => {
      //
    };
    hooks.handleOnInput = e => {
      hooks.setState({ name: e.target.value });
    };
  }
});

define('render-hooks')((props, hooks) => {
  useSetName(hooks);

  return html`
    <div>
      <div>${hooks.state.name}</div>
      <input placeholder="test-hooks" oninput=${hooks.handleOnInput} />
    </div>
  `;
});
```

### 支持 Render Props

```js
import { html, define } from 'barm';

define('render-props-button')(({ children }) => {
  return html`
    <button>${children('button-name')}</button>
  `;
});

define('page-user')(() => {
  return html`
    <div>
      <div>page-user</div>
      <render-props-button>
        ${name =>
          html`
            <span>${name}</span>
          `}
      </render-props-button>
    </div>
  `;
});
```

### 支持 HOC

HOC(高阶函数)是 React 早起的一种生命周期抽象的设计模式, 虽然我们有了 hooks\renderProps 等同类的抽象行为，不过 Barm 也同样支持 HOC

```js
import { html, define, Component } from 'barm';

define('the-button')(props => {
  return html`
    <button ...${props}>hello-hoc</button>
  `;
});

function withLogAtDidMount() {
  return (name, connectName) => {
    define(name)(
      class extends Component {
        componentDidMount = () => {
          console.log('hoc-log');
        };
        render = () => {
          return html`
            <${connectName} ...${this.props} />
          `;
        };
      },
    );
  };
}

withLogAtDidMount()('hoc-button', 'the-button');

define('page-hoc')(() => {
  return html`
    <div>
      <div>page-hooks</div>
      <hoc-button style="font-size: 20px;" />
    </div>
  `;
});
```

## shadow-dom

barm 虽然使用了 web-components 但是并没有使用 shadow-dom

这是因为 barm 每个组件都是一个 web-component，shadow-dom 的样式隔离对于很多业务情景并无必要，现实中我们使用 BEM 已经能够很好的隔离样式污染和更好的共享样式，未来可以考虑添加一个属性以决定是否开启 shadow-dom。

## 微前端

barm 立志于创建一个微前端架构，它第一个功能是需要跨框架，理论上 barm 可以在任何框架内允许

以 react 为例子, 假定我们使用 barm 创建了一个 page-home web-component, 我们在 react 使用它和使用 原生 DOM 元素类似：

```js
import React from 'react';
import 'page-home';

export function HomePage() {
  return (
    <div>
      <page-home name="home" />
    </div>
  );
}
```

### 独立发布、独立部署

barm 除了可以很轻松的在各前端框架内使用，还需要满足自身的独立发布、独立部署，所以它需要一些必备生态：状态管理和路由;

barm 实现了 barm-redux 和 barm-redux-route，其中 route 组件是和状态管理捆绑的，每当路由发生变化，我们可以派发事件变更名，若要更简化的路由组件可以使用 vanilla-route

- barm-redux
- barm-redux-route
