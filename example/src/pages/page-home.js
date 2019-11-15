import { define, html, Component } from 'barm';
import { routeMap } from '../store';

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

  renderBody = ({ name }) => {
    return html`
      <div>render-${name}</div>
    `;
  };

  render = () => {
    return html`
      <div>
        <div>page-home: ${this.state.num} <button onclick=${this.handleAddNum}>add num</button></div>
        <${this.renderBody} name="subname" />
        <button onclick=${() => routeMap.push('/hooks')}>go-to-hooks-page</button>
        <button onclick=${() => routeMap.push('/render-props')}>go-to-render-props-page</button>
        <button onclick=${() => routeMap.push('/hoc')}>go-to-hoc-page</button>
      </div>
    `;
  };
}

define('page-home')(Home);
