import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-date-picker/vaadin-date-picker-light';

import '@vaadin/vaadin-context-menu/vaadin-context-menu';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class VaccinationElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto;
                    grid-template-columns: 20px 30px 110px auto;
                }

                .arrowIcon {
                    height: 18px;
                    width: 22px;
                    margin-bottom: 2px;
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
                url="http://localhost:3000/patient/[[pId]]/vaccination"
                method="GET"
                handle-as="json"
                last-response="{{vaccinations}}"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreateVaccination"
                url="http://localhost:3000/patient/[[pId]]/vaccination/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxUpdateVaccination"
                url="http://localhost:3000/patient/[[pId]]/vaccination/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeleteVaccination"
                url="http://localhost:3000/patient/[[pId]]/vaccination/delete/[[deleteId]]"
                method="DELETE"
                handle-as="json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreateVaccinationEntry"
                url="http://localhost:3000/patient/[[pId]]/vaccination/[[vaccinationId]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxUpdateVaccinationEntry"
                url="http://localhost:3000/patient/[[pId]]/vaccination/[[vaccinationId]]/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeleteVaccinationEntry"
                url="http://localhost:3000/patient/[[pId]]/vaccination/[[vaccinationId]]/delete/[[deleteEntryId]]"
                method="DELETE"
                handle-as="json"
                on-response="sendUpdateSignal"
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
            
            <paper-dialog id="updateVaccinationDialog">
                <h2>Update vaccination</h2>

                <div>
                    <paper-input style="padding: 0px;" id="nameUpdate" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionUpdate" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateUpdate" style="padding: 0px;" label="Next vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateVaccination">Update</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteVaccinationDialog">
                <h2>Delete vaccination</h2>

                <div>Are you sure you want to delete this vaccination?</div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
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

            <paper-dialog id="updateVaccinationEntryDialog">
                <h2>Update entry</h2>

                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionEntryUpdate" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateEntryUpdate" style="padding: 0px;" label="Vaccination date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateVaccinationEntry">Update</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteVaccinationEntryDialog">
                <h2>Delete entry</h2>

                <div>Are you sure you want to delete this vaccination entry?</div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteVaccinationEntry">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{vaccinations}}">
                <template class="row-details">
                    <dom-repeat items="{{item.entries}}" as="entry">
                        <template>
                            <vaadin-context-menu>
                                <template>
                                    <vaadin-list-box>
                                        <vaadin-item on-tap="openUpdateVaccinationEntryDialog" data-args$="[[index]]">Edit entry</vaadin-item>
                                        <hr>
                                        <vaadin-item on-tap="openDeleteVaccinationEntryDialog" data-args$="[[index]]">Delete</vaadin-item>
                                    </vaadin-list-box>
                                </template>
                                <div class="detailsGrid">
                                    <div></div>
                                    <div><iron-icon class="arrowIcon" icon="arrow-forward"></iron-icon></div>
                                    <div>{{getDateString(entry.date)}}</div>
                                    <div>[[entry.description]]</div>
                                </div>
                            </vaadin-context-menu>
                        </template>
                    </dom-repeat>

                </template>

                <vaadin-grid-column width="160px">
                    <template class="header">
                        <vaadin-grid-sorter path="name">
                            <vaadin-grid-filter aria-label="Vaccination" path="name" value="[[_filterName]]">
                                <vaadin-text-field style="width:145px;" slot="filter" placeholder="Vaccination" value="{{_filterName}}" focus-target></vaadin-text-field>
                            </vaadin-grid-filter>
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openAddVaccinationEntryDialog" data-args$="[[index]]">Add vaccination entry</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openUpdateVaccinationDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <vaadin-item on-tap="openDeleteVaccinationDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>

                            <div style="padding-left: 4px;">
                                [[item.name]]
                            </div>
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="100px" flex-grow="0">
                    <template class="header">Next date</template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openAddVaccinationEntryDialog" data-args$="[[index]]">Add vaccination entry</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openUpdateVaccinationDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <vaadin-item on-tap="openDeleteVaccinationDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>

                            {{getDateString(item.dateNext)}}
                        </vaadin-context-menu>
                    </template>
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

        this.setDateFormats(this.$.date);
        this.setDateFormats(this.$.dateUpdate);
        this.setDateFormats(this.$.dateEntry);
        this.setDateFormats(this.$.dateEntryUpdate);

        this.title = "Vaccinations"
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        this.update();
    }

    update(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    sendUpdateSignal() {
        this.dispatchEvent(new CustomEvent("vaccination", {bubbles: true, composed: true}));
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
        this.$.vaadinGrid.selectedItems = [e.detail.value];
        this.openedObj = e.detail.value;
    }

    openAddVaccinationEntryDialog(e) {
        this.curObj = this.vaccinations[e.target.dataset.args];
        this.$.addVaccinationEntryDialog.open();
    }

    openUpdateVaccinationDialog(e) {
        this.curObj = this.vaccinations[e.target.dataset.args];
        var curObj = this.curObj;

        this.$.nameUpdate.value = curObj.name;
        this.$.descriptionUpdate.value = curObj.description;

        var date = new Date(curObj.dateNext);
        this.$.dateUpdate.value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        
        this.$.updateVaccinationDialog.open();
    }

    openDeleteVaccinationDialog(e) {
        this.curObj = this.vaccinations[e.target.dataset.args];
        
        this.$.deleteVaccinationDialog.open();
    }

    openUpdateVaccinationEntryDialog(e) {
        this.curObjEntry = this.openedObj.entries[e.target.dataset.args];
        var curEntry = this.curObjEntry;

        this.$.descriptionEntryUpdate.value = curEntry.description;

        var date = new Date(curEntry.date);
        this.$.dateEntryUpdate.value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

        this.$.updateVaccinationEntryDialog.open();
    }

    openDeleteVaccinationEntryDialog(e) {
        this.curObjEntry = this.openedObj.entries[e.target.dataset.args];

        this.$.deleteVaccinationEntryDialog.open();
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

    updateVaccination(e) {
        var date = new Date(this.$.dateUpdate.value);

        var obj = {
            "id": this.curObj._id,
            "name": this.$.nameUpdate.value,
            "description": this.$.descriptionUpdate.value,
            "dateNext": date.toISOString()
        };

        this.$.ajaxUpdateVaccination.body = obj;
        this.$.ajaxUpdateVaccination.generateRequest();
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

    updateVaccinationEntry(e) {
        this.vaccinationId = this.openedObj._id;
        var date = new Date(this.$.dateEntryUpdate.value);

        var obj = {
            "id": this.curObjEntry._id,
            "description": this.$.descriptionEntryUpdate.value,
            "date": date.toISOString()
        };

        this.$.ajaxUpdateVaccinationEntry.body = obj;
        this.$.ajaxUpdateVaccinationEntry.generateRequest();
    }

    deleteVaccinationEntry(e) {
        this.vaccinationId = this.openedObj._id;
        this.deleteEntryId = this.curObjEntry._id;

        this.$.ajaxDeleteVaccinationEntry.generateRequest();
    }

    getMinSizes() {
        return {
            width: "330px",
            height: "300px"
        };
    }

    openDialog(e) {
        this.$.addVaccinationDialog.open();
    }
}

window.customElements.define('vaccination-element', VaccinationElement);
