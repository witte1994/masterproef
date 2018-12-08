import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import moment from 'moment/src/moment';

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-checkbox/paper-checkbox'
import '@vaadin/vaadin-date-picker/vaadin-date-picker';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class TelemonitoringElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <link rel="stylesheet" href="/node_modules/c3/c3.css">
            <style>
                .twoCol {
                    display: grid;
                    grid-template-columns: 150px 150px;
                    margin-bottom: 4px;
                }

                .c3-chart-line {
                    stroke-width: 5;
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
            <iron-ajax
                id="ajaxGetData"
                url="http://localhost:3000/patient/[[pId]]/tm"
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

    static get dialogTemplate() {
        return html`
            <paper-dialog id="selectDataDialog">
                <h2>Select the data to plot</h2>

                <div class="twoCol">
                    <div>Parameters:</div>
                    <div>Plot y-axis?</div>
                </div>
                
                <div>
                    <div class="twoCol" style="{{boolToDisplay(availableParams.bp)}}">
                        <paper-checkbox id="bpCheck" on-tap="paramSelected" value="bp">Blood pressure</paper-checkbox>
                        <paper-checkbox id="bpAxis" style="display:none;" on-tap="axisSelected" value="bp"></paper-checkbox>
                    </div>
                    <div class="twoCol" style="{{boolToDisplay(availableParams.bs)}}">
                        <paper-checkbox id="bsCheck" on-tap="paramSelected" value="bs">Blood sugar</paper-checkbox>
                        <paper-checkbox id="bsAxis" style="display:none;" on-tap="axisSelected" value="bs"></paper-checkbox>
                    </div>
                    <div class="twoCol" style="{{boolToDisplay(availableParams.hr)}}">
                        <paper-checkbox id="hrCheck" on-tap="paramSelected" value="hr">Heart rate</paper-checkbox>
                        <paper-checkbox id="hrAxis" style="display:none;" on-tap="axisSelected" value="hr"></paper-checkbox>
                    </div>
                    <div class="twoCol" style="{{boolToDisplay(availableParams.oxygen)}}">
                        <paper-checkbox id="oxygenCheck" on-tap="paramSelected" value="oxygen">Blood oxygen</paper-checkbox>
                        <paper-checkbox id="oxygenAxis" style="display:none;" on-tap="axisSelected" value="oxygen"></paper-checkbox>
                    </div>
                    <div class="twoCol" style="{{boolToDisplay(availableParams.weight)}}">
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
            <div id="contentContainer" style="margin-left: -8px; margin-right: -8px; margin-bottom: -8px;">
                <div id="dateHeader">
                    <div></div>
                    <div id="dateInner">
                        <vaadin-date-picker theme="small" id="startDate" placeholder="Start date" on-value-changed="loadData">
                        </vaadin-date-picker>
                        <paper-icon-button icon="refresh" on-tap="resizeElement"></paper-icon-button>
                        <vaadin-date-picker theme="small" id="endDate" placeholder="End date" on-value-changed="loadData">
                        </vaadin-date-picker>
                    </div>
                    <div></div>
                </div>
                <div id="chart"></div>
            </div>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.selectedParams = [];
        this.selectedAxis = [];

        this.availableParams = {
            'bp': false,
            'bs': false,
            'hr': false,
            'oxygen': false,
            'weight': false
        }

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
        
        this.setDateFormats(this.$.startDate);
        this.setDateFormats(this.$.endDate);
        
        this.$.startDate.value = moment().subtract(6, 'days').format("YYYY-MM-DD");
        this.$.endDate.value = moment().format("YYYY-MM-DD");

        this.startObj = new Date(this.$.startDate.value)
        this.endObj = new Date(this.$.endDate.value);

        this.getTimeTicks();

        this.title = "Telemonitoring";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));
    }

    boolToDisplay(available) {
        if (!available)
            return "display: none;";
        else
            return "";
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
        }
    }

    loadData() {
        if (this.$.startDate.value == "" || this.$.endDate.value == "")
            return;
        
        if (this.selectedParams.length == 0)
            return;

        this.startObj = new Date(this.$.startDate.value)
        this.endObj = new Date(this.$.endDate.value);

        var body = {
            time: {
                start: this.startObj.toISOString(),
                end: this.endObj.toISOString()
            },
            values: this.selectedParams
        };

        this.dispatchEvent(new CustomEvent("save-layout", { bubbles: true, composed: true }));

        this.$.ajaxGetData.body = body;
        this.$.ajaxGetData.generateRequest();
    }

    dataReceived(e) {
        this.values = e.detail.response.values;

        this.loadChart();
    }

    loadChart() {
        this.chartInit();

        this.loadChartData();
    }

    chartInit() {
        var showY1 = false;
        var showY2 = false;

        var leftPadding = 10;
        var rightPadding = 10;

        var leftLabel = "";
        var rightLabel = "";


        if (this.selectedAxis.length == 1) {
            showY1 = true;
            leftLabel = this.enumToAxisLabel(this.selectedAxis[0]);

            leftPadding = 52;
        }
        if (this.selectedAxis.length == 2) {
            showY1 = true;
            showY2 = true;

            leftLabel = this.enumToAxisLabel(this.selectedAxis[0]);
            rightLabel = this.enumToAxisLabel(this.selectedAxis[1]);

            leftPadding = 52;
            rightPadding = 58;
        }

        this.chart = c3.generate({
            bindto: this.$.chart,
            padding: {
                left: leftPadding,
                right: rightPadding
            },
            legend: {
                show: false
            },
            data: {
                xFormat: '%d/%m/%Y',
                columns: [],
                empty: {
                    label: {
                        text: 'No data available for selected time period'
                    }
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Date (day/month)',
                        position: 'outer-center'
                    },
                    min: this.getDateString(this.startObj),
                    max: this.getDateString(this.endObj),
                    type: 'timeseries',
                    tick: {
                        format: '%d/%m',
                        values: this.getTimeTicks()
                    }
                },
                y: {
                    label: {
                        text: leftLabel,
                        position: 'outer-middle'
                    },
                    show: showY1
                },
                y2: {
                    label: {
                        text: rightLabel,
                        position: 'outer-middle'
                    },
                    show: showY2
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) {
                        switch (id) {
                            case 'Systolic BP':
                                return value + ' mmHg';
                            case 'Diastolic BP':
                                return value + ' mmHg';
                            case 'Blood sugar':
                                return value + ' mmol/L';
                            case 'Heart rate':
                                return value + ' BPM';
                            case 'Oxygen':
                                return value + ' %SpO2';
                            case 'Weight':
                                return value + ' kg';
                            default:
                                return value;
                        }
                    }
                }
            }
        });

        this.resizeElement();
    }

    resizeElement() {
        var parBounds = this.parentNode.getBoundingClientRect();
        var chartWidth = parBounds.width - 16;
        var chartHeight = parBounds.height - 102;
        this.chart.resize({ width: chartWidth, height: chartHeight});
    }

    loadChartData() {
        for (var i = 0; i < this.values.length; i++) {
            this.loadParamData(this.values[i]);
        }

        var axes = {};
        var labels = {};
        for (var i = 0; i < this.selectedAxis.length; i++) {
            if (i == 0) {
                axes[this.enumToFullName(this.selectedAxis[i])] = 'y';
                labels['y'] = this.enumToAxisLabel(this.selectedAxis[i]);
            } else if (i == 1) {
                axes[this.enumToFullName(this.selectedAxis[i])] = 'y2';
                labels['y2'] = this.enumToAxisLabel(this.selectedAxis[i]);
            }
        }
        
        this.chart.data.axes(axes);
        this.chart.axis.labels(labels);
    }

    enumToFullName(enumStr) {
        switch (enumStr) {
            case 'bp':
                return "Blood pressure";
            case 'bs':
                return "Blood sugar";
            case 'hr':
                return "Heart rate";
            case 'oxygen':
                return "Oxygen";
            case 'weight':
                return "Weight";
        }
    }

    enumToAxisLabel(enumStr) {
        switch (enumStr) {
            case 'bp':
                return "Blood pressure (mmHg)";
            case 'bs':
                return "Blood sugar (mmol/L)";
            case 'hr':
                return "Heart rate (BPM)";
            case 'oxygen':
                return "Blood oxygen saturation (%SpO2)";
            case 'weight':
                return "Weight (kg)";
        }
    }

    loadParamData(data) {
        if (data.values.length == 0) {
            return;
        }

        if (data.param == 'Blood pressure') {
            this.loadParamBP(data);
        } else {
            this.loadParamRest(data);
        }        
    }

    loadParamBP(data) {
        var systolicParam = "Systolic BP";
        var diastolicParam = "Diastolic BP";

        var colSys = [systolicParam];
        var colSysDate = [('date'+systolicParam)];

        var colDia = [diastolicParam];
        var colDiaDate = [('date'+diastolicParam)];

        for (var i = 0; i < data.values.length; i++) {
            colSys.push(data.values[i].systolic);
            colDia.push(data.values[i].diastolic);

            var date = this.getDateString(new Date(data.values[i].date))
            colSysDate.push(date);
            colDiaDate.push(date);
        }

        var xs = {};
        xs[systolicParam] = colSysDate[0];
        xs[diastolicParam] = colDiaDate[0];

        this.chart.load({
            xs: xs,
            columns: [
                colSysDate, colDiaDate, colSys, colDia
            ]
        });
    }

    loadParamRest(data) {
        var col = [data.param];
        var colDate = [('date'+data.param)];

        for (var i = 0; i < data.values.length; i++) {
            col.push(data.values[i].value);
            colDate.push(this.getDateString(new Date(data.values[i].date)));
        }

        var xs = {};
        xs[data.param] = colDate[0];

        this.chart.load({
            xs: xs,
            columns: [
                colDate, col
            ]
        });
    }

    paramSelected(e) {
        var checkedCount = 0;

        for (var i = 0; i < this.paramChecks.length; i++) {
            if (this.paramChecks[i].checked) checkedCount++;
        }

        if (checkedCount == 2) {
            for (var i = 0; i < this.paramChecks.length; i++) {
                if (!this.paramChecks[i].checked) this.paramChecks[i].disabled = true
            }
        } else if (checkedCount < 2) {
            for (var i = 0; i < this.paramChecks.length; i++) {
                if (!this.paramChecks[i].checked) this.paramChecks[i].disabled = false
            }
        }

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

    getTimeTicks() {
        var start = moment(this.startObj);
        var end = moment(this.endObj);

        var range = end.diff(start,'days') + 1;

        var interval = 1;
        if (range >= 28)        interval = 7;
        else if (range >= 12)   interval = 3;

        var ticks = [];
        for (var i = 0; i < range;) {
            ticks.push(this.getDateString(start.toDate()));
            start.add(interval, 'days');
            i += interval;
        }

        return ticks;
    }

    getSettings() {
        return {
            "startDate": this.startObj.toISOString(),
            "endDate": this.endObj.toISOString(),
            "params": this.selectedParams,
            "axis": this.selectedAxis
        };
    }

    loadSettings(settings) {        
        this.$.startDate.value = moment(new Date(settings.startDate)).format("YYYY-MM-DD");
        this.$.endDate.value = moment(new Date(settings.endDate)).format("YYYY-MM-DD");

        this.selectedParams = settings.params;
        this.selectedAxis = settings.axis;

        this.loadData();
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
