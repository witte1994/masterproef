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

import '@vaadin/vaadin-context-menu/vaadin-context-menu';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PrescriptionElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto auto auto;
                    grid-template-columns: 38px 100px auto;
                }

                paper-input {
                    margin-top: 0px;
                    height: 50px;
                }

                .icon {
                    height: 22px;
                    width: 22px;
                }

                .green {
                    color: #4CAF50;
                }

                .red {
                    color: #E64A19;
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
                url="http://localhost:3000/patient/[[pId]]/prescription"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxPrescriptionsByDate"
                url="http://localhost:3000/patient/[[pId]]/prescription/[[startInt]]\&[[endInt]]"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreatePrescription"
                url="http://localhost:3000/patient/[[pId]]/prescription/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxUpdatePrescription"
                url="http://localhost:3000/patient/[[pId]]/prescription/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeletePrescription"
                url="http://localhost:3000/patient/[[pId]]/prescription/delete/[[deleteId]]"
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
            </paper-dialog>

            <paper-dialog id="deletePrescriptionDialog">
                <h2>Delete prescription</h2>

                <div>Are you sure you want to delete this prescription?</div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deletePrescription">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{prescriptions}}">
                <template class="row-details">
                    <div class="detailsGrid">
                        <div></div>
                        <div><small>Description:</small></div>
                        <div><small>[[item.medication.description]]</small></div>
                        <div></div>
                        <div><small>Side effects:</small></div>
                        <div><small>[[item.medication.sideEffects]]</small></div>
                        <div></div>
                        <div><small>Interacts with:</small></div>
                        <div><small>{{getInteractionString(item.medication.interactsWith)}}</small></div>
                    </div>
                </template>

                <vaadin-grid-column width="38px" flex-grow="0">
                    <template class="header"><iron-icon title="Interaction" style="width: 20px; height: 20px; color: #757575;" icon="flag"></iron-icon></template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeletePrescriptionDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            <div>
                                <iron-icon class$="icon {{getInteractionColor(item.medication)}}" title="{{getInteractionTitle(item.medication)}}" icon$="{{getInteractionIcon(item.medication)}}"></iron-icon>
                            </div>
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="140px">
                    <template class="header">
                        <vaadin-grid-sorter path="medication.name">
                            <vaadin-grid-filter aria-label="Medication" path="medication.name" value="[[_filterMedicationName]]">
                                <vaadin-text-field style="width:145px;" slot="filter" placeholder="Medicine" value="{{_filterMedicationName}}" focus-target></vaadin-text-field>
                            </vaadin-grid-filter>
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeletePrescriptionDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            [[item.medication.name]]
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="72px" flex-grow="0">
                    <template class="header">Dosage</template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeletePrescriptionDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            [[item.dosage.morning]]/[[item.dosage.noon]]/[[item.dosage.evening]]/[[item.dosage.bed]]
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="156px" flex-grow="0">
                    <template class="header">
                        <vaadin-date-picker theme="small" id="startFilter" on-value-changed="dateSelected" placeholder="Start date" style="width:140px;">
                        </vaadin-date-picker>
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeletePrescriptionDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            {{getDateString(item.startDate)}}
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="156px" flex-grow="0">
                    <template class="header">
                        <vaadin-date-picker theme="small" id="endFilter" on-value-changed="dateSelected" placeholder="End date" style="width:140px;">
                        </vaadin-date-picker>
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdatePrescriptionDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeletePrescriptionDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            {{getDateString(item.endDate)}}
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();
        
        this.setDateFormats(this.$.startDate);
        this.setDateFormats(this.$.endDate);
        this.setDateFormats(this.$.startDateUpdate);
        this.setDateFormats(this.$.endDateUpdate);
        this.startFilter = null;
        this.endFilter = null;

        this.title = "Prescriptions";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        this.$.ajaxMeds.generateRequest();
        this.update();
    }

    update(e) {
        if (this.startFilter == null || this.endFilter == null)
            this.$.ajaxPrescriptions.generateRequest();
        else
            this.checkDates();
    }

    sendUpdateSignal() {
        this.dispatchEvent(new CustomEvent("prescription", {bubbles: true, composed: true}));
    }

    getInteractionColor(medicine) {
        if (this.interactionCheck(medicine.interactsWith).length == 0)
            return "green";
        return "red";
    }

    getInteractionTitle(medicine) {
        var interactions = this.interactionCheck(medicine.interactsWith);
        if (interactions.length == 0)
            return "No interaction present.";

        var str = "Interaction alert: " + this.getInteractionString(interactions);
        return str;
    }

    getInteractionIcon(medicine) {
        if (this.interactionCheck(medicine.interactsWith).length == 0)
            return "check-circle";
        return "report-problem";
    }

    getInteractionString(meds) {
        var str = "";
        for (var i = 0; i < meds.length; i++) {
            str += meds[i];
            if (i < meds.length - 1) 
                str += ", ";
        }

        return str;
    }

    interactionCheck(interactingMeds) {
        var foundInteractions = [];

        for (var i = 0; i < this.prescriptions.length; i++) {
            for (var j = 0; j < interactingMeds.length; j++) {
                if (this.prescriptions[i].medication.name == interactingMeds[j])
                    foundInteractions.push(interactingMeds[j]);
            }
        }

        return foundInteractions.filter(function(item, pos) {
            return foundInteractions.indexOf(item) == pos;
        });
    }

    dateSelected(e) {
        if (this.startFilter == null || this.endFilter == null) {
            this.initDates(e);
        } else {
            this.checkDates();
        }
    }

    initDates(e) {
        if (e.target.id === "startFilter") {
            this.startFilter = e.target;
            this.setDateFormats(e.target);
        } else if (e.target.id === "endFilter") {
            this.endFilter = e.target;
            this.setDateFormats(e.target);
        }
    }

    checkDates() {
        var start = new Date(0);
        if (this.startFilter.value !== "")
            start = new Date(this.startFilter.value);
        
        var end = new Date("2200-01-01T00:00:00");
        if (this.endFilter.value !== "")
            end = new Date(this.endFilter.value);

        if (start < end) {
            this.startFilter.invalid = false;
            this.endFilter.invalid = false;

            this.startInt = start.getTime();
            this.endInt = end.getTime();

            this.$.ajaxPrescriptionsByDate.generateRequest();
        } else {
            this.startFilter.invalid = true;
            this.endFilter.invalid = true;
        }
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
        this.$.vaadinGrid.selectedItems = [e.detail.value];
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

    openDeletePrescriptionDialog(e) {
        this.curObj = this.prescriptions[e.target.dataset.args];

        this.$.deletePrescriptionDialog.open();
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

    getMinSizes() {
        return {
            width: "620px",
            height: "300px"
        };
    }

    openDialog(e) {
        this.$.prescriptionDialog.open();
    }
}

window.customElements.define('prescription-element', PrescriptionElement);
