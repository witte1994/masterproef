import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-ajax/iron-ajax'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';
import '@polymer/paper-icon-button/paper-icon-button'
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
            url="http://localhost:3000/patient"
            method="GET"
            handle-as="json"
            content-type="application/json"
            last-response="{{patients}}"
            bubbles="true">
        </iron-ajax>

		<h2 style="margin: 0px 0px 20px 10px;">Select a patient</h2>

        <vaadin-grid aria-label="Basic Binding Example" items="{{patients}}">

        <vaadin-grid-column width="60px" flex-grow="0">
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
            <template>[[item.dateStr]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column width="30px">
            <template><paper-icon-button title="Open patient file" on-click="patientClick" id="[[item._id]]" icon="arrow-forward"></paper-icon-button></template>
        </vaadin-grid-column>

        </vaadin-grid>
    `;
    }
    static get properties() {
        return {
            
        };
    }

    ready() {
        super.ready();
        
        this.$.ajaxPatients.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxPatients.generateRequest();
    }

    patientClick(e) {
        window.history.pushState("", "", "/" + e.srcElement.id);

        this.dispatchEvent(new CustomEvent('patient-click', { bubbles: true, composed: true }));
    }
}

window.customElements.define('patient-list-element', PatientListElement);
