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
class HeartElement extends PolymerElement {
    static get template() {
        return html`
        <link rel="stylesheet" href="/node_modules/c3/c3.css">
        <style include="shared-styles">
            :host {
                width: 800px;
            }

            .row {
                width: 100%;
                text-align: center;
                margin-bottom: 5px;
            }

            .block {
                display: inline-block;
                margin: auto;
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
                font-size: 22px;
                padding: 10px;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax
            id="ajaxHeart"
            url="http://localhost:3000/user/[[userId]]/heart/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
        ></iron-ajax>

        <iron-ajax
            id="ajaxHeartSmall"
            url="http://localhost:3000/user/[[userId]]/heart/small/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceivedSmall"
        ></iron-ajax>

        <iron-ajax
            id="ajaxThreshold"
            url="http://localhost:3000/user/[[userId]]/heart/threshold"
            body="[[body]]"
            method="PATCH"
            handle-as="json"
            content-type="application/json"
            on-response="dataUpdated"
        ></iron-ajax>

        <div class="card">
            <div style="width:70%; display:inline-block; vertical-align:top;">
                <div style="width:40%; display:inline-block;">
                    <h1>Heart rate (BPM)</h1>
                </div><div style="width:60%; display:inline-block;">
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
                <div style="width: 100%;"><div id="chart" style="width: 537px;"></div>
                </div>

            </div><div style="width:30%; display:inline-block;">
                <div style="width:80%; display:inline-block;">
                </div><div style="width:20%; display:inline-block;">
                    <paper-menu-button style="padding: 0px;">
                        <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                        <paper-listbox slot="dropdown-content">
                            <paper-item on-tap="removeModule">Remove module</paper-item>
                            <paper-item on-tap="setThresholds">Set thresholds</paper-item>
                        </paper-listbox>
                    </paper-menu-button>
                </div>

                <paper-dialog id="thresholdsDialog">
                    <h2>Set heart rate thresholds</h2>
                    <p>Select the ranges in which heart rate values should be flagged:</p>
                    <paper-input id="warningLess" type="number" label="warning if less than"></paper-input>
                    <paper-input id="warningHigher" type="number" label="warning if higher than"></paper-input>
                    <paper-input id="dangerLess" type="number" label="danger if less than"></paper-input>
                    <paper-input id="dangerHigher" type="number" label="danger if higher than"></paper-input>

                    <paper-button dialog-dismiss autofocus>Decline</paper-button>
                    <paper-button dialog-confirm on-tap="updateThresholds">Accept</paper-button>
                </paper-dialog>

                <div style="width: 100%; margin-top: 40px;">
                    <table class="row">
                        <tr>
                            <td><img src="img/red_error.png"></td>
                            <td><p>[[dangerVals]]</p></td>
                            <td><img src="img/yellow_warning.png"></td>
                            <td><p>[[warningVals]]</p></td>
                            <td><img src="img/green_ok.png"></td>
                            <td><p>[[okVals]]</p></td>
                        </tr>
                    </table>
                </div>

                <div style="width: 100%; margin-top: 20px;">
                    <h1 class="row">Summary</h1>
                </div>

                <div style="width: 100%;">
                    <table class="row" style="padding: 20px 50px 50px 50px;">
                        <tr>
                            <th class="cell" id="lowHead">Low</th>
                            <td class="cell" id="lowCell">[[low]]</td>
                        </tr>
                        <tr>
                            <th class="cell" id="avgHead">Avg</th>
                            <td class="cell" id="avgCell">[[avg]]</td>
                        </tr>
                        <tr>
                            <th class="cell" id="highHead">High</th>
                            <td class="cell" id="highCell">[[high]]</td>
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
            chart: {
                type: Object
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
            }
        };
    }

    ready() {
        super.ready();
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
        this.$.day.style.background = "#cac9c9";

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

        this.$.ajaxHeart.generateRequest();
        this.$.ajaxHeartSmall.generateRequest();
    }

    dateClick(e) {
        this.$.day.style.background = "#e0e0e0";
        this.$.week.style.background = "#e0e0e0";
        this.$.month.style.background = "#e0e0e0";

        e.srcElement.style.background = "#cac9c9";

        var id = e.srcElement.id;
        this.curPressed = id;
        if (id === "day") {
            var newDate = new Date();
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 3)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        } else if (id === "week") {
            var newDate = new Date();
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 7)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        } else if (id === "month") {
            var newDate = new Date();
            newDate.setTime(this.endDate.getTime() - (24 * 60 * 60 * 1000 * 28)+1000);
            this.startDate.setTime(newDate.getTime());
            this.startDateStr = this.getDateString(this.startDate);
        }

        this.chart.axis.min({ x: this.startDateStr });
        this.chart.axis.max({ x: this.endDateStr });


        this.startInt = this.startDate.getTime();
        this.endInt = this.endDate.getTime();

        this.$.ajaxHeart.generateRequest();
        this.$.ajaxHeartSmall.generateRequest();
    }

    changeDate(e) {
        var id = e.srcElement.id;

        var operator = 0;

        if (this.curPressed === "day") {
            operator = 3;
        } else if (this.curPressed === "week") {
            operator = 7;
        } else if (this.curPressed === "month") {
            operator = 28;
        }

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

        this.$.ajaxHeart.generateRequest();
        this.$.ajaxHeartSmall.generateRequest();
    }

    dataReceived(event) {
        var data = event.detail.response;
        var thresholds = data.thresholds;
        var values = data.values;

        var valArray = ['Heart rate (BPM)'];
        var dateArray = ['x'];
        for (var i = 0; i < values.length; i++) {
            valArray.push(values[i].value);
            var date = new Date(values[i].date);
            dateArray.push(this.getDateString(date));
        }

        var ticks = this.getTicks();

        this.chart = c3.generate({
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
                        values: ticks
                    }
                },
                y: {
                    min: 0
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

        if (stats.lowCol === "red") {
            this.$.lowCell.style.backgroundColor = "#ff9999";
            //this.$.lowHead.style.backgroundColor = "#ff9999";
        } else if (stats.lowCol === "yellow") {
            this.$.lowCell.style.backgroundColor = "#ffff80";
            //this.$.lowHead.style.backgroundColor = "#ffff80";
        } else if (stats.lowCol === "green") {
            this.$.lowCell.style.backgroundColor = "#4dff88";
            //this.$.lowHead.style.backgroundColor = "#4dff88";
        } else {
            this.$.lowCell.style.backgroundColor = "";
            //this.$.lowHead.style.backgroundColor = "";
        }

        if (stats.avgCol === "red") {
            this.$.avgCell.style.backgroundColor = "#ff9999";
            //this.$.avgHead.style.backgroundColor = "#ff9999";
        } else if (stats.avgCol === "yellow") {
            this.$.avgCell.style.backgroundColor = "#ffff80";
            //this.$.avgHead.style.backgroundColor = "#ffff80";
        } else if (stats.avgCol === "green") {
            this.$.avgCell.style.backgroundColor = "#4dff88";
            //this.$.avgHead.style.backgroundColor = "#4dff88";
        } else {
            this.$.avgCell.style.backgroundColor = "";
            //this.$.avgHead.style.backgroundColor = "";
        }

        if (stats.highCol === "red") {
            this.$.highCell.style.backgroundColor = "#ff9999";
            //this.$.highHead.style.backgroundColor = "#ff9999";
        } else if (stats.highCol === "yellow") {
            this.$.highCell.style.backgroundColor = "#ffff80";
            //this.$.highHead.style.backgroundColor = "#ffff80";
        } else if (stats.highCol === "green") {
            this.$.highCell.style.backgroundColor = "#4dff88";
            //this.$.highHead.style.backgroundColor = "#4dff88";
        } else {
            this.$.highCell.style.backgroundColor = "";
            //this.$.highHead.style.backgroundColor = "";
        }
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

        this.$.ajaxThreshold.generateRequest();
    }

    dataUpdated(e) {
        this.$.ajaxHeart.generateRequest();
        this.$.ajaxHeartSmall.generateRequest();
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('heart-element', HeartElement);
