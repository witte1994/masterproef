import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
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
class VaccinationElement extends PolymerElement {
    static get template() {
        //500px
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

        <div id="cardId" class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>Vaccinations</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="openAddVaccinationDialog"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div>
                <vaadin-grid on-active-item-changed="showDetails" id="vaadinGrid" style="height: {{height}}px;" items="{{vaccinations}}">

                    <template class="row-details">
                        <div class="detailsGrid">
                            <div><small>Description:</small></div>
                            <div><small>[[item.description]]</small></div>
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
                            <paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="add" data-args$="[[index]]"></paper-icon-button>
                            <paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="create" on-tap="openEditVaccinationDialog" data-args$="[[index]]"></paper-icon-button>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
                
                <div style="text-align: center;">
                    <paper-icon-button class="resizers" icon="expand-less" on-tap="resizeSmaller"></paper-icon-button>
                    <paper-icon-button class="resizers" icon="expand-more" on-tap="resizeLarger"></paper-icon-button>
                </div>

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
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            height: {
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

        var cardId = this.$.cardId;
        new ResizeSensor(this.$.cardId, function () {
            var width = cardId.getBoundingClientRect().width;
        });

        this.setUserId();

        this.$.ajaxVaccinations.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
    }

    openAddVaccinationDialog(e) {
        this.$.addVaccinationDialog.open();
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

    vaccinationCreated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationUpdated(e) {
        this.$.ajaxVaccinations.generateRequest();
    }

    vaccinationDeleted(e) {
        this.$.ajaxVaccinations.generateRequest();
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
}

window.customElements.define('vaccination-element', VaccinationElement);
