import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-date-picker/vaadin-date-picker-light';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class MedicationElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 400px;
            }

            h1 {
                font-family: 'Roboto', Helvetica, sans-serif;
            }

            .containerHeader {
                width: 100%;
                display: grid;
                grid-template-columns: auto 56px;
                align-items: center;
            }

            .buttonsHeader {
                padding: 0px;
                height: 24px;
                width: 24px;
            }

            .containerDate {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 30px 1fr;
                justify-items: center;
                align-items: center;
            }

            .my-input1 input {
                background: #f5f5f5;
                border: 2px solid #2196f3;
                border-radius: 4px;
                padding: 4px;
                margin-top: 4px;
                margin-bottom: 4px;
                text-align: center;
            }

            .dash {
                font-size: 22px;
            }
        </style>

        <div class="card">
            <div class="containerHeader">
                <h1>Medication</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="addMedication"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div class="containerDate">
                <vaadin-date-picker-light on-value-changed="dateSelected" style="justify-self: end;" class="my-input1">
                    <iron-input>
                        <input placeholder="Start" size="8">
                    </iron-input>
                </vaadin-date-picker-light>

                <div class="dash">-</div>

                <vaadin-date-picker-light on-value-changed="dateSelected" style="justify-self: start;" class="my-input1">
                    <iron-input>
                        <input placeholder="End" size="8">
                    </iron-input>
                </vaadin-date-picker-light>
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

        this.setUserId();
    }

    dateSelected(e) {
        console.log("date selected");
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    addMedication(e) {
        console.log("add med");
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('medication-element', MedicationElement);
