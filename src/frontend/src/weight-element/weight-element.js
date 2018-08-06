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
 */
class WeightElement extends PolymerElement {
    static get template() {
        return html`
        <link rel="stylesheet" href="/node_modules/c3/c3.css">
        <style include="shared-styles">
            :host {
                width: 750px;
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
                padding: 4px;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax
            id="ajaxWeight"
            url="http://localhost:3000/user/[[userId]]/weight/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
        ></iron-ajax>

        <iron-ajax
            id="ajaxWeightSmall"
            url="http://localhost:3000/user/[[userId]]/weight/small/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceivedSmall"
        ></iron-ajax>

        <iron-ajax
            id="ajaxThreshold"
            url="http://localhost:3000/user/[[userId]]/weight/threshold"
            body="[[body]]"
            method="PATCH"
            handle-as="json"
            content-type="application/json"
            on-response="dataUpdated"
        ></iron-ajax>

        <div class="card">
            <div style="width:74%; display:inline-block; vertical-align:top;">
                <div style="width:30%; display:inline-block;">
                    <h1>Weight (kg)</h1>
                </div><div style="width:70%; display:inline-block;">
                    <paper-button id="day" toggles on-tap="dateClick">3 days</paper-button>
                    <paper-button id="week" toggles on-tap="dateClick">week</paper-button>
                    <paper-button id="month" toggles on-tap="dateClick">month</paper-button>
                </div>
                <div style="width:20%; display:inline-block; text-align: center;">
                    <paper-icon-button id="back" icon="arrow-back" on-tap="changeDate"></paper-icon-button>
                </div><div style="width:60%; display:inline-block; text-align: center;">
                    <p>[[startDateStr]] - [[endDateStr]]</p>
                </div><div style="width:20%; display:inline-block; text-align: center;">
                    <paper-icon-button id="forward" icon="arrow-forward" on-tap="changeDate"></paper-icon-button>
                </div>
                <div style="width: 100%;"><div id="chart" style="width: 500px; height: 280px;"></div>
                </div>

            </div><div style="width:26%; display:inline-block;">
                <div style="width:30%; display:inline-block;">
                </div><div style="width:70%; display:inline-block;">
                    <paper-icon-button icon="fullscreen-exit" on-tap="resize"></paper-icon-button>
                    <paper-icon-button icon="settings" on-tap="setThresholds"></paper-icon-button>
                    <paper-icon-button icon="close" on-tap="removeModule"></paper-icon-button>
                </div>

                <paper-dialog id="thresholdsDialog">
                    <h2>Set weight target</h2>
                    <p>Select weight target:</p>
                    <paper-input id="goal" type="number" label="target weight"></paper-input>

                    <paper-button dialog-dismiss autofocus>Decline</paper-button>
                    <paper-button dialog-confirm on-tap="updateThresholds">Accept</paper-button>
                </paper-dialog>

                <div style="width: 100%; margin-top: 20px;">
                    <h1 class="row">Goal: [[goal]]</h1>
                </div>

                <div style="width: 100%; margin-top: 20px;">
                    <table class="row">
                        <tr>
                            <th class="cell"></th>
                            <th class="cell">Total</td>
                        </tr>
                        <tr>
                            <th class="cell">Start</th>
                            <td class="cell" id="startTotal">[[startWeight]]</td>
                        </tr>
                        <tr>
                            <th class="cell">Current</th>
                            <td class="cell" id="currentTotal">[[curWeight]]</td>
                        </tr>
                        <tr>
                            <th class="cell">Diff.</th>
                            <td class="cell" id="diffTotal">[[difference]]</td>
                        </tr>
                    </table>
                </div>

                <div style="width: 100%;">
                    <table class="row">
                        <tr>
                            <th class="cell"></th>
                            <th class="cell">Period</td>
                        </tr>
                        <tr>
                            <th class="cell">Start</th>
                            <td class="cell" id="startPeriod">[[startPeriod]]</td>
                        </tr>
                        <tr>
                            <th class="cell">Current</th>
                            <td class="cell" id="endPeriod">[[endPeriod]]</td>
                        </tr>
                        <tr>
                            <th class="cell">Diff.</th>
                            <td class="cell" id="diffPeriod">[[periodDifference]]</td>
                        </tr>
                    </table>
                </div>
            </div>
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
            startWeight: {
                type: String,
                value: "?"
            },
            curWeight: {
                type: String,
                value: "?"
            },
            difference: {
                type: String,
                value: "?"
            },
            startPeriod: {
                type: String,
                value: "?"
            },
            endPeriod: {
                type: String,
                value: "?"
            },
            periodDifference: {
                type: String,
                value: "?"
            },
            goal: {
                type: Number,
                value: 0
            },
            body: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();
        
        this.setUserId();
        this.setDates();

        this.$.day.style.background = "#cac9c9";

        this.$.ajaxWeight.generateRequest();
        this.$.ajaxWeightSmall.generateRequest();
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

        this.$.ajaxWeight.generateRequest();
        this.$.ajaxWeightSmall.generateRequest();
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

        this.$.ajaxWeight.generateRequest();
        this.$.ajaxWeightSmall.generateRequest();
    }

    dataReceived(event) {
        var data = event.detail.response;
        this.goal = data.thresholds.goal;
        var values = data.values;

        var valArray = ['Weight (kg)'];
        var dateArray = ['x'];
        var min = 99999, max = 0;
        for (var i = 0; i < values.length; i++) {
            if (values[i].value < min) min = values[i].value;
            if (values[i].value > max) max = values[i].value;
            valArray.push(values[i].value);
            var date = new Date(values[i].date);
            dateArray.push(this.getDateString(date));
        }

        if (this.goal < min) min = this.goal;
        if (this.goal > max) max = this.goal;

        min -= 5;
        max += 5;

        this.generateChart(dateArray, valArray, min, max);
    }

    generateChart(dateArray, valArray, min, max) {

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
                columns: [dateArray, valArray]
            },
            axis: {
                x: {
                    min: this.startDateStr,
                    max: this.endDateStr,
                    type: 'timeseries',
                    tick: {
                        format: '%d/%m',
                        values: this.getTicks()
                    }
                },
                y: {
                    min: min,
                    max: max
                }
            },
            grid: {
                y: {
                    lines: [
                        {value: this.goal, text: 'Goal weight'}
                    ]
                }
            }
        });
    }

    dataReceivedSmall(event) {
        var stats = event.detail.response;
        this.startWeight = stats.startWeight;
        this.curWeight = stats.curWeight;
        this.difference = stats.difference;
        this.startPeriod = stats.startPeriod;
        this.endPeriod = stats.endPeriod;
        this.periodDifference = stats.periodDifference;

        if (stats.totalCol === "red") this.$.diffTotal.style.backgroundColor = "#ff9999";
        else if (stats.totalCol === "green") this.$.diffTotal.style.backgroundColor = "#4dff88";
        else this.$.diffTotal.style.backgroundColor = "";

        if (stats.periodCol === "red") this.$.diffPeriod.style.backgroundColor = "#ff9999";
        else if (stats.periodCol === "green") this.$.diffPeriod.style.backgroundColor = "#4dff88";
        else this.$.diffPeriod.style.backgroundColor = "";
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
        this.dispatchEvent(new CustomEvent('resize', { composed: true, detail: { resizeTo: "weight-element-small" }}));
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', {composed: true}));
    }

    setThresholds(e) {
        this.$.thresholdsDialog.open();
    }

    updateThresholds(e) {
        var goal = this.$.goal.value;

        this.body = {
            "goal": goal,
        };

        this.$.ajaxThreshold.generateRequest();
    }

    dataUpdated(e) {
        this.$.ajaxWeight.generateRequest();
        this.$.ajaxWeightSmall.generateRequest();
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('weight-element', WeightElement);
