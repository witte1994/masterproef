import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-date-picker/vaadin-date-picker-light';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PrescriptionElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .custom-date input {
                    background: #f5f5f5;
                    border: 2px solid #2196f3;
                    border-radius: 4px;
                    padding: 4px;
                    margin-top: 4px;
                    margin-bottom: 4px;
                    text-align: center;
                }

                vaadin-grid-cell-content {
                    padding: 4px 8px 4px 8px;
                }

                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: 100px auto;
                }

                paper-input {
                    margin-top: 0px;
                    height: 50px;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxMeds"
                url="http://localhost:3000/medication"
                method="GET"
                handle-as="json"
                on-response="receivedMedication"
                last-response="{{data}}"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxPrescriptions"
                url="http://localhost:3000/user/[[userId]]/prescription"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxPrescriptionsByDate"
                url="http://localhost:3000/user/[[userId]]/prescription/[[startInt]]\&[[endInt]]"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreatePrescription"
                url="http://localhost:3000/user/[[userId]]/prescription/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxUpdatePrescription"
                url="http://localhost:3000/user/[[userId]]/prescription/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeletePrescription"
                url="http://localhost:3000/user/[[userId]]/prescription/delete/[[deleteId]]"
                method="DELETE"
                handle-as="json"
                on-response="sendUpdateSignal"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="prescriptionDialog">
                <h2>Create prescription</h2>

                <paper-dropdown-menu label="Medicin" id="medList">
                    <paper-listbox slot="dropdown-content">
                        <dom-repeat items="{{data}}">
                            <template>
                                <paper-item value$="{{item._id}}">{{item.name}}</paper-item>
                            </template>
                        </dom-repeat>
                    </paper-listbox>
                </paper-dropdown-menu>

                <div style="margin: 0px;">
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="morning" type="number" label="Morning"></paper-input>
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="noon" type="number" label="Noon"></paper-input>
                </div >
                <div style="margin: 0px;">
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="evening" type="number" label="Evening"></paper-input>
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="bed" type="number" label="Bed"></paper-input>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="startDate" style="padding: 0px;" label="Start date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="endDate" style="padding: 0px;" label="End date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button dialog-confirm on-tap="addPrescription">Accept</paper-button>
            </paper-dialog>

            <paper-dialog id="updatePrescriptionDialog">
                <h2>Update prescription</h2>

                <div style="margin: 0px;">
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="morningUpdate" type="number" label="Morning"></paper-input>
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="noonUpdate" type="number" label="Noon"></paper-input>
                </div >
                <div style="margin: 0px;">
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="eveningUpdate" type="number" label="Evening"></paper-input>
                    <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="bedUpdate" type="number" label="Bed"></paper-input>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="startDateUpdate" style="padding: 0px;" label="Start date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="endDateUpdate" style="padding: 0px;" label="End date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updatePrescription">Update</paper-button>
                <paper-button dialog-dismiss on-tap="deletePrescription">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{prescriptions}}">
                <template class="row-details">
                    <div class="detailsGrid">
                        <div><small>Description:</small></div>
                        <div><small>[[item.medication.description]]</small></div>
                        <div><small>Side effects:</small></div>
                        <div><small>[[item.medication.sideEffects]]</small></div>
                    </div>
                </template>

                <vaadin-grid-column width="36px" flex-grow="0">
                    <template class="header"><iron-icon style="width: 20px; height: 20px;" icon="flag"></iron-icon></template>
                    <template>0</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="160px">
                    <template class="header">
                        <vaadin-grid-sorter path="medication.name">
                            <vaadin-grid-filter aria-label="Medication" path="medication.name" value="[[_filterMedicationName]]">
                                <vaadin-text-field style="width:145px;" slot="filter" placeholder="Medicine" value="{{_filterMedicationName}}" focus-target></vaadin-text-field>
                            </vaadin-grid-filter>
                        </vaadin-grid-sorter>
                    </template>
                    <template>[[item.medication.name]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="72px" flex-grow="0">
                    <template class="header">Dosage</template>
                    <template>[[item.dosage.morning]]/[[item.dosage.noon]]/[[item.dosage.evening]]/[[item.dosage.bed]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="109px" flex-grow="0">
                    <template class="header">
                        <vaadin-date-picker-light id="startFilter" on-value-changed="dateSelected" style="justify-self: end;" class="custom-date">
                            <iron-input id="startInput">
                                <input id="startInputInner" placeholder="Start" size="8">
                            </iron-input>
                        </vaadin-date-picker-light>
                    </template>
                    <template>[[item.startStr]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="109px" flex-grow="0">
                    <template class="header">
                        <vaadin-date-picker-light id="endFilter" on-value-changed="dateSelected" style="justify-self: start;" class="custom-date">
                            <iron-input>
                                <input placeholder="End" size="8">
                            </iron-input>
                        </vaadin-date-picker-light>
                    </template>
                    <template>[[item.endStr]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="40px" flex-grow="0">
                    <template><paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;"icon="create" on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]"></paper-icon-button></template>
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
        this.title = "Prescriptions";

        this.selectedStartDate = null;
        this.selectedEndDate = null;

        this.$.ajaxMeds.generateRequest();
        this.update();
    }

    update(e) {
        if (!this.checkDates())
            this.$.ajaxPrescriptions.generateRequest();
    }

    sendUpdateSignal() {
        this.dispatchEvent(new CustomEvent("prescription", {bubbles: true, composed: true}));
    }

    dateSelected(e) {
        if (e.detail.value !== "") {
            if (e.target.id === "startFilter") {
                this.selectedStartDate = new Date(e.detail.value);
            } else if (e.target.id === "endFilter") {
                this.selectedEndDate = new Date(e.detail.value);
            }
        }
        
        this.checkDates();
    }

    checkDates() {
        if (this.selectedStartDate === null || this.selectedEndDate === null) {
            return false;
        } else if (this.selectedStartDate < this.selectedEndDate) {
            this.startInt = this.selectedStartDate.getTime();
            this.endInt = this.selectedEndDate.getTime();
            
            this.$.ajaxPrescriptionsByDate.generateRequest();
            return true;
        } else {
            return false;
        }
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
    }

    openUpdatePrescriptionDialog(e) {
        this.curObj = this.prescriptions[e.target.dataset.args];
        var curObj = this.curObj;

        this.$.morningUpdate.value = curObj.dosage.morning;
        this.$.noonUpdate.value = curObj.dosage.noon;
        this.$.eveningUpdate.value = curObj.dosage.evening;
        this.$.bedUpdate.value = curObj.dosage.bed;

        var startDate = new Date(curObj.startDate);
        var endDate = new Date(curObj.endDate);

        this.$.startDateUpdate.value = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
        this.$.endDateUpdate.value = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        this.$.updatePrescriptionDialog.open();
    }

    addPrescription(e) {
        var medicine = this.$.medList.selectedItem.getAttribute("value");

        var startDate = new Date(this.$.startDate.value);
        var endDate = new Date(this.$.endDate.value);

        var obj = {
            "medication": medicine,
            "dosage": {
                "morning": this.$.morning.value,
                "noon": this.$.noon.value,
                "evening": this.$.evening.value,
                "bed": this.$.bed.value
            },
            "startDate": startDate.toISOString(),
            "endDate": endDate.toISOString()
        };

        this.$.ajaxCreatePrescription.body = obj;
        this.$.ajaxCreatePrescription.generateRequest();
    }

    updatePrescription(e) {
        var startDate = new Date(this.$.startDateUpdate.value);
        var endDate = new Date(this.$.endDateUpdate.value);

        var obj = {
            "id": this.curObj._id,
            "dosage": {
                "morning": this.$.morningUpdate.value,
                "noon": this.$.noonUpdate.value,
                "evening": this.$.eveningUpdate.value,
                "bed": this.$.bedUpdate.value
            },
            "startDate": startDate.toISOString(),
            "endDate": endDate.toISOString()
        };

        this.$.ajaxUpdatePrescription.body = obj;
        this.$.ajaxUpdatePrescription.generateRequest();
    }

    deletePrescription(e) {
        this.deleteId = this.curObj._id;
        this.$.ajaxDeletePrescription.generateRequest();
    }

    receivedMedication(e) {
        this.meds = e.detail.response;
    }

    openDialog(e) {
        this.$.prescriptionDialog.open();
    }
}

window.customElements.define('prescription-element', PrescriptionElement);
