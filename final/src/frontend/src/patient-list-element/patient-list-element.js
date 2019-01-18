import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import moment from 'moment/src/moment'

import '@polymer/iron-ajax/iron-ajax'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PatientListElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 600px;
            }
            
            paper-button { 
                background: #e0e0e0;
            }

            vaadin-grid {
                margin-left: 0px;
                margin-right: 0px;
            }

            #titleHeader {
                display: grid;
                grid-template-columns: auto 100px;
                margin-bottom: 10px;
            }
        </style>

        <iron-ajax 
            id="ajaxPatients"
            url="http://localhost:3000/patient"
            method="GET"
            handle-as="json"
            content-type="application/json"
            last-response="{{patients}}">
        </iron-ajax>

        <iron-ajax 
            id="ajaxImport"
            url="http://localhost:3000/import"
            method="POST"
            handle-as="json"
            content-type="application/json"
            on-response="importSuccess"
            on-error="importError">
        </iron-ajax>

        <div id="titleHeader">
            <h2 style="margin: 10px 0px 0px 10px;">Select a patient</h2>
            <paper-button style="margin: 0px 10px 0px 0px;" on-tap="openImportDialog">Import</paper-button>
        </div>
		

        <vaadin-grid theme="compact" items="{{patients}}">
            <vaadin-grid-column style="padding-left: 20px;" width="40px" flex-grow="0">
                <template class="header">#</template>
                <template>[[index]]</template>
            </vaadin-grid-column>

            <vaadin-grid-column width="160px">
                <template class="header">
                    <vaadin-grid-sorter path="firstName">
                        <vaadin-grid-filter aria-label="First Name" path="firstName" value="[[_filterFirstName]]">
                            <vaadin-text-field style="width:145px;" slot="filter" placeholder="First name" value="{{_filterFirstName}}" focus-target></vaadin-text-field>
                        </vaadin-grid-filter>
                    </vaadin-grid-sorter>
                </template>
                <template>[[item.firstName]]</template>
            </vaadin-grid-column>

            <vaadin-grid-column width="160px">
                <template class="header">
                    <vaadin-grid-sorter path="lastName">
                        <vaadin-grid-filter aria-label="Last Name" path="lastName" value="[[_filterLastName]]">
                            <vaadin-text-field style="width:145px;" slot="filter" placeholder="Last name" value="{{_filterLastName}}" focus-target></vaadin-text-field>
                        </vaadin-grid-filter>
                    </vaadin-grid-sorter>
                </template>
                <template>[[item.lastName]]</template>
            </vaadin-grid-column>

            <vaadin-grid-column width="100px">
                <template class="header">Birth date</template>
                <template>{{getDateString(item.birth)}}</template>
            </vaadin-grid-column>

            <vaadin-grid-column style="padding-right: 10px;" width="40px" flex-grow="0">
                <template><paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" title="Open patient file" on-click="patientClick" id="[[item._id]]" icon="arrow-forward"></paper-icon-button></template>
            </vaadin-grid-column>
        </vaadin-grid>

        <paper-dialog id="importDialog">
            <h2>Import patients</h2>

            <div>
                <textarea id="jsonBody" cols="50" rows="20"></textarea>
            </div>
            
            <div>
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="importPatients">Import</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="importSuccess">
            <h2>Import successful!</h2>

            <div>
                <paper-button dialog-confirm on-tap="loadPatients">Continue</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="importFail">
            <h2>Import Failed!</h2>

            <p>Check your JSON code and try again.</p>

            <div>
                <paper-button dialog-confirm>Continue</paper-button>
            </div>
        </paper-dialog>
    `;
    }
    static get properties() {
        return {
            
        };
    }

    ready() {
        super.ready();
        
        this.loadPatients();
    }

    loadPatients() {
        this.$.ajaxPatients.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxPatients.generateRequest();
    }

    getDateString(date) {
        return moment(date).format("DD/MM/YYYY");
    }

    patientClick(e) {
        window.history.pushState("", "", "/" + e.srcElement.id);

        this.dispatchEvent(new CustomEvent('patient-click', { bubbles: true, composed: true }));
    }

    openImportDialog(e) {
        this.$.importDialog.open();
    }

    importPatients(e) {
        this.$.ajaxImport.body = this.$.jsonBody.value;
        this.$.ajaxImport.generateRequest();
    }

    importSuccess() {
        this.$.importSuccess.open();
    }

    importError() {
        this.$.importFail.open();
    }
}

window.customElements.define('patient-list-element', PatientListElement);
