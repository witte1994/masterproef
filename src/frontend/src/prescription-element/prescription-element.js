import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
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
class PrescriptionElement extends PolymerElement {
    static get template() {
        // 582px
        return html`
        <style include="shared-styles">
            :host {
                width: 440px;
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

            .detailsGrid {
                display: grid;
                grid-template-rows: auto auto;
                grid-template-columns: 100px auto;
            }

            .resizers {
                width: 20px;
                height: 20px;
                padding: 0px;
                margin: auto;
                display: inline-block;
            }

            paper-input {
                margin-top: 0px;
                height: 50px;
            }

            p {
                margin: 8px 0px 0px 0px;
            }
        </style>

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
            on-response="medCreated"
        ></iron-ajax>

        <iron-ajax
            id="ajaxEditPrescription"
            url="http://localhost:3000/user/[[userId]]/prescription/update"
            method="POST"
            handle-as="json"
            content-type="application/json"
            on-response="medUpdated"
        ></iron-ajax>

        <iron-ajax
            id="ajaxDeletePrescription"
            url="http://localhost:3000/user/[[userId]]/prescription/delete/[[deleteId]]"
            method="DELETE"
            handle-as="json"
            on-response="medDeleted"
        ></iron-ajax>

        <div id="cardId" class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>Medication</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="openPrescriptionDialog"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div>
                <vaadin-grid on-active-item-changed="showDetails" id="vaadinGrid" style="height: {{height}}px;" items="{{prescriptions}}">

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
                            <vaadin-grid-sorter path="medName">
                                <vaadin-grid-filter aria-label="Medication" path="medName" value="[[_filterMedName]]">
                                    <vaadin-text-field style="width:145px;" slot="filter" placeholder="Medicine" value="{{_filterMedName}}" focus-target></vaadin-text-field>
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
                            <vaadin-date-picker-light id="startFilter" on-value-changed="dateSelected" style="justify-self: end;" class="my-input1">
                                <iron-input id="startInput">
                                    <input id="startInputInner" placeholder="Start" size="8">
                                </iron-input>
                            </vaadin-date-picker-light>
                        </template>
                        <template>[[item.startStr]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="109px" flex-grow="0">
                        <template class="header">
                            <vaadin-date-picker-light id="endFilter" on-value-changed="dateSelected" style="justify-self: start;" class="my-input1">
                                <iron-input>
                                    <input placeholder="End" size="8">
                                </iron-input>
                            </vaadin-date-picker-light>
                        </template>
                        <template>[[item.endStr]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="40px" flex-grow="0">
                        <template><paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;"icon="create" on-tap="openEditPrescriptionDialog" data-args$="[[index]]"></paper-icon-button></template>
                    </vaadin-grid-column>
                </vaadin-grid>
                
                <div style="text-align: center;">
                    <paper-icon-button class="resizers" icon="expand-less" on-tap="resizeSmaller"></paper-icon-button>
                    <paper-icon-button class="resizers" icon="expand-more" on-tap="resizeLarger"></paper-icon-button>
                </div>
                
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

                <paper-dialog id="editPrescriptionDialog">
                    <h2>Edit prescription</h2>

                    <div style="margin: 0px;">
                        <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="morningEdit" type="number" label="Morning"></paper-input>
                        <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="noonEdit" type="number" label="Noon"></paper-input>
                    </div >
                    <div style="margin: 0px;">
                        <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="eveningEdit" type="number" label="Evening"></paper-input>
                        <paper-input style="padding: 0px; width: 60px; display: inline-block;" id="bedEdit" type="number" label="Bed"></paper-input>
                    </div>
                    <div style="margin: 0px;">
                        <vaadin-date-picker id="startDateEdit" style="padding: 0px;" label="Start date" style="width: 160px;">
                        </vaadin-date-picker>
                    </div>
                    <div style="margin: 0px;">
                        <vaadin-date-picker id="endDateEdit" style="padding: 0px;" label="End date" style="width: 160px;">
                        </vaadin-date-picker>
                    </div>
                    
                    <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                    <paper-button dialog-confirm on-tap="editPrescription">Edit</paper-button>
                    <paper-button dialog-dismiss on-tap="deletePrescription">Delete</paper-button>
                </paper-dialog>
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            height: {
                type: Number
            },
            meds: {
                type: Array
            },
            selectedStartDate: {
                type: Object
            },
            selectedEndDate: {
                type: Object
            },
            startInt: {
                type: Number
            },
            endInt: {
                type: Number
            },
            curObj: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();
        this.height = 210;

        this.selectedStartDate = null;
        this.selectedEndDate = null;

        var cardId = this.$.cardId;
        new ResizeSensor(this.$.cardId, function () {
            var width = cardId.getBoundingClientRect().width;
        });

        this.setUserId();

        this.$.ajaxMeds.generateRequest();
        this.$.ajaxPrescriptions.generateRequest();
    }

    dateSelected(e) {
        if (e.detail.value !== "") {
            if (e.target.id === "startFilter") {
                this.selectedStartDate = new Date(e.detail.value);
            } else if (e.target.id === "endFilter") {
                this.selectedEndDate = new Date(e.detail.value);
            }
        }
        
        if (this.selectedStartDate !== null && this.selectedEndDate !== null) {
            this.checkDates();
        } 
    }

    checkDates() {
        if (this.selectedStartDate < this.selectedEndDate) {
            this.startInt = this.selectedStartDate.getTime();
            this.endInt = this.selectedEndDate.getTime();
            
            this.$.ajaxPrescriptionsByDate.generateRequest();
        }
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
    }

    openPrescriptionDialog(e) {
        this.$.prescriptionDialog.open();
    }

    openEditPrescriptionDialog(e) {
        this.curObj = this.prescriptions[e.target.dataset.args];
        var curObj = this.curObj;

        this.$.morningEdit.value = curObj.dosage.morning;
        this.$.noonEdit.value = curObj.dosage.noon;
        this.$.eveningEdit.value = curObj.dosage.evening;
        this.$.bedEdit.value = curObj.dosage.bed;

        var startDate = new Date(curObj.startDate);
        var endDate = new Date(curObj.endDate);

        this.$.startDateEdit.value = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
        this.$.endDateEdit.value = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        this.$.editPrescriptionDialog.open();
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

    editPrescription(e) {
        var startDate = new Date(this.$.startDateEdit.value);
        var endDate = new Date(this.$.endDateEdit.value);

        var obj = {
            "id": this.curObj._id,
            "dosage": {
                "morning": this.$.morningEdit.value,
                "noon": this.$.noonEdit.value,
                "evening": this.$.eveningEdit.value,
                "bed": this.$.bedEdit.value
            },
            "startDate": startDate.toISOString(),
            "endDate": endDate.toISOString()
        };

        this.$.ajaxEditPrescription.body = obj;
        this.$.ajaxEditPrescription.generateRequest();
    }

    deletePrescription(e) {
        this.deleteId = this.curObj._id;
        this.$.ajaxDeletePrescription.generateRequest();
    }

    medCreated(e) {
        this.$.ajaxPrescriptions.generateRequest();
    }

    medUpdated(e) {
        this.$.ajaxPrescriptions.generateRequest();
    }

    medDeleted(e) {
        this.$.ajaxPrescriptions.generateRequest();
    }

    resizeSmaller(e) {
        if (this.height > 200)
            this.height -= 50;
    }

    resizeLarger(e) {
        this.height += 50;
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }

    receivedMedication(e) {
        this.meds = e.detail.response;
    }
}

window.customElements.define('prescription-element', PrescriptionElement);
