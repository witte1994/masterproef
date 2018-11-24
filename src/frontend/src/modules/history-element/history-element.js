import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
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

                <vaadin-grid-column width="109px" flex-grow="0">
                    <template class="header">
                        Date
                    </template>
                    <template>[[item.dateStr]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="160px">
                    <template class="header">
                        Module
                    </template>
                    <template>[[item.srcElement]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="160px">
                    <template class="header">
                        Operation
                    </template>
                    <template>[[item.operation]]</template>
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

        this.title = "History";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

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
            width: "500px",
            height: "300px"
        };
    }

    openDialog(e) {
        this.$.filterDialog.open();
    }

    filter(e) {

    }
}

window.customElements.define('history-element', HistoryElement);
