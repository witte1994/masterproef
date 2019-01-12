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
class AllergyElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: 100px auto;
                }

                .circle {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    display: inline-block;
                    text-align: center;
                    line-height: 20px;
                    border-style: solid;
                    border-width: 1px;
                }

                .yellow {
                    background-color: #FFEA00;
                }

                .orange {
                    background-color: #FFA000;
                }

                .red {
                    background-color: #E64A19;
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
                id="ajaxAllergies"
                url="http://localhost:3000/patient/[[pId]]/allergy"
                method="GET"
                handle-as="json"
                last-response="{{allergies}}"
            ></iron-ajax>

            <iron-ajax
                id="ajaxCreateAllergy"
                url="http://localhost:3000/patient/[[pId]]/allergy/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxUpdateAllergy"
                url="http://localhost:3000/patient/[[pId]]/allergy/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="sendUpdateSignal"
            ></iron-ajax>

            <iron-ajax
                id="ajaxDeleteAllergy"
                url="http://localhost:3000/patient/[[pId]]/allergy/delete/[[deleteId]]"
                method="DELETE"
                handle-as="json"
                on-response="sendUpdateSignal"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="addAllergyDialog">
                <h2>Add new allergy</h2>

                <div>
                    <paper-dropdown-menu label="Type" id="allergyList">
                        <paper-listbox slot="dropdown-content" selected="4">
                            <paper-item value="Food">Food</paper-item>
                            <paper-item value="Skin">Skin</paper-item>
                            <paper-item value="Respiratory">Respiratory</paper-item>
                            <paper-item value="Drug">Drug</paper-item>
                            <paper-item value="Other">Other</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
                <div>
                    <paper-dropdown-menu label="Severity" id="severityList">
                        <paper-listbox slot="dropdown-content" selected="0">
                            <paper-item value="0">1</paper-item>
                            <paper-item value="1">2</paper-item>
                            <paper-item value="2">3</paper-item>
                            <paper-item value="3">4</paper-item>
                            <paper-item value="4">5</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
                <div>
                    <paper-input style="padding: 0px;" id="name" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="description" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="date" style="padding: 0px;" label="Date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button dialog-confirm on-tap="addAllergy">Accept</paper-button>
            </paper-dialog>
            
            <paper-dialog id="updateAllergyDialog">
                <h2>Update allergy info</h2>

                <div>
                    <paper-dropdown-menu label="Severity" id="severityListUpdate">
                        <paper-listbox id="severityListboxUpdate" slot="dropdown-content" selected="0">
                            <paper-item value="0">1</paper-item>
                            <paper-item value="1">2</paper-item>
                            <paper-item value="2">3</paper-item>
                            <paper-item value="3">4</paper-item>
                            <paper-item value="4">5</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
                <div>
                    <paper-input style="padding: 0px;" id="nameUpdate" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionUpdate" label="Description"></paper-textarea>
                </div>
                <div style="margin: 0px;">
                    <vaadin-date-picker id="dateUpdate" style="padding: 0px;" label="Date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>
                
                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateAllergy">Update</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteAllergyDialog">
                <h2>Delete allergy</h2>

                <div>Are you sure you want to delete this allergy entry?</div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-dismiss on-tap="deleteAllergy">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{allergies}}">
                <template class="row-details">
                    <div class="detailsGrid">
                        <div><small>Description:</small></div>
                        <div><small>[[item.description]]</small></div>
                    </div>
                </template>

                <vaadin-grid-column width="36px" flex-grow="0">
                    <template class="header"><iron-icon title="Severity" style="width: 20px; height: 20px;" icon="flag"></iron-icon></template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdateAllergyDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeleteAllergyDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>

                            <div class$="circle {{getSeverityColor(item.severity)}}">
                                {{incrementSeverity(item.severity)}}
                            </div>
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="150px">
                    <template class="header">
                        <vaadin-grid-sorter path="name">
                            <vaadin-grid-filter aria-label="Allergy" path="name" value="[[_filterName]]">
                                <vaadin-text-field style="width:145px;" slot="filter" placeholder="Allergy" value="{{_filterName}}" focus-target></vaadin-text-field>
                            </vaadin-grid-filter>
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdateAllergyDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeleteAllergyDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            [[item.name]]
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="100px" flex-grow="0">
                    <template class="header">Type</template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdateAllergyDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeleteAllergyDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            [[item.type]]
                        </vaadin-context-menu>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="109px" flex-grow="0">
                    <template class="header">
                        Date
                    </template>
                    <template>
                        <vaadin-context-menu>
                            <template>
                                <vaadin-list-box>
                                    <vaadin-item on-tap="openUpdateAllergyDialog" data-args$="[[index]]">Edit</vaadin-item>
                                    <hr>
                                    <vaadin-item on-tap="openDeleteAllergyDialog" data-args$="[[index]]">Delete</vaadin-item>
                                </vaadin-list-box>
                            </template>
                            
                            {{getDateString(item.date)}}
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

        this.title = "Allergies";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        this.update();
    }

    update(e) {
        this.$.ajaxAllergies.generateRequest();
    }

    sendUpdateSignal() {
        this.dispatchEvent(new CustomEvent("allergy", {bubbles: true, composed: true}));
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
        this.$.vaadinGrid.selectedItems = [e.detail.value];
    }

    openUpdateAllergyDialog(e) {
        this.curObj = this.allergies[e.target.dataset.args];
        var curObj = this.curObj;

        this.$.severityListboxUpdate.setAttribute("selected", curObj.severity);
        this.$.nameUpdate.value = curObj.name;
        this.$.descriptionUpdate.value = curObj.description;

        var date = new Date(curObj.date);
        this.$.dateUpdate.value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        
        this.$.updateAllergyDialog.open();
    }

    openDeleteAllergyDialog(e) {
        this.curObj = this.allergies[e.target.dataset.args];

        this.$.deleteAllergyDialog.open();
    }

    addAllergy(e) {
        var type = this.$.allergyList.selectedItem.getAttribute("value");
        var severity = this.$.severityList.selectedItem.getAttribute("value");

        var date = new Date(this.$.date.value);

        var obj = {
            "name": this.$.name.value,
            "description": this.$.description.value,
            "severity": severity,
            "type": type,
            "date": date.toISOString()
        };

        this.$.ajaxCreateAllergy.body = obj;
        this.$.ajaxCreateAllergy.generateRequest();
    }

    updateAllergy(e) {
        var date = new Date(this.$.dateUpdate.value);
        var severity = this.$.severityListUpdate.selectedItem.getAttribute("value");

        var obj = {
            "id": this.curObj._id,
            "name": this.$.nameUpdate.value,
            "description": this.$.descriptionUpdate.value,
            "severity": severity,
            "type": this.curObj.type,
            "date": date.toISOString()
        };

        this.$.ajaxUpdateAllergy.body = obj;
        this.$.ajaxUpdateAllergy.generateRequest();
    }

    deleteAllergy(e) {
        this.deleteId = this.curObj._id;
        this.$.ajaxDeleteAllergy.generateRequest();
    }

    incrementSeverity(severity) {
        return severity + 1;
    }

    getSeverityColor(severity) {
        if (severity == 0 || severity == 1) {
            return "yellow";
        } 
        if (severity == 2 || severity == 3) {
            return "orange";
        }
        return "red";
    }

    getMinSizes() {
        return {
            width: "420px",
            height: "180px"
        };
    }

    openDialog(e) {
        this.$.addAllergyDialog.open();
    }
}

window.customElements.define('allergy-element', AllergyElement);
