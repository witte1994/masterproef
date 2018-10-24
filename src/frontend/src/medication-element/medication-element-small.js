import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class MedicationElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 256px;
                font-family: 'Roboto', Helvetica, sans-serif;
            }
        </style>



        <div class="card" style="padding-bottom: 0px;">
            <h1>medication small</h1>
        </div>
    `;
    }
    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

}

window.customElements.define('medication-element-small', MedicationElementSmall);
