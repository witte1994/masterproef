import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-checkbox/paper-checkbox'
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-date-picker/src/vaadin-date-picker-mixin';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class TelemonitoringElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                .twoCol {
                    display: grid;
                    grid-template-columns: 150px 150px;
                    margin-bottom: 4px;
                }

                #dateHeader {
                    display: grid;
                    grid-template-columns: auto 320px auto;
                }

                #dateInner {
                    display: grid;
                    grid-template-columns: 140px 40px 140px;
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
            
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="selectDataDialog">
                <h2>Select the data to plot</h2>

                <div class="twoCol">
                    <div>Parameters:</div>
                    <div>Plot y-axis? (max 2.)</div>
                </div>
                
                <div>
                    <div class="twoCol">
                        <paper-checkbox id="bpCheck" on-tap="paramSelected" value="bp">Blood pressure</paper-checkbox>
                        <paper-checkbox id="bpAxis" style="display:none;" on-tap="axisSelected" value="bp"></paper-checkbox>
                    </div>
                    <div class="twoCol">
                        <paper-checkbox id="bsCheck" on-tap="paramSelected" value="bs">Blood sugar</paper-checkbox>
                        <paper-checkbox id="bsAxis" style="display:none;" on-tap="axisSelected" value="bs"></paper-checkbox>
                    </div>
                    <div class="twoCol">
                        <paper-checkbox id="hrCheck" on-tap="paramSelected" value="hr">Heart rate</paper-checkbox>
                        <paper-checkbox id="hrAxis" style="display:none;" on-tap="axisSelected" value="hr"></paper-checkbox>
                    </div>
                    <div class="twoCol">
                        <paper-checkbox id="oxygenCheck" on-tap="paramSelected" value="oxygen">Blood oxygen</paper-checkbox>
                        <paper-checkbox id="oxygenAxis" style="display:none;" on-tap="axisSelected" value="oxygen"></paper-checkbox>
                    </div>
                    <div class="twoCol">
                        <paper-checkbox id="weightCheck" on-tap="paramSelected" value="weight">Weight</paper-checkbox>
                        <paper-checkbox id="weightAxis" style="display:none;" on-tap="axisSelected" value="weight"></paper-checkbox>
                    </div>
                </div>

                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button id="selectDataButton" dialog-confirm on-tap="selectData">Accept</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <div id="contentContainer">
                <div id="dateHeader">
                    <div></div>
                    <div id="dateInner">
                        <vaadin-date-picker theme="small" id="startDate" placeholder="Start date">
                        </vaadin-date-picker>
                        <paper-icon-button icon="refresh"></paper-icon-button>
                        <vaadin-date-picker theme="small" id="endDate" placeholder="End date">
                        </vaadin-date-picker>
                    </div>
                    <div></div>
                </div>
            </div>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.paramChecks = [
            this.$.bpCheck,
            this.$.bsCheck,
            this.$.hrCheck,
            this.$.oxygenCheck,
            this.$.weightCheck
        ];

        this.paramAxis = [
            this.$.bpAxis,
            this.$.bsAxis,
            this.$.hrAxis,
            this.$.oxygenAxis,
            this.$.weightAxis
        ];
        
        this.$.startDate.set("i18n.formatDate", this.formatDate);
        this.$.startDate.set("i18n.parseDate", this.parseDate);
        this.$.endDate.set("i18n.formatDate", this.formatDate);
        this.$.endDate.set("i18n.parseDate", this.parseDate);

        this.title = "Telemonitoring";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));
    }

    selectData() {
        this.selectedParams = [];
        this.selectedAxis = [];

        for (var i = 0; i < this.paramChecks.length; i++) {
            if (this.paramChecks[i].checked) this.selectedParams.push(this.paramChecks[i].value);
        }
        for (var i = 0; i < this.paramAxis.length; i++) {
            if (this.paramAxis[i].checked) this.selectedAxis.push(this.paramAxis[i].value);
        }

        if (this.selectedParams.length != 0) {
            this.loadData();
        } else {
            console.log("no params selected");
        }
    }

    loadData() {

    }

    paramSelected(e) {
        var id = e.srcElement.id;
        var checked = e.srcElement.checked;
        var axisElement;

        switch (id) {
            case "bpCheck":
                axisElement = this.$.bpAxis;
                break;
            case "bsCheck":
                axisElement = this.$.bsAxis;
                break;
            case "hrCheck":
                axisElement = this.$.hrAxis;
                break;
            case "oxygenCheck":
                axisElement = this.$.oxygenAxis;
                break;
            case "weightCheck":
                axisElement = this.$.weightAxis;
                break;
        }

        if (checked) {
            axisElement.style.display = "block";
        } else {
            axisElement.style.display = "none";
            axisElement.checked = false;
            this.axisSelected(null);
        }
    }

    axisSelected(e) {
        var checkedCount = 0;

        for (var i = 0; i < this.paramAxis.length; i++) {
            if (this.paramAxis[i].checked) checkedCount++;
        }

        if (checkedCount == 2) {
            for (var i = 0; i < this.paramAxis.length; i++) {
                if (!this.paramAxis[i].checked) this.paramAxis[i].disabled = true
            }
        } else if (checkedCount < 2) {
            for (var i = 0; i < this.paramAxis.length; i++) {
                if (!this.paramAxis[i].checked) this.paramAxis[i].disabled = false
            }
        }
    }

    getMinSizes() {
        return {
            width: "500px",
            height: "300px"
        };
    }

    openDialog(e) {
        this.$.selectDataDialog.open();
    }
}

window.customElements.define('telemonitoring-element', TelemonitoringElement);
