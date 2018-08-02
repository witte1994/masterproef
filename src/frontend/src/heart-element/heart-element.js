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
                columns: [
                    
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d/%m'
                    }
                },
                y: {
                    min: 0
                }
            }
        });

        this.$.ajaxHeart.generateRequest();
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

        this.startInt = this.startDate.getTime();
        this.endInt = this.endDate.getTime();

        this.$.ajaxHeart.generateRequest();
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

        this.chart.load({
            unload: true,
            columns: [dateArray, valArray]
        });

        this.chart.regions([{ axis: 'y', start: thresholds.warningLess, end: thresholds.warningHigher, class: 'green' }, { axis: 'y', start: thresholds.dangerLess, end: thresholds.warningLess, class: 'yellow' }, { axis: 'y', start: thresholds.warningHigher, end: thresholds.dangerHigher, class: 'yellow' }, { axis: 'y', end: thresholds.dangerLess, class: 'red' }, { axis: 'y', start: thresholds.dangerHigher, class: 'red' }]);
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('heart-element', HeartElement);
