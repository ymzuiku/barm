import { html, define } from 'barm';

define('render-props-button')(({ children }) => {
  return html`
    <button>${children('button-name')}</button>
  `;
});

define('page-render-props')(() => {
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
