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
class WeightElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 360px;
            }
            
            .row {
                width: 100%;
                text-align: center;
            }

            paper-button { 
                background: #e0e0e0;
            }
        </style>

        <iron-ajax
            id="ajaxWeight"
            url="http://localhost:3000/user/[[userId]]/weight/small/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
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
            <div style="width:60%; display:inline-block;">
                <h1>Weight</h1>
            </div><div style="width:40%; display:inline-block;">
                <paper-icon-button icon="fullscreen" on-tap="resize"></paper-icon-button>
                <paper-icon-button icon="settings" on-tap="setThresholds"></paper-icon-button>
                <paper-icon-button icon="close" on-tap="removeModule"></paper-icon-button>
            </div>

            <paper-dialog id="thresholdsDialog">
                <h2>Set weight target</h2>
                <p>Select weight target:</p>
                <paper-input id="goal" value="[[goal]]" type="number" label="target weight"></paper-input>

                <paper-button dialog-dismiss autofocus>Decline</paper-button>
                <paper-button dialog-confirm on-tap="updateThresholds">Accept</paper-button>
            </paper-dialog>

            <div style="width:100%; display:inline-block; text-align:center; margin-top: 5px;">
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

            <div style="width:100%; display:inline-block; text-align: center;">
                <table class="row" style="width: 260px; margin-left:30px;">
                    <tr>
                        <td>(kg)</td>
                        <th>Start</th>
                        <th>Current</th>
                        <th>Diff.</th>
                    </tr>
                    <tr>
                        <th>Total</th>
                        <td>[[startWeight]]</td>
                        <td>[[curWeight]]</td>
                        <td id="totalCell">[[difference]]</td>
                    </tr>
                    <tr>
                        <th>Period</th>
                        <td>[[startPeriod]]</td>
                        <td>[[endPeriod]]</td>
                        <td id="periodCell">[[periodDifference]]</td>
                    </tr>
                </table>
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
            body: {
                type: Object
            },
            goal: {
                type: Number
            }
        };
    }

    ready() {
        super.ready();

        this.setUserId();
        this.setDates();
        
        this.$.day.style.background = "#cac9c9";

        this.$.ajaxWeight.generateRequest();
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
            newDate.setTime(this.endDate.getTime() - (24*60*60*1000*3)+1000);
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
    }

    dataReceived(event) {
        var stats = event.detail.response;
        this.startWeight = stats.startWeight;
        this.curWeight = stats.curWeight;
        this.difference = stats.difference;
        this.startPeriod = stats.startPeriod;
        this.endPeriod = stats.endPeriod;
        this.periodDifference = stats.periodDifference;

        this.goal = stats.goal.goal;

        if (stats.totalCol === "red") this.$.totalCell.style.backgroundColor = "#ffa6a6";
        else if (stats.totalCol === "green") this.$.totalCell.style.backgroundColor = "#a5ffa5";
        else                                this.$.totalCell.style.backgroundColor = "";

        if (stats.periodCol === "red") this.$.periodCell.style.backgroundColor = "#ffa6a6";
        else if (stats.periodCol === "green") this.$.periodCell.style.backgroundColor = "#a5ffa5";
        else this.$.periodCell.style.backgroundColor = "";
    }

    resize(e) {
        this.dispatchEvent(new CustomEvent('resize', { composed: true, detail: { resizeTo: "weight-element" } }));
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
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
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('weight-element-small', WeightElementSmall);
