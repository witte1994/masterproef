import '@polymer/paper-button/paper-button.js'
import 'second-element.js'
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class MainElement extends PolymerElement {
  static get template() {
    return html`
    <!--Navbar-->
    <nav class="navbar navbar-expand-lg navbar-dark primary-color">
  
      <!-- Navbar brand -->
      <a class="navbar-brand mr-auto" href="#">Dashboard</a>
  
      <div class="d-flex justify-content-center">
        <form class="form-inline">
          <div class="md-form my-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          </div>
        </form>
      </div>
      
  
      <!-- Collapsible content -->
    </nav>

    <second-element></second-element>
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

  onTap() {
    console.log("clicky");
  }
}

window.customElements.define('main-element', MainElement);
