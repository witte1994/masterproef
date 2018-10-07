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
                margin-bottom: 8px;
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

            .detailsButton {
                padding: 0px;
                width: 20px;
                height: 20px;
            }

            .details {
                display: flex;
                font-size: 20px;
            }

            vaadin-grid-cell-content {
                padding: 4px 8px 4px 8px;
            }
        </style>

        <div id="cardId" class="card">
            <div class="containerHeader">
                <h1>Medication</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="addMedication"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div>
                <vaadin-grid style="height: 300px;" aria-label="Basic Binding Example" items="{{patients}}">

                    <template class="row-details">
                        <div class="details">
                        <p>
                            Hi! My name is
                        </p>
                        </div>
                    </template>

                    <vaadin-grid-column width="36px" flex-grow="0">
                        <template class="header"><iron-icon style="width: 20px; height: 20px;" icon="flag"></iron-icon></template>
                        <template>0</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="160px">
                        <template class="header">
                            <vaadin-grid-sorter path="medName">
                                <vaadin-grid-filter aria-label="Medication" path="medName" value="[[_filterMedName]]">
                                    <vaadin-text-field style="width:145px;" slot="filter" placeholder="Medication" value="{{_filterMedName}}" focus-target></vaadin-text-field>
                                </vaadin-grid-filter>
                            </vaadin-grid-sorter>
                        </template>
                        <template>[[item.medName]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="72px" flex-grow="0">
                        <template class="header">Dosage</template>
                        <template>[[item.dosage]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="109px" flex-grow="0">
                        <template class="header">
                            <vaadin-date-picker-light on-value-changed="dateSelected" style="justify-self: end;" class="my-input1">
                                <iron-input>
                                    <input placeholder="Start" size="8">
                                </iron-input>
                            </vaadin-date-picker-light>
                        </template>
                        <template>[[item.start]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="109px" flex-grow="0">
                        <template class="header">
                            <vaadin-date-picker-light on-value-changed="dateSelected" style="justify-self: start;" class="my-input1">
                                <iron-input>
                                    <input placeholder="End" size="8">
                                </iron-input>
                            </vaadin-date-picker-light>
                        </template>
                        <template>[[item.end]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="36px" flex-grow="0">
                        <template><paper-icon-button class="detailsButton" on-click="showDetails" id="[[item._id]]" icon="expand-more"></paper-icon-button></template>
                    </vaadin-grid-column>

                </vaadin-grid>
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

        this.patients = [
            {
                _id: "lala",
                medName: "Aliceran",
                dosage: "0/1/1/0",
                start: "02/01/19",
                end: "21/01/19"
            }
        ];

        var cardId = this.$.cardId;
        new ResizeSensor(this.$.cardId, function () {
            var width = cardId.getBoundingClientRect().width;
        });

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

    showDetails(e) {
        console.log("show details");
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('medication-element', MedicationElement);
