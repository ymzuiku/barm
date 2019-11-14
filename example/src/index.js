import { html, define, Component } from 'barm';
import 'barm-if';
import { routeMap } from './store';
import './pages/page-home';
import './pages/page-user';

define('example-app')(
  class extends Component {
    componentDidMount = () => {
      routeMap.init('/home');
    };
    render = () => {
      return html`
        <div>
          <app-route path="/home" component="page-home" />
          <app-route path="user" component="page-user" />
        </div>
      `;
    };
  }
);

document.body.append(document.createElement('example-app'));
