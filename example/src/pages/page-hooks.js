import { html, define, useHooks } from 'barm';

const useSetName = useHooks((hooks, name) => {
  if (!hooks.isInited) {
    hooks.state = {
      [name]: '',
    };
    hooks.componentDidMount = () => {
      //
    };
    hooks.handleOnInput = e => {
      hooks.setState({ [name]: e.target.value });
    };
  }
});

define('render-hooks')((props, hooks) => {
  useSetName(hooks, 'name');

  return html`
    <div>
      <div>${hooks.state.name}</div>
      <input placeholder="test-hooks" oninput=${hooks.handleOnInput} />
    </div>
  `;
});

define('page-hooks')(() => {
  return html`
    <div>
      <div>page-hooks</div>
      <render-hooks />
    </div>
  `;
});
