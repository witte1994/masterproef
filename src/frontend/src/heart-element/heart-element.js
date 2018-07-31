import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-menu-button/paper-menu-button'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class HeartElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 800px;
            }

            .row {
                width: 100%;
                text-align: center;
                margin-bottom: 5px;
            }

            .block {
                display: inline-block;
                margin: auto;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax 
            url="http://localhost:3000/user/[[userId]]"
            method="GET"
            handle-as="json"
            on-response="handleResponse"
        ></iron-ajax>

        <div class="card">
            <div style="width:70%; display:inline-block; vertical-align:top;">
                <div style="width:40%; display:inline-block;">
                    <h1>Heart rate (BPM)</h1>
                </div><div style="width:60%; display:inline-block;">
                    <paper-button id="day" toggles on-tap="dateClick">3 days</paper-button>
                    <paper-button id="week" toggles on-tap="dateClick">week</paper-button>
                    <paper-button id="month" toggles on-tap="dateClick">month</paper-button>
                </div>
                          
            
            
            </div><div style="width:30%; display:inline-block;">
                <div style="width:80%; display:inline-block;">
                </div><div style="width:20%; display:inline-block;">
                    <paper-menu-button style="padding: 0px;">
                        <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                        <paper-listbox slot="dropdown-content">
                            <paper-item on-tap="removeModule">Remove module</paper-item>
                            <paper-item on-tap="setThresholds">Set thresholds</paper-item>
                        </paper-listbox>
                    </paper-menu-button>
                </div>
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            userId: {
                type: String,
                value: '5b5c65e3ad30264506380dd1'
            }
        };
    }

    ready() {
        super.ready();
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    handleResponse(event) {

    }
}

window.customElements.define('heart-element', HeartElement);
