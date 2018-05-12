import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * @customElement
 * @polymer
 */
class PatientsElement extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'patients-element'
      }
    };
  }
}

window.customElements.define('patients-element', PatientsElement);