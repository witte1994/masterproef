import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js';

import '@polymer/iron-ajax/iron-ajax';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-checkbox/paper-checkbox';
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
class HistoryElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .detailsGrid {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: 100px auto;
                }

                paper-input {
                    margin-top: 0px;
                    height: 50px;
                }

                .create {
                    color: #4CAF50;
                }

                .update {
                    color: #FFD600;
                }

                .delete {
                    color: #E64A19;
                }

                .import {
                    color: #1E88E5;
                }

                .other {
                    color: #757575;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxHistory"
                url="http://localhost:3000/patient/[[pId]]/history"
                method="GET"
                handle-as="json"
                last-response="{{history}}"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxHistoryByFilter"
                url="http://localhost:3000/patient/[[pId]]/history"
                method="POST"
                handle-as="json"
                content-type="application/json"
                last-response="{{history}}"
            ></iron-ajax>

            <iron-ajax 
                auto
                id="ajaxGetModuleList" 
                url="http://localhost:3000/modules"
                method="GET"
                handle-as="json"
                content-type="application/json"
                last-response="{{modules}}">
            </iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="filterDialog">
                <h2>Filter history</h2>

                <div style="margin: 0px;">
                    <vaadin-date-picker id="startDate" style="padding: 0px;" label="Start date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>

                <div style="margin: 0px;">
                    <vaadin-date-picker id="endDate" style="padding: 0px;" label="End date" style="width: 160px;">
                    </vaadin-date-picker>
                </div>

                <p style="margin-bottom: 4px;">Modules:</p>
                <div style="margin-top: 4px;">
                    <div><paper-checkbox id="allCheckbox" value="all" on-tap="toggleAll" checked>All</paper-checkbox></div>
                    <div id="moduleDiv">
                        <dom-repeat items="[[modules.large]]">
                            <template>
                                <div><paper-checkbox value$="[[item.enum]]" checked disabled>[[item.title]]</paper-checkbox></div>
                            </template>
                        </dom-repeat>
                    </div>
                </div>

                <p style="margin-bottom: 4px;">Operations:</p>
                <div id="operationsDiv" style="margin-top: 4px;">
                    <div><paper-checkbox value="create" checked>Create</paper-checkbox></div>
                    <div><paper-checkbox value="update" checked>Update</paper-checkbox></div>
                    <div><paper-checkbox value="delete" checked>Delete</paper-checkbox></div>
                    <div><paper-checkbox value="import" checked>Import</paper-checkbox></div>
                    <div><paper-checkbox value="other" checked>Other</paper-checkbox></div>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="filter">Filter</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" on-active-item-changed="showDetails" id="vaadinGrid" style="height: 100%;" items="{{history}}">
                <template class="row-details">
                    <div class="detailsGrid">
                        <div><small>Description:</small></div>
                        <div><small>[[item.description]]</small></div>
                    </div>
                </template>

                <vaadin-grid-column width="110px" flex-grow="0">
                    <template class="header">
                        Date
                    </template>
                    <template>{{getDateString(item.date)}}</template>
                </vaadin-grid-column>

                <vaadin-grid-column id="timeCol" hidden width="60px" flex-grow="0">
                    <template class="header">
                        Time
                    </template>
                    <template>{{getTimeString(item.date)}}</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="40px" flex-grow="0">
                    <template>
                        <div>
                            <iron-icon class$="[[item.operation]]" title$="[[item.operation]]" icon$="{{getOperationIcon(item.operation)}}"></iron-icon>
                        </div>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="100px">
                    <template class="header">
                        Module
                    </template>
                    <template>[[item.srcElement]]</template>
                </vaadin-grid-column>

                
            </vaadin-grid>
        `;
    }

    static get dialogButtonTemplate() {
        return html`
            <paper-icon-button title="Filter list" class="buttonsHeader" icon="filter-list" on-tap="openDialog"></paper-icon-button>
        `;
    }


    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.settingsBody = {};
        this.settingsBody.isEmpty = true;

        this.setDateFormats(this.$.startDate);
        this.setDateFormats(this.$.endDate);

        this.title = "Patient Data History";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        var contentDiv = this.$.content;
        var timeCol = this.$.timeCol;
        new ResizeSensor(this.$.content, function() {
            var dim = contentDiv.getBoundingClientRect();
            var width = dim.right - dim.left;

            if (width > 304) {
                timeCol.hidden = false;
            } else {
                timeCol.hidden = true;
            }
        });

        var dim = contentDiv.getBoundingClientRect();
        var width = dim.right - dim.left;
        if (width > 304) {
            timeCol.hidden = false;
        } else {
            timeCol.hidden = true;
        }

        this.update();
    }

    update(e) {
        this.$.ajaxHistory.generateRequest();
    }

    showDetails(e) {
        this.$.vaadinGrid.detailsOpenedItems = [e.detail.value];
        this.$.vaadinGrid.selectedItems = [e.detail.value];
    }

    getMinSizes() {
        return {
            width: "300px",
            height: "300px"
        };
    }

    getOperationIcon(operation) {
        if (operation == "create")
            return "add-circle";
        if (operation == "update")
            return "info";
        if (operation == "delete")
            return "remove-circle";
        if (operation == "import")
            return "offline-pin";

        return "help";
    }

    openDialog(e) {
        this.$.filterDialog.open();
    }

    toggleAll(e) {
        var children = [...this.$.moduleDiv.children];
        children.pop();

        for (var i = 0; i < children.length; i++) {
            children[i] = children[i].firstChild;
        }

        if (this.$.allCheckbox.checked) {
            for (var i = 0; i < children.length; i++) {
                children[i].checked = true;
                children[i].disabled = true;
            }
        } else {
            for (var i = 0; i < children.length; i++) {
                children[i].disabled = false;
            }
        }
    }

    filter(e) {
        var startDate = null;
        if (this.$.startDate.value !== "")
            startDate = (new Date(this.$.startDate.value)).toISOString();

        var endDate = null;
        if (this.$.endDate.value !== "")
            endDate = (new Date(this.$.endDate.value)).toISOString();

        var children = [...this.$.moduleDiv.children];
        children.pop();

        for (var i = 0; i < children.length; i++) {
            children[i] = children[i].firstChild;
        }

        var modules = [];
        if (!this.$.allCheckbox.checked) {
            for (var i = 0; i < children.length; i++) {
                if (children[i].checked)
                    modules.push(children[i].value);
            }
        }

        children = [...this.$.operationsDiv.children];

        for (var i = 0; i < children.length; i++) {
            children[i] = children[i].firstChild;
        }

        var operations = [];
        for (var i = 0; i < children.length; i++) {
            if (children[i].checked)
                operations.push(children[i].value);
        }

        var body = {
            "startDate": startDate,
            "endDate": endDate,
            "modules": modules,
            "operations": operations
        };

        this.settingsBody = body;
        this.settingsBody.isEmpty = false;

        this.$.ajaxHistoryByFilter.body = body;
        this.$.ajaxHistoryByFilter.generateRequest();
    }

    getSettings() {
        return this.settingsBody;
    }

    loadSettings(settings) {
        this.settingsBody = settings;

        if (!settings.isEmpty) {
            this.$.ajaxHistoryByFilter.body = settings;
            this.$.ajaxHistoryByFilter.generateRequest();
        }       
    }
}

window.customElements.define('history-element', HistoryElement);
