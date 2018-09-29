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
class MedicationElement extends PolymerElement {
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
                font-size: 22px;
                padding: 10px;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax
            id="ajaxMedication"
            url="http://localhost:3000/user/[[userId]]/medication/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
        ></iron-ajax>

        <iron-ajax
            id="ajaxThreshold"
            url="http://localhost:3000/user/[[userId]]/medication/threshold"
            body="[[body]]"
            method="PATCH"
            handle-as="json"
            content-type="application/json"
            on-response="dataUpdated"
        ></iron-ajax>

        <div class="card">
            <div style="width:100%; display:inline-block; vertical-align:top;">
                <div style="width:25%; display:inline-block;">
                    <h1>Medication</h1>
                </div><div style="width:55%; display:inline-block;">
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

            </div>
            <paper-dialog id="thresholdsDialog">
                <h2>Set medication adherence target</h2>
                <p>Select medication adherence target in percent:</p>
                <paper-input id="warningLess" value="[[warningLess]]" type="number" label="warning if less than"></paper-input>
                <paper-input id="dangerLess" value="[[dangerLess]]" type="number" label="danger if less than"></paper-input>

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
            warningLess: {
                type: Number
            },
            dangerLess: {
                type: Number
            }
        };
    }

    ready() {
        super.ready();
        
        this.setUserId();
        this.setDates();

        this.$.day.style.background = "#cac9c9";

        this.$.ajaxMedication.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxMedication.generateRequest();
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

        this.$.ajaxMedication.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxMedication.generateRequest();
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

        this.$.ajaxMedication.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxMedication.generateRequest();
    }

    dataReceived(event) {
        var data = event.detail.response;
        var thresholds = data.thresholds;
        var values = data.values;
        var dates = data.dates;
        var xsDates = data.xsDates;
        var indivStrings = data.indivStrings;

        this.warningLess = thresholds.warningLess;
        this.dangerLess = thresholds.dangerLess;
        
        this.generateChart(values, dates, xsDates, thresholds, indivStrings);
    }

    generateChart(values, dates, xsDates, thresholds, indivStrings) {
        var chart = c3.generate({
            bindto: this.$.chart,
            padding: {
                right: 10
            },
            data: {
                xs: xsDates,
                xFormat: '%d/%m/%Y',
                columns: dates.concat(values)
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
                        text: 'Medication adherence (%)',
                        position: 'outer-middle'
                    },
                    min: 5,
                    max: 95
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) {
                        return indivStrings[id][index] + ' (' + value.toFixed(1) + '%)';
                    }
                }
            },
            regions: [
                { axis: 'y', start: thresholds.warningLess, end: 100, class: 'green' },
                { axis: 'y', start: thresholds.dangerLess, end: thresholds.warningLess, class: 'yellow' },
                { axis: 'y', end: thresholds.dangerLess, class: 'red' }
            ]
        });
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
        this.dispatchEvent(new CustomEvent('resize', { composed: true, detail: { resizeTo: "medication-element-small" }}));
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', {composed: true}));
    }

    setThresholds(e) {
        this.$.thresholdsDialog.open();
    }

    updateThresholds(e) {
        var warningLess = this.$.warningLess.value;
        var dangerLess = this.$.dangerLess.value;

        this.body = {
            "warningLess": warningLess,
            "dangerLess": dangerLess
        };

        this.$.ajaxThreshold.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxThreshold.generateRequest();
    }

    dataUpdated(e) {
        this.$.ajaxMedication.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxMedication.generateRequest();
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('medication-element', MedicationElement);
