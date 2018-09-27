import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class TestElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        </style>

        

        <div class="card">
            <h1 style="display: inline;">test</h1>
            <h1 style="display: inline;">test</h1>
        </div>
    `;
    }
    static get properties() {
        return {
            
        };
    }

    ready() {
        super.ready();
    }

}

window.customElements.define('test-element', TestElement);
