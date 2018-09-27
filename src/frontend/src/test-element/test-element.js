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
                width: 400px;
                height: 400px;
            }
            
            .row {
                width: 100%;
                text-align: center;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        

        <div class="card handle">
            <h1>test</h1>
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
