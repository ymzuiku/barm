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

  render = () => {
    return html`
      <div>
        <div>page-home: ${this.state.num}</div>
        <button onclick=${this.handleAddNum}>add num</button>
        <button onclick=${() => routeMap.push('/user')}>go-to-user-page</button>
      </div>
    `;
  };
}

define('page-home')(Home);
