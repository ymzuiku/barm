import { html } from 'barm';

export interface IBarmIf {
  is: any;
  children: any;
}

function BarmIf({ is, children }: IBarmIf) {
  return html`
    ${is && children}
  `;
}

customElements.define('barm-if', BarmIf);
