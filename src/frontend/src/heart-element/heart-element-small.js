import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-menu-button/paper-menu-button'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class HeartElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 340px;
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

            paper-button { 
                background: #e0e0e0;
            }


        </style>

        <div class="card">
            
            <div>
                <h1 class="block">Heart rate (BPM)</h1>
                <paper-menu-button style="align: right;"class="block">
                    <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                    <paper-listbox slot="dropdown-content">
                        <paper-item>Remove module</paper-item>
                        <paper-item>Set thresholds</paper-item>
                    </paper-listbox>
                </paper-menu-button>
                
            </div>
            <table class="row">
                <tr>
                    <td><paper-button id="day" toggles on-click="dateClick">3 days</paper-button></td>
                    <td><paper-button id="week" toggles on-click="dateClick">week</paper-button></td>
                    <td><paper-button id="month" toggles on-click="dateClick">month</paper-button></td>
                </tr>
            </table>

            <table class="row">
                <tr>
                    <td><paper-icon-button id="back" icon="arrow-back" on-click="changeDate"></paper-icon-button></td>
                    <td><p>[[startDateStr]] - [[endDateStr]]</p></td>
                    <td><paper-icon-button id="forward" icon="arrow-forward" on-click="changeDate"></paper-icon-button></td>
                </tr>
            </table>


            <table class="row">
                <tr>
                    <td><img src="img/red_error.png"></td>
                    <td><p>val</p></td>
                    <td><img src="img/yellow_warning.png"></td>
                    <td><p>val</p></td>
                    <td><img src="img/green_ok.png"></td>
                    <td><p>val</p></td>
                </tr>
            </table>

            <table class="row">
                <tr>
                    <th>Low</th>
                    <th>Avg</th>
                    <th>High</th>
                </tr>
                <tr>
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
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
            user: {
                type: Object
            },
            data: {
                type: String
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
            curPressed: {
                type: String,
                value: "day"
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
        
        var startDate = new Date(this.endDate);
        startDate.setDate(this.endDate.getDate()-3);
        
        this.startDate = startDate;

        this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth()+1)).slice(-2) + "/" + this.startDate.getFullYear();
        this.endDateStr = ("0" + this.endDate.getDate()).slice(-2) + "/" + ("0" + (this.endDate.getMonth() + 1)).slice(-2) + "/" + this.endDate.getFullYear();
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
            newDate.setDate(this.endDate.getDate() - 3);
            this.startDate.setDate(newDate.getDate());
            this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth() + 1)).slice(-2) + "/" + this.startDate.getFullYear();
        } else if (id === "week") {
            var newDate = new Date();
            newDate.setDate(this.endDate.getDate() - 7);
            this.startDate.setDate(newDate.getDate());
            this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth() + 1)).slice(-2) + "/" + this.startDate.getFullYear();
        } else if (id === "month") {
            var newDate = new Date();
            newDate.setDate(this.endDate.getDate() - 28);
            this.startDate.setDate(newDate.getDate());
            this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth() + 1)).slice(-2) + "/" + this.startDate.getFullYear();
        }
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
            this.startDate.setDate(this.startDate.getDate() - operator);
            this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth() + 1)).slice(-2) + "/" + this.startDate.getFullYear();
            this.endDate.setDate(this.endDate.getDate() - operator);
            this.endDateStr = ("0" + this.endDate.getDate()).slice(-2) + "/" + ("0" + (this.endDate.getMonth() + 1)).slice(-2) + "/" + this.endDate.getFullYear();
        } else if (id === "forward") {
            this.startDate.setDate(this.startDate.getDate() + operator);
            this.startDateStr = ("0" + this.startDate.getDate()).slice(-2) + "/" + ("0" + (this.startDate.getMonth() + 1)).slice(-2) + "/" + this.startDate.getFullYear();
            this.endDate.setDate(this.endDate.getDate() + operator);
            this.endDateStr = ("0" + this.endDate.getDate()).slice(-2) + "/" + ("0" + (this.endDate.getMonth() + 1)).slice(-2) + "/" + this.endDate.getFullYear();
        }
    }
}

window.customElements.define('heart-element-small', HeartElementSmall);
