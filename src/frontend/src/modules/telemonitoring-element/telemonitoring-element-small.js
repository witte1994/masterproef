import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BaseElementSmall } from '../base-element-small.js'

import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-checkbox/paper-checkbox'
import '@polymer/paper-input/paper-input'

import moment from 'moment/src/moment'

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

                .horizontal {
                    display: grid;
                    grid-template-columns: 80px auto;
                    margin-bottom: 4px;
                }

                paper-input {
                    height: 38px;
                }

                paper-button { 
                    background: #e0e0e0;
                }

                #paramContent {
                    margin-left: -8px;
                    margin-right: -8px;
                    margin-bottom: -8px;
                    overflow: auto;
                }

                #paramSelection {
                    overflow: auto;
                }

                .paramBlock {
                    border-top: 1px solid #e0e0e0;
                    padding: 8px 12px 4px 12px;
                }

                .title {
                    font-size: 16px;
                    color: black;
                    margin-bottom: 6px;
                }

                .contentGrid {
                    display: grid;
                    grid-template-rows: auto auto;
                }

                .contentRow {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 4px;
                }
                
                #dateDiv {
                    text-align: center;
                    margin-top: 4px;
                    margin-bottom: 8px;
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
                last-response="{{data}}"
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
                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="dateDiv">{{getDateString(start)}} - {{getDateString(end)}}</div>
                </vaadin-context-menu>
                

                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="hideParam" data-args="bp">Hide parameter</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="bpBlock" class="paramBlock">
                        <div class="title">Blood pressure (mmHg)</div>
                        <div class="contentGrid">
                            <div class="contentRow" style="font-weight: bold;">
                                <div># vals</div>
                                <div>avg.</div>
                                <div>low</div>
                                <div>high</div>
                            </div>

                            <div class="contentRow">
                                <div>{{data.bp.values}}</div>
                                <div>{{data.bp.avg}}</div>
                                <div>{{data.bp.low}}</div>
                                <div>{{data.bp.high}}</div>
                            </div>
                        </div>
                    </div>
                </vaadin-context-menu>
                
                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="hideParam" data-args="bs">Hide parameter</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="bsBlock" class="paramBlock">
                        <div class="title">Blood sugar (mmol/L)</div>
                        <div class="contentGrid">
                            <div class="contentRow" style="font-weight: bold;">
                                <div># vals</div>
                                <div>avg.</div>
                                <div>low</div>
                                <div>high</div>
                            </div>

                            <div class="contentRow">
                                <div>{{data.bs.values}}</div>
                                <div>{{data.bs.avg}}</div>
                                <div>{{data.bs.low}}</div>
                                <div>{{data.bs.high}}</div>
                            </div>
                        </div>
                    </div>
                </vaadin-context-menu>

                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="hideParam" data-args="hr">Hide parameter</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="hrBlock" class="paramBlock">
                        <div class="title">Heart rate (BPM)</div>
                        <div class="contentGrid">
                            <div class="contentRow" style="font-weight: bold;">
                                <div># vals</div>
                                <div>avg.</div>
                                <div>low</div>
                                <div>high</div>
                            </div>

                            <div class="contentRow">
                                <div>{{data.hr.values}}</div>
                                <div>{{data.hr.avg}}</div>
                                <div>{{data.hr.low}}</div>
                                <div>{{data.hr.high}}</div>
                            </div>
                        </div>
                    </div>
                </vaadin-context-menu>

                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="hideParam" data-args="oxygen">Hide parameter</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="oxygenBlock" class="paramBlock">
                        <div class="title">Oxygen (%SpO2)</div>
                        <div class="contentGrid">
                            <div class="contentRow" style="font-weight: bold;">
                                <div># vals</div>
                                <div>avg.</div>
                                <div>low</div>
                                <div>high</div>
                            </div>

                            <div class="contentRow">
                                <div>{{data.oxygen.values}}</div>
                                <div>{{data.oxygen.avg}}</div>
                                <div>{{data.oxygen.low}}</div>
                                <div>{{data.oxygen.high}}</div>
                            </div>
                        </div>
                    </div>
                </vaadin-context-menu>
                
                <vaadin-context-menu>
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="hideParam" data-args="weight">Hide parameter</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="resetConfiguration">Reset</vaadin-item>
                        </vaadin-list-box>
                    </template>
                    
                    <div id="weightBlock" class="paramBlock">
                        <div class="title">Weight (kg)</div>
                        <div class="contentGrid">
                            <div class="contentRow" style="font-weight: bold;">
                                <div># vals</div>
                                <div>start.</div>
                                <div>current</div>
                                <div>diff.</div>
                            </div>

                            <div class="contentRow">
                                <div>{{data.weight.values}}</div>
                                <div>{{data.weight.start}}</div>
                                <div>{{data.weight.current}}</div>
                                <div>{{data.weight.diff}}</div>
                            </div>
                        </div>
                    </div>
                </vaadin-context-menu>
                
            </div>

            <div id="paramSelection" style$="display: {{showSelection}}; margin-left: 4px;">
                <div style="margin-top: 4px; margin-bottom: 8px;">Select parameters: </div>

                <div style="margin-left: 30px;">
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

                <div class="horizontal">
                    <p style="margin-top: 10px; margin-bottom: 6px;">Days ago:</p>
                    <paper-input style="width: 40px; display: inline-block;" id="period" type="number" no-label-float></paper-input>
                </div>

                <div style="text-align: center;">
                    <paper-button on-tap="selectParams">Select</paper-button>
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

        this.data = {};
        this.settings = {};

        this.showContent = "none";
        this.showSelection = "block";

        this.title = "Telemonitoring";
        this.dispatchEvent(new CustomEvent("sizeSmall", { bubbles: true, composed: true, detail: this.getMinHeight() }));
    }

    selectParams(e) {
        if (!this.periodCheck()) {
            return;
        }

        var start = moment("2018-12-16T00:00:00.000Z").startOf('day').subtract(this.$.period.value, 'days').format();
        var end = moment("2018-12-16T00:00:00.000Z").endOf('day').format();

        this.start = new Date(start);
        this.end = new Date(end);

        var obj = {
            time: {
                start: start,
                end: end
            },
            params: []
        }

        if (this.$.bpCheck.checked) {
            obj.params.push("bp");
        }
        if (this.$.bsCheck.checked) {
            obj.params.push("bs");
        }
        if (this.$.hrCheck.checked) {
            obj.params.push("hr");
        }
        if (this.$.oxygenCheck.checked) {
            obj.params.push("oxygen");
        }
        if (this.$.weightCheck.checked) {
            obj.params.push("weight");
        }

        if (obj.params.length == 0) {
            return;
        }

        this.showParamBlocks(obj.params);

        this.settings = obj;

        this.$.ajaxGetData.body = obj;
        this.$.ajaxGetData.generateRequest();
    }

    showParamBlocks(params) {
        this.$.bpBlock.style.display = "none";
        this.$.bsBlock.style.display = "none";
        this.$.hrBlock.style.display = "none";
        this.$.oxygenBlock.style.display = "none";
        this.$.weightBlock.style.display = "none";

        for (var i = 0; i < params.length; i++) {
            if (params[i] == "bp") {
                this.$.bpBlock.style.display = "block";
            }
            if (params[i] == "bs") {
                this.$.bsBlock.style.display = "block";
            }
            if (params[i] == "hr") {
                this.$.hrBlock.style.display = "block";
            }
            if (params[i] == "oxygen") {
                this.$.oxygenBlock.style.display = "block";
            }
            if (params[i] == "weight") {
                this.$.weightBlock.style.display = "block";
            }
        }        
    }

    hideParam(e) {
        var param = e.target.dataset.args

        if (param == "bp") this.$.bpBlock.style.display = "none";
        if (param == "bs") this.$.bsBlock.style.display = "none";
        if (param == "hr") this.$.hrBlock.style.display = "none";
        if (param == "oxygen") this.$.oxygenBlock.style.display = "none";
        if (param == "weight") this.$.weightBlock.style.display = "none";

        var index = this.settings.params.indexOf(param);
        if (index !== -1) this.settings.params.splice(index, 1);

        this.dispatchEvent(new CustomEvent("save-layout", { bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent("shift-small", { bubbles: true, composed: true }));
    }

    resetConfiguration(e) {
        this.showContent = "none";
        this.showSelection = "block";

        this.data = {};

        this.$.bpBlock.style.display = "none";
        this.$.bsBlock.style.display = "none";
        this.$.hrBlock.style.display = "none";
        this.$.oxygenBlock.style.display = "none";
        this.$.weightBlock.style.display = "none";

        this.settings = {};

        this.dispatchEvent(new CustomEvent("shift-small", { bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent("save-layout", { bubbles: true, composed: true }));
    }

    periodCheck() {
        if (this.$.period.value == "")
            return false;
        if (this.$.period.value <= 0)
            return false;

        return true;
    }

    dataReceived(e) {
        this.showContent = "block";
        this.showSelection = "none";

        this.dispatchEvent(new CustomEvent("shift-small", { bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent("save-layout", { bubbles: true, composed: true }));
    }

    getSettings() {
        var settings = {
            time: this.settings.time,
            params: this.settings.params,
            data: this.data
        };

        return settings;
    }

    loadSettings(settings) {
        if (this.settingsUndefined(settings)) {
            return;
        }

        this.settings = settings;

        this.showSelection = "none";
        this.start = new Date(settings.time.start);
        this.end = new Date(settings.time.end);

        this.showParamBlocks(settings.params);

        this.showContent = "block";
        
        this.data = settings.data;

        this.dispatchEvent(new CustomEvent("shift-small", { bubbles: true, composed: true }));
    }

    settingsUndefined(settings) {
        if (settings == undefined || settings.isEmpty) {
            return true;
        }
        if (settings.data == undefined || settings.data.isEmpty)
            return true;
        if (settings.params == undefined)
            return true;
        if (settings.time == undefined)
            return true;

        return false;
    }

    getMinHeight() {
        return "100px";
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
