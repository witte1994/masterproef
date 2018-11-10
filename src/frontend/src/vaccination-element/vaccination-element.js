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
class VaccinationElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style include="shared-styles">
                vaadin-grid-cell-content {
                    padding: 4px 8px 4px 8px;
                }

                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto;
                    grid-template-columns: 10px 100px auto 24px;
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
                id="ajaxVaccinations"
                url="http://localhost:3000/user/[[userId]]/vaccination"
                method="GET"
                handle-as="json"
                last-response="{{vaccinations}}"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreateVaccination"
                url="http://localhost:3000/user/[[userId]]/vaccination/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="vaccinationCreated"
            ></iron-ajax>

            <iron-ajax
                id="ajaxEditVaccination"
                url="http://localhost:3000/user/[[userId]]/vaccination/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="vaccinationUpdated"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeleteVaccination"
                url="http://localhost:3000/user/[[userId]]/vaccination/delete/[[deleteId]]"
                method="DELETE"
                handle-as="json"
                on-response="vaccinationDeleted"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreateVaccinationEntry"
                url="http://localhost:3000/user/[[userId]]/vaccination/[[vaccinationId]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="vaccinationEntryCreated"
            ></iron-ajax>

            <iron-ajax
                id="ajaxEditVaccinationEntry"
                url="http://localhost:3000/user/[[userId]]/vaccination/[[vaccinationId]]/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="vaccinationEntryUpdated"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeleteVaccinationEntry"
                url="http://localhost:3000/user/[[userId]]/vaccination/[[vaccinationId]]/delete/[[deleteEntryId]]"
                method="DELETE"
                handle-as="json"
                on-response="vaccinationEntryDeleted"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="addVaccinationDialog">
                <h2>Add new vaccination</h2>
                <div>
                    <paper-input style="padding: 0px;" id="name" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="description" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="date" style="padding: 0px;" label="Next vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button dialog-confirm on-tap="addVaccination">Accept</paper-button>
            </paper-dialog>
            
            <paper-dialog id="editVaccinationDialog">
                <h2>Edit vaccination</h2>

                <div>
                    <paper-input style="padding: 0px;" id="nameEdit" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionEdit" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateEdit" style="padding: 0px;" label="Next vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="editVaccination">Edit</paper-button>
                <paper-button dialog-dismiss on-tap="deleteVaccination">Delete</paper-button>
            </paper-dialog>

            <paper-dialog id="addVaccinationEntryDialog">
                <h2>Add new vaccination entry</h2>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionEntry" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateEntry" style="padding: 0px;" label="Vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button dialog-confirm on-tap="addVaccinationEntry">Accept</paper-button>
            </paper-dialog>

            <paper-dialog id="editVaccinationEntryDialog">
                <h2>Edit entry</h2>

                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionEntryEdit" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateEntryEdit" style="padding: 0px;" label="Vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="editVaccinationEntry">Edit</paper-button>
                <paper-button dialog-dismiss on-tap="deleteVaccinationEntry">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{vaccinations}}">
                <template class="row-details">
                    <div class="detailsGrid">
                        <dom-repeat items="{{item.entries}}" as="entry">
                            <template>
                                <div></div>
                                <div>[[entry.dateStr]]</div>
                                <div>[[entry.description]]</div>
                                <div><paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="create" on-tap="openEditVaccinationEntryDialog" data-args$="[[index]]"></paper-icon-button></div>
                            </template>
                        </dom-repeat>
                    </div>
                </template>

                <vaadin-grid-column width="160px">
                    <template class="header">
                        <vaadin-grid-sorter path="vaccinationName">
                            <vaadin-grid-filter aria-label="Vaccination" path="vaccinationName" value="[[_filterVaccinationName]]">
                                <vaadin-text-field style="width:145px;" slot="filter" placeholder="Vaccination" value="{{_filterVaccinationName}}" focus-target></vaadin-text-field>
                            </vaadin-grid-filter>
                        </vaadin-grid-sorter>
                    </template>
                    <template>[[item.name]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="100px" flex-grow="0">
                    <template class="header">Next date</template>
                    <template>[[item.dateNextStr]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="70px" flex-grow="0">
                    <template>
                        <paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="add" on-tap="openAddVaccinationEntryDialog" data-args$="[[index]]"></paper-icon-button>
                        <paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="create" on-tap="openEditVaccinationDialog" data-args$="[[index]]"></paper-icon-button>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
        `;
    }

    static get properties() {
        return {
            title: {
                type: String,
                value: "Vaccinations"
            }
        };
    }

    ready() {
        super.ready();

        this.$.ajaxVaccinations.generateRequest();
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
        this.openedObj = e.detail.value;
    }

    openAddVaccinationEntryDialog(e) {
        this.curObj = this.vaccinations[e.target.dataset.args];
        this.$.addVaccinationEntryDialog.open();
    }

    openEditVaccinationDialog(e) {
        this.curObj = this.vaccinations[e.target.dataset.args];
        var curObj = this.curObj;

        this.$.nameEdit.value = curObj.name;
        this.$.descriptionEdit.value = curObj.description;

        var date = new Date(curObj.dateNext);
        this.$.dateEdit.value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        
        this.$.editVaccinationDialog.open();
    }

    openEditVaccinationEntryDialog(e) {
        this.curObjEntry = this.openedObj.entries[e.target.dataset.args];
        var curEntry = this.curObjEntry;

        this.$.descriptionEntryEdit.value = curEntry.description;

        var date = new Date(curEntry.date);
        this.$.dateEntryEdit.value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

        this.$.editVaccinationEntryDialog.open();
    }

    addVaccination(e) {
        var date = new Date(this.$.date.value);

        var obj = {
            "name": this.$.name.value,
            "description": this.$.description.value,
            "dateNext": date.toISOString()
        };

        this.$.ajaxCreateVaccination.body = obj;
        this.$.ajaxCreateVaccination.generateRequest();
    }

    editVaccination(e) {
        var date = new Date(this.$.dateEdit.value);

        var obj = {
            "id": this.curObj._id,
            "name": this.$.nameEdit.value,
            "description": this.$.descriptionEdit.value,
            "dateNext": date.toISOString()
        };

        this.$.ajaxEditVaccination.body = obj;
        this.$.ajaxEditVaccination.generateRequest();
    }

    deleteVaccination(e) {
        this.deleteId = this.curObj._id;
        this.$.ajaxDeleteVaccination.generateRequest();
    }

    addVaccinationEntry(e) {
        this.vaccinationId = this.curObj._id;
        var date = new Date(this.$.dateEntry.value);

        var obj = {
            "description": this.$.descriptionEntry.value,
            "date": date.toISOString()
        };

        this.$.ajaxCreateVaccinationEntry.body = obj;
        this.$.ajaxCreateVaccinationEntry.generateRequest();
    }

    editVaccinationEntry(e) {
        this.vaccinationId = this.openedObj._id;
        var date = new Date(this.$.dateEntryEdit.value);

        var obj = {
            "id": this.curObjEntry._id,
            "description": this.$.descriptionEntryEdit.value,
            "date": date.toISOString()
        };

        this.$.ajaxEditVaccinationEntry.body = obj;
        this.$.ajaxEditVaccinationEntry.generateRequest();
    }

    deleteVaccinationEntry(e) {
        this.vaccinationId = this.openedObj._id;
        this.deleteEntryId = this.curObjEntry._id;

        this.$.ajaxDeleteVaccinationEntry.generateRequest();
    }

    vaccinationCreated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationUpdated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationDeleted(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationEntryCreated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationEntryUpdated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationEntryDeleted(e) {
        this.$.ajaxVaccinations.generateRequest();
    }


    openDialog(e) {
        this.$.addVaccinationDialog.open();
    }
}

window.customElements.define('vaccination-element', VaccinationElement);
