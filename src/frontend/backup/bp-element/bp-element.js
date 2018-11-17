import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-menu-button/paper-menu-button'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class BpElement extends PolymerElement {
    static get template() {
        return html`
        <link rel="stylesheet" href="/node_modules/c3/c3.css">
        <style include="shared-styles">
            :host {
                width: 700px;
            }

            .row {
                width: 100%;
                text-align: center;
                margin-bottom: 5px;
            }

            .c3-region.red {
                fill: red;
            }

            .c3-region.yellow {
                fill: yellow;
            }

            .c3-region.green {
                fill: green;
            }
            
            .cell {
                font-size: 16px;
                padding: 5px;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax
            id="ajaxBp"
            url="http://localhost:3000/user/[[userId]]/bp/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
        ></iron-ajax>

        <iron-ajax
            id="ajaxBpSmall"
            url="http://localhost:3000/user/[[userId]]/bp/small/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceivedSmall"
        ></iron-ajax>

        <iron-ajax
            id="ajaxThreshold"
            url="http://localhost:3000/user/[[userId]]/bp/threshold"
            body="[[body]]"
            method="PATCH"
            handle-as="json"
            content-type="application/json"
            on-response="dataUpdated"
        ></iron-ajax>

        <div class="card">
            <div style="width:100%; display:inline-block; vertical-align:top;">
                <div style="width:30%; display:inline-block;">
                    <h1>Blood pressure</h1>
                </div><div style="width:50%; display:inline-block;">
                    <paper-button id="day" toggles on-tap="dateClick">3 days</paper-button>
                    <paper-button id="week" toggles on-tap="dateClick">week</paper-button>
                    <paper-button id="month" toggles on-tap="dateClick">month</paper-button>
                </div><div style="width:20%; display:inline-block;">
                    <paper-icon-button icon="fullscreen-exit" on-tap="resize"></paper-icon-button>
                    <paper-icon-button icon="settings" on-tap="setThresholds"></paper-icon-button>
                    <paper-icon-button icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
                <div style="width:20%; display:inline-block; text-align: center;">
                    <paper-icon-button id="back" icon="arrow-back" on-tap="changeDate"></paper-icon-button>
                </div><div style="width:60%; display:inline-block; text-align: center;">
                    <p>[[startDateStr]] - [[endDateStr]]</p>
                </div><div style="width:20%; display:inline-block; text-align: center;">
                    <paper-icon-button id="forward" icon="arrow-forward" on-tap="changeDate"></paper-icon-button>
                </div>
                <div style="width: 100%;"><div id="chart" style="width: 650px;"></div>
                </div>
                <div style="width: 38%; display:inline-block; text-align: center;">
                    <table>
                        <tr>
                            <td><img src="img/red_error.png" style="margin-right: 10px; margin-left: 10px;"></td>
                            <td><p>[[dangerVals]]</p></td>
                            <td><img src="img/yellow_warning.png" style="margin-right: 10px; margin-left: 10px;"></td>
                            <td><p>[[warningVals]]</p></td>
                            <td><img src="img/green_ok.png" style="margin-right: 10px; margin-left: 10px;"></td>
                            <td><p>[[okVals]]</p></td>
                        </tr>
                    </table>
                </div><div style="width: 62%; display:inline-block; text-align: center;">
                    <table style="table-layout: fixed; padding-bottom: 16px;">
                        <tr>
                            <th style="width: 10%;">Low</th>
                            <td style="width: 23%;" id="lowCell">[[low]]</td>
                            <th style="width: 10%; padding-left: 5px;">Avg</th>
                            <td style="width: 23%;" id="avgCell">[[avg]]</td>
                            <th style="width: 10%; padding-left: 5px;">High</th>
                            <td style="width: 23%;" id="highCell">[[high]]</td>
                        </tr>
                    </table>
                </div>
            </div>

                <paper-dialog id="thresholdsDialog">
                    <h2>Set blood pressure thresholds</h2>
                    <p>Select the ranges in which blood pressure values should be flagged:</p>
                    <paper-input id="warningLess" value="[[warningLess]]" type="number" label="warning if diastolic is less than"></paper-input>
                    <paper-input id="warningHigher" value="[[warningHigher]]" type="number" label="warning if systolic is higher than"></paper-input>
                    <paper-input id="dangerLess" value="[[dangerLess]]" type="number" label="danger if diastolic is less than"></paper-input>
                    <paper-input id="dangerHigher" value="[[dangerHigher]]" type="number" label="danger if systolic is higher than"></paper-input>

                    <paper-button dialog-dismiss autofocus>Decline</paper-button>
                    <paper-button dialog-confirm on-tap="updateThresholds">Accept</paper-button>
                </paper-dialog>
        </div>
    `;
    }
    static get properties() {
        return {
            userId: {
                type: String,
                value: '5b5c65e3ad30264506380dd1'
            },
            startDate: {
                type: Date,
                value: "2018-07-27"
            },
            endDate: {
                type: Date,
                value: "2018-07-30"
            },
            startDateStr: {
                type: String
            },
            endDateStr: {
                type: String
            },
            startInt: {
                type: Number
            },
            endInt: {
                type: Number
            },
            curPressed: {
                type: String,
                value: "day"
            },
            low: {
                type: String,
                value: "?"
            },
            avg: {
                type: String,
                value: "?"
            },
            high: {
                type: String,
                value: "?"
            },
            dangerVals: {
                type: Number,
                value: 0
            },
            warningVals: {
                type: Number,
                value: 0
            },
            okVals: {
                type: Number,
                value: 0
            },
            warningLess: {
                type: Number
            },
            warningHigher: {
                type: Number
            },
            dangerLess: {
                type: Number
            },
            dangerHigher: {
                type: Number
            }
        };
    }

    ready() {
        super.ready();
        
        this.setUserId();
        this.setDates();

        this.$.day.style.background = "#cac9c9";

        this.$.ajaxBp.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBp.generateRequest();
        this.$.ajaxBpSmall.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBpSmall.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    setDates() {
        this.endDate = new Date(this.endDate);
        this.endDate.setHours(23);
        this.endDate.setMinutes(59);
        this.endDate.setSeconds(59);

        var startDate = new Date(this.endDate);
        startDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 3) + (1000));
        this.startDate = startDate;

        this.startDateStr = this.getDateString(this.startDate);
        this.endDateStr = this.getDateString(this.endDate);

        this.startInt = this.startDate.getTime();
        this.endInt = this.endDate.getTime();
    }

    dateClick(e) {
        this.setActiveButton(e.srcElement);
        
        var id = e.srcElement.id;
        this.curPressed = id;
        var newDate = new Date();
        if (id === "day") {
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 3)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        } else if (id === "week") {
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 7)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        } else if (id === "month") {
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 28)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        }

        this.startInt = this.startDate.getTime();
        this.endInt = this.endDate.getTime();

        this.$.ajaxBp.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBp.generateRequest();
        this.$.ajaxBpSmall.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBpSmall.generateRequest();
    }

    setActiveButton(element) {
        this.$.day.style.background = "#e0e0e0";
        this.$.week.style.background = "#e0e0e0";
        this.$.month.style.background = "#e0e0e0";

        element.style.background = "#cac9c9";
    }

    changeDate(e) {
        var id = e.srcElement.id;

        var operator = 0;
        if (this.curPressed === "day")          operator = 3;
        else if (this.curPressed === "week")    operator = 7;
        else if (this.curPressed === "month")   operator = 28;

        if (id === "back") {
            this.startDate.setTime(this.startDate.getTime() - (24 * 60 * 60 * 1000 * operator));
            this.startDateStr = this.getDateString(this.startDate);
            this.endDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * operator));
            this.endDateStr = this.getDateString(this.endDate);
        } else if (id === "forward") {
            this.startDate.setTime(this.startDate.getTime() + (24 * 60 * 60 * 1000 * operator));
            this.startDateStr = this.getDateString(this.startDate);
            this.endDate.setTime(this.endDate.getTime() + (24 * 60 * 60 * 1000 * operator));
            this.endDateStr = this.getDateString(this.endDate);
        }

        this.startInt = this.startDate.getTime();
        this.endInt = this.endDate.getTime();

        this.$.ajaxBp.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBp.generateRequest();
        this.$.ajaxBpSmall.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBpSmall.generateRequest();
    }

    dataReceived(event) {
        var data = event.detail.response;
        var thresholds = data.thresholds;
        var values = data.values;
        var avgLine = data.avgLine;

        this.warningLess = thresholds.warningLess;
        this.warningHigher = thresholds.warningHigher;
        this.dangerLess = thresholds.dangerLess;
        this.dangerHigher = thresholds.dangerHigher;

        var sysArray = ['Systolic'];
        var diaArray = ['Diastolic'];
        var dateArray = ['x'];
        for (var i = 0; i < values.length; i++) {
            sysArray.push(values[i].systolic);
            diaArray.push(values[i].diastolic);
            var date = new Date(values[i].date);
            dateArray.push(this.getDateString(date));
        }

        this.generateChart(dateArray, sysArray, diaArray, thresholds, avgLine);
    }

    generateChart(dateArray, sysArray, diaArray, thresholds, avgLine) {
        var chart = c3.generate({
            bindto: this.$.chart,
            padding: {
                right: 10
            },
            legend: {
                show: false
            },
            data: {
                x: 'x',
                xFormat: '%d/%m/%Y',
                columns: [dateArray, sysArray, diaArray]
            },
            axis: {
                x: {
                    label: {
                        text: 'Date (day/month)',
                        position: 'outer-center'
                    },
                    min: this.startDateStr,
                    max: this.endDateStr,
                    type: 'timeseries',
                    tick: {
                        format: '%d/%m',
                        values: this.getTicks()
                    }
                },
                y: {
                    label: {
                        text: 'Blood pressure (mmHg)',
                        position: 'outer-middle'
                    },
                    min: 0
                }
            },
            grid: {
                y: {
                    lines: avgLine
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) {
                        return value + ' mmHg';
                    }
                }
            },
            regions: [
                { axis: 'y', start: thresholds.warningLess, end: thresholds.warningHigher, class: 'green' },
                { axis: 'y', start: thresholds.dangerLess, end: thresholds.warningLess, class: 'yellow' },
                { axis: 'y', start: thresholds.warningHigher, end: thresholds.dangerHigher, class: 'yellow' },
                { axis: 'y', end: thresholds.dangerLess, class: 'red' },
                { axis: 'y', start: thresholds.dangerHigher, class: 'red' }
            ]
        });
    }

    dataReceivedSmall(event) {
        var stats = event.detail.response;
        this.low = stats.low;
        this.avg = stats.avg;
        this.high = stats.high;
        this.dangerVals = stats.dangerVals;
        this.warningVals = stats.warningVals;
        this.okVals = stats.okVals;

        if (stats.lowCol === "red") this.$.lowCell.style.backgroundColor = "#ffa6a6";
        else if (stats.lowCol === "yellow") this.$.lowCell.style.backgroundColor = "#ffff90";
        else if (stats.lowCol === "green") this.$.lowCell.style.backgroundColor = "#a5ffa5";
        else this.$.lowCell.style.backgroundColor = "";

        if (stats.avgCol === "red") this.$.avgCell.style.backgroundColor = "#ffa6a6";
        else if (stats.avgCol === "yellow") this.$.avgCell.style.backgroundColor = "#ffff90";
        else if (stats.avgCol === "green") this.$.avgCell.style.backgroundColor = "#a5ffa5";
        else this.$.avgCell.style.backgroundColor = "";

        if (stats.highCol === "red") this.$.highCell.style.backgroundColor = "#ffa6a6";
        else if (stats.highCol === "yellow") this.$.highCell.style.backgroundColor = "#ffff90";
        else if (stats.highCol === "green") this.$.highCell.style.backgroundColor = "#a5ffa5";
        else this.$.highCell.style.backgroundColor = "";
    }

    getTicks() {
        var curType = this.curPressed;

        var ticks = [];
        // 3 days
        if (curType === "day") {
            for (var i = 0; i < 3; i++) {
                var date = new Date();
                date.setTime(this.startDate.getTime() + (24 * 60 * 60 * 1000 * i));
                ticks.push(this.getDateString(date));
            }
            return ticks;
        } 
        
        if (curType === "week") {
            for (var i = 0; i < 7; i++) {
                var date = new Date();
                date.setTime(this.startDate.getTime() + (24 * 60 * 60 * 1000 * i));
                ticks.push(this.getDateString(date));
            }
            return ticks;
        }

        for (var i = 0; i < 4; i++) {
            var date = new Date();
            date.setTime(this.startDate.getTime() + (24 * 60 * 60 * 1000 * 7 * i));
            ticks.push(this.getDateString(date));
        }
        ticks.push(this.getDateString(this.endDate));

        return ticks;
    }

    

    resize(e) {
        this.dispatchEvent(new CustomEvent('resize', { composed: true, detail: { resizeTo: "bp-element-small" }}));
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', {composed: true}));
    }

    setThresholds(e) {
        this.$.thresholdsDialog.open();
    }

    updateThresholds(e) {
        var warningLess = this.$.warningLess.value;
        var warningHigher = this.$.warningHigher.value;
        var dangerLess = this.$.dangerLess.value;
        var dangerHigher = this.$.dangerHigher.value;

        this.body = {
            "warningLess": warningLess,
            "warningHigher": warningHigher,
            "dangerLess": dangerLess,
            "dangerHigher": dangerHigher
        };

        this.$.ajaxThreshold.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxThreshold.generateRequest();
    }

    dataUpdated(e) {
        this.$.ajaxBp.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBp.generateRequest();
        this.$.ajaxBpSmall.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBpSmall.generateRequest();
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('bp-element', BpElement);
