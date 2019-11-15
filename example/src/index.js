import { html, define, Component } from 'barm';
import 'barm-if';
import { routeMap } from './store';
import './pages/page-home';
import './pages/page-render-props';
import './pages/page-hooks';
import './pages/page-hoc';

define('example-app')(
  class extends Component {
    componentDidMount = () => {
      routeMap.init('/home');
    };
    render = () => {
      return html`
        <app-route path="/home" component="page-home" />
        <app-route path="/render-props" component="page-render-props" />
        <app-route path="/hooks" component="page-hooks" />
        <app-route path="/hoc" component="page-hoc" />
      `;
    };
  },
);

document.body.append(document.createElement('example-app'));
