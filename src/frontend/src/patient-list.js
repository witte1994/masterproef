import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-ajax/iron-ajax'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import './shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class PatientList extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 600px;
            }
            
            .row {
                width: 100%;
                text-align: center;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax 
            id="ajaxPatients"
            url="http://localhost:3000/user"
            method="GET"
            handle-as="json"
            content-type="application/json"
            on-response="patientsReceived"
            bubbles="true">
        </iron-ajax>

		<h2 style="margin: 0px 0px 0px 10px;">Select a patient</h2>

        <vaadin-grid aria-label="Basic Binding Example" items="{{patients}}">

        <vaadin-grid-column width="60px" flex-grow="0">
            <template class="header">#</template>
            <template>[[index]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
            <template class="header">
                <vaadin-grid-sorter path="firstName">First name</vaadin-grid-sorter>
            </template>
            <template>[[item.firstName]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
            <template class="header">
                <vaadin-grid-sorter path="lastName">Last name</vaadin-grid-sorter>
            </template>
            <template>[[item.lastName]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
            <template class="header">Birth date</template>
            <template>[[item.birth]]</template>
        </vaadin-grid-column>

        </vaadin-grid>
    `;
    }
    static get properties() {
        return {
            patients: {
                type: Array,
                notify: true,
                reflectToAttribute: true
            }
        };
    }

    ready() {
        super.ready();
        
        this.$.ajaxPatients.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxPatients.generateRequest();
    }

    patientsReceived(event) {
        console.log(event.detail.response);
        this.patients = event.detail.response;

        for (var i = 0; i < this.patients.length; i++) {
            var dateObj = new Date(this.patients[i].birth);
            this.patients[i].birth = this.getDateString(dateObj);
        }
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('patient-list', PatientList);
