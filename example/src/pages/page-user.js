import { html, Component, define } from 'barm';

class User extends Component {
  render = () => {
    return html`
      <div>page-user</div>
    `;
  };
}

define('page-user')(User);
