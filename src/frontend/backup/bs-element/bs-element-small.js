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
class BsElementSmall extends PolymerElement {
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
            id="ajaxBs"
            url="http://localhost:3000/user/[[userId]]/bs/small/[[startInt]]\&[[endInt]]"
            method="GET"
            handle-as="json"
            on-response="dataReceived"
        ></iron-ajax>

        <iron-ajax
            id="ajaxThreshold"
            url="http://localhost:3000/user/[[userId]]/bs/threshold"
            body="[[body]]"
            method="PATCH"
            handle-as="json"
            content-type="application/json"
            on-response="dataUpdated"
        ></iron-ajax>

        <div class="card">
            <div style="width:60%; display:inline-block;">
                <h1>Blood sugar</h1>
            </div><div style="width:40%; display:inline-block;">
                <paper-icon-button icon="fullscreen" on-tap="resize"></paper-icon-button>
                <paper-icon-button icon="settings" on-tap="setThresholds"></paper-icon-button>
                <paper-icon-button icon="close" on-tap="removeModule"></paper-icon-button>
            </div>

            <paper-dialog id="thresholdsDialog">
                <h2>Set blood sugar thresholds</h2>
                <p>Select the ranges in which blood sugar values should be flagged:</p>
                <paper-input id="warningLess" value="[[warningLess]]" type="number" label="warning if less than"></paper-input>
                <paper-input id="warningHigher" value="[[warningHigher]]" type="number" label="warning if higher than"></paper-input>
                <paper-input id="dangerLess" value="[[dangerLess]]" type="number" label="danger if less than"></paper-input>
                <paper-input id="dangerHigher" value="[[dangerHigher]]" type="number" label="danger if higher than"></paper-input>

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
                <table class="row" style="width: 280px; margin-left:15px;">
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

            <div style="width:100%; display:inline-block; text-align: center;">
                <table class="row" style="width: 320px; table-layout: fixed;">
                    <tr>
                        <th style="width: 25%; padding: 3px;"></th>
                        <th style="width: 25%; padding: 3px;">Low</th>
                        <th style="width: 25%; padding: 3px;">Avg</th>
                        <th style="width: 25%; padding: 3px;">High</th>
                    </tr>
                    <tr>
                        <th style="width: 25%; padding: 3px;">mmol/L</th>
                        <td style="width: 25%; padding: 3px;" id="lowCell">[[low]]</td>
                        <td style="width: 25%; padding: 3px;" id="avgCell">[[avg]]</td>
                        <td style="width: 25%; padding: 3px;" id="highCell">[[high]]</td>
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
            body: {
                type: Object
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

        this.$.ajaxBs.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBs.generateRequest();
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

        this.$.ajaxBs.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBs.generateRequest();
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

        this.$.ajaxBs.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBs.generateRequest();
    }

    dataReceived(event) {
        var stats = event.detail.response;
        this.low = stats.low;
        this.avg = stats.avg;
        this.high = stats.high;
        this.dangerVals = stats.dangerVals;
        this.warningVals = stats.warningVals;
        this.okVals = stats.okVals;

        var thresholds = stats.thresholds;

        this.warningLess = thresholds.warningLess;
        this.warningHigher = thresholds.warningHigher;
        this.dangerLess = thresholds.dangerLess;
        this.dangerHigher = thresholds.dangerHigher;

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

    resize(e) {
        this.dispatchEvent(new CustomEvent('resize', { composed: true, detail: { resizeTo: "bs-element" } }));
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
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
        this.$.ajaxBs.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxBs.generateRequest();
    }

    getDateString(date) {
        var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        return str;
    }
}

window.customElements.define('bs-element-small', BsElementSmall);
