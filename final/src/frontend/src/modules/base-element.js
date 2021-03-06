import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import moment from 'moment/src/moment'

import '@polymer/paper-icon-button/paper-icon-button'
import '../shared-styles.js'


/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
export class BaseElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            .containerHeader {
                grid-template-columns: auto 28px 28px;
            }
        </style>

        ${this.cssTemplate}
        ${this.ironAjaxTemplate}
        ${this.dialogTemplate}
        
        <div class="mainContainer">
            <div id="cardId" class="card">
                <div class="containerHeader">
                    <h1>[[title]]</h1>

                    <div>
                        ${this.dialogButtonTemplate}
                    </div>
                    <div>
                        <paper-icon-button title="Remove module" class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                    </div>
                </div>

                <div id="content">
                    ${this.contentTemplate}
                </div>
            </div>
        </div>
    `;
    }

    static get cssTemplate() {
        return html`
        `;
    }

    static get ironAjaxTemplate() {
        return html`
        `;
    }

    static get dialogTemplate() {
        return html`
        `;
    }

    static get contentTemplate() {
        return html`
            <p>Fill with content</p>
        `;
    }

    static get dialogButtonTemplate() {
        return html`
            <paper-icon-button title="Add entry" class="buttonsHeader" icon="add" on-tap="openDialog"></paper-icon-button>
        `;
    }

    static get properties() {
        return {
            title: {
                type: String,
                value: "Title"
            }
        };
    }

    ready() {
        super.ready();

        this.formatDate = function(d) {
            return moment(d).format("DD/MM/YYYY");
        };

        this.parseDate = function(str) {
            var date = moment.utc(str, "DD/MM/YYYY").toObject();
            var correctDate = {
                day: date.date,
                month: date.months,
                year: date.years
            };
            return correctDate;
        };

        this.setPatientId();
    }

    setDateFormats(datePicker) {
        datePicker.set("i18n.formatDate", this.formatDate);
        datePicker.set("i18n.parseDate", this.parseDate);
    }

    getDateString(date) {
        if (date == "" || date == undefined || date == null)
            return "-";

        return moment(date).format("DD/MM/YYYY");
    }

    getTimeString(date) {
        return moment(date).format("HH:mm");
    }

    update(e) {
        console.log("update: implement in child class");
    }

    sendUpdateSignal() {
        console.log("sendUpdateSignal: implement in child class");
    }

    setPatientId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.pId = param;
    }

    getMinSizes() {
        console.log("implement in child element");
        return {
            width: "0px",
            height: "0px"
        };
    }

    getSettings() {
        return {};
    }

    loadSettings(settings) {

    }

    openDialog(e) {
        console.log("implement in child element");
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('base-element', BaseElement);
