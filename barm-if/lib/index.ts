import { html } from 'barm';

export interface IBarmIf {
  show: any;
  children: any;
}

function BarmIf({ show, children }: IBarmIf) {
  return html`
    ${show && children}
  `;
}

customElements.define('barm-if', BarmIf);
