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
