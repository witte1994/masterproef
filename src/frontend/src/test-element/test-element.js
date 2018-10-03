import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
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

            .container {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
        </style>

        <div class="card">
            <div class="container">
                <div>a</div>
                <div>b</div>
            </div>
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
