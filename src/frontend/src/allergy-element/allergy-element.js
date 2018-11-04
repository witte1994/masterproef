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
class AllergyElement extends PolymerElement {
    static get template() {
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
            id="ajaxAllergies"
            url="http://localhost:3000/user/[[userId]]/allergy"
            method="GET"
            handle-as="json"
            last-response="{{allergies}}"
        ></iron-ajax>

        <iron-ajax
            id="ajaxCreateAllergy"
            url="http://localhost:3000/user/[[userId]]/allergy/create"
            method="POST"
            handle-as="json"
            content-type="application/json"
            on-response="allergyCreated"
        ></iron-ajax>

        <div id="cardId" class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>Allergies</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="openAddAllergyDialog"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div>
                <vaadin-grid on-active-item-changed="showDetails" id="vaadinGrid" style="height: {{height}}px;" items="{{allergies}}">

                    <template class="row-details">
                        <div class="detailsGrid">
                            <div><small>Description:</small></div>
                            <div><small>[[item.description]]</small></div>
                        </div>
                    </template>

                    <vaadin-grid-column width="36px" flex-grow="0">
                        <template class="header"><iron-icon style="width: 20px; height: 20px;" icon="flag"></iron-icon></template>
                        <template>[[item.severity]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="160px">
                        <template class="header">
                            <vaadin-grid-sorter path="allergyName">
                                <vaadin-grid-filter aria-label="Allergy" path="allergyName" value="[[_filterAllergyName]]">
                                    <vaadin-text-field style="width:145px;" slot="filter" placeholder="Allergy" value="{{_filterAllergyName}}" focus-target></vaadin-text-field>
                                </vaadin-grid-filter>
                            </vaadin-grid-sorter>
                        </template>
                        <template>[[item.name]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="100px" flex-grow="0">
                        <template class="header">Type</template>
                        <template>[[item.type]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="109px" flex-grow="0">
                        <template class="header">
                            Date
                        </template>
                        <template>[[item.dateStr]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="40px" flex-grow="0">
                        <template><paper-icon-button style="margin: 0px; padding:0px; width: 22px; height: 22px;" icon="create" data-args$="[[index]]"></paper-icon-button></template>
                    </vaadin-grid-column>
                </vaadin-grid>
                
                <div style="text-align: center;">
                    <paper-icon-button class="resizers" icon="expand-less" on-tap="resizeSmaller"></paper-icon-button>
                    <paper-icon-button class="resizers" icon="expand-more" on-tap="resizeLarger"></paper-icon-button>
                </div>

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
                                <paper-item value="0">0</paper-item>
                                <paper-item value="1">1</paper-item>
                                <paper-item value="2">2</paper-item>
                                <paper-item value="3">3</paper-item>
                                <paper-item value="4">4</paper-item>
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
                
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            height: {
                type: Number
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

        this.$.ajaxAllergies.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
    }

    openAddAllergyDialog(e) {
        this.$.addAllergyDialog.open();
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

    allergyCreated(e) {
        this.$.ajaxAllergies.generateRequest();
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

window.customElements.define('allergy-element', AllergyElement);
