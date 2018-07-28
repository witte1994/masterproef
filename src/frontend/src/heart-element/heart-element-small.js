import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-menu-button/paper-menu-button'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class HeartElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 340px;
            }
            
            .row {
                width: 100%;
                text-align: center;
            }

            .block {
                display: inline-block;
            }

            paper-button { 
                background: #e0e0e0;
            }

        </style>

        <div class="card">
            
            <div>
                <h1 class="block">Heart rate (BPM)</h1>
                <paper-menu-button class="block">
                    <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                    <paper-listbox slot="dropdown-content">
                        <paper-item>Remove module</paper-item>
                        <paper-item>Set thresholds</paper-item>
                    </paper-listbox>
                </paper-menu-button>
                
            </div>
            <div class="row">
                <paper-button class="block">3 days</paper-button>
                <paper-button class="block">week</paper-button>
                <paper-button class="block">month</paper-button>
            </div>

            <div class="row">
                <paper-icon-button class="block" icon="arrow-back"></paper-icon-button>
                <p class="block">08/06/2018 - 08/06/2018</p>
                <paper-icon-button class="block" icon="arrow-forward"></paper-icon-button>
            </div>

        </div>
    `;
    }
    static get properties() {
        return {
            userId: {
                type: String,
                value: '5b5c65e3ad30264506380dd1'
            },
            user: {
                value: Object
            },
            data: {
                value: String
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
        this.user = event.detail.response;
        var newDate = new Date(this.user.birth);
        this.date = newDate.getFullYear() + "-" + ("0" + newDate.getMonth()).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2);
    }
}

window.customElements.define('heart-element-small', HeartElementSmall);
