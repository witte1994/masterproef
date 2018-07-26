import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class MainElement extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          width: 400px;
        }
      </style>

      <div class="card">
        <div class="circle">1</div>
        <h1>[[prop1]]</h1>
        <p>Ut labores minimum atomorum pro. Laudem tibique ut has.</p>
        <p>Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea.Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea.Cu mei vide viris gloriatur, at populo eripuit sit.</p>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'main-element'
      }
    };
  }
}

window.customElements.define('main-element', MainElement);
