import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BaseElementSmall } from '../base-element-small.js'

import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-checkbox/paper-checkbox'

import '@vaadin/vaadin-context-menu/vaadin-context-menu';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class TelemonitoringElementSmall extends BaseElementSmall {
    static get cssTemplate() {
        return html`
            <style>
                paper-checkbox {
                    margin-bottom: 4px;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax
                id="ajaxGetData"
                url="http://localhost:3000/patient/[[pId]]/tm/small"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="dataReceived"
            ></iron-ajax>

            <iron-ajax
                auto
                id="ajaxGetAvailableParams"
                url="http://localhost:3000/patient/[[pId]]/tm/available"
                method="GET"
                handle-as="json"
                last-response="{{availableParams}}"
            ></iron-ajax>
        `;
    }

    static get contentTemplate() {
        return html`
            <div id="paramContent" style$="display: {{showContent}};">
                <p>test</p>
            </div>

            <div id="paramSelection" style$="display: {{showSelection}}; margin-left: 4px;">
                <div style="margin-bottom: 4px;">Select parameters: </div>

                <div>
                    <div style$="{{boolToDisplay(availableParams.bp)}}">
                        <paper-checkbox id="bpCheck" value="bp">Blood pressure</paper-checkbox>
                    </div>
                    <div style$="{{boolToDisplay(availableParams.bs)}}">
                        <paper-checkbox id="bsCheck" value="bs">Blood sugar</paper-checkbox>
                    </div>
                    <div style$="{{boolToDisplay(availableParams.hr)}}">
                        <paper-checkbox id="hrCheck" value="hr">Heart rate</paper-checkbox>
                    </div>
                    <div style$="{{boolToDisplay(availableParams.oxygen)}}">
                        <paper-checkbox id="oxygenCheck" value="oxygen">Blood oxygen</paper-checkbox>
                    </div>
                    <div style$="{{boolToDisplay(availableParams.weight)}}">
                        <paper-checkbox id="weightCheck" value="weight">Weight</paper-checkbox>
                    </div>
                </div>

                <paper-button on-tap="selectParams">Select</paper-button>
            </div>
            
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.showContent = "none";
        this.showSelection = "block";

        this.title = "Telemonitoring";
        this.dispatchEvent(new CustomEvent("sizeSmall", { bubbles: true, composed: true, detail: this.getMinHeight() }));

        this.update();
    }

    selectParams(e) {
        var params = [];

        if (this.$.bpCheck.checked) {
            params.push({
                param: "bp",
                time: "7"
            });
        }
        if (this.$.bsCheck.checked) {
            params.push({
                param: "bs",
                time: "7"
            });
        }
        if (this.$.hrCheck.checked) {
            params.push({
                param: "hr",
                time: "7"
            });
        }
        if (this.$.oxygenCheck.checked) {
            params.push({
                param: "oxygen",
                time: "7"
            });
        }
        if (this.$.weightCheck.checked) {
            params.push({
                param: "weight",
                time: "7"
            });
        }

        console.log(params);
        if (params.length != 0) {
            
        }

        //this.showContent = "block";
        //this.showSelection = "none";
    }

    dataReceived(e) {
        console.log(e);
    }

    getMinHeight() {
        return "140px";
    }

    boolToDisplay(available) {
        if (!available)
            return "display: none;";
        else
            return "";
    }

    update(e) {
        
    }
}

window.customElements.define('telemonitoring-element-small', TelemonitoringElementSmall);
