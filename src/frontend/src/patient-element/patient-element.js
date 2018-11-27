import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import moment from 'moment/src/moment'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/iron-image/iron-image'

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PatientElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            p {
                margin: 4px 0px 4px 0px;
            }

            h1 {
                margin-left: 0px;
                margin-bottom: 12px;
            }

            .containerHorGender {
                display: grid;
                grid-template-columns: 4fr 6fr;
            }
            .containerHor {
                display: grid;
                grid-template-columns: 1fr 2fr;
            }

            .containerHorLessInfo {
                display: grid;
                grid-template-columns: 5fr 4fr 2fr;
                justify-items: center;
            }
            
            paper-icon-button {
                width: 20px;
                height: 20px;
                padding: 0px;
            }

            .card {
                grid-template-rows: 158px 36px auto
            }


            #allInfo {
                display: block;
            }

            #lessInfo {
                display: none;
            }
        </style>

        <iron-ajax 
            id="ajaxPatient"
            url="http://localhost:3000/patient/[[pId]]"
            method="GET"
            handle-as="json"
            on-response="handleResponse"
        ></iron-ajax>

        <div class="card" style="padding-bottom: 0px;">
            <div style="text-align: center;"><iron-image style="width:150px; height:150px;" sizing="contain" src="/img/placeholder.jpeg"></iron-image></div>

            <div style="text-align: center;"><h1>[[patient.lastName]] [[patient.firstName]]</h1></div>

            <div id="allInfo">
                <div class="containerHor">
                    <p><b>Birth:</b></p>
                    <p>{{getDateString(patient.birth)}}</p>
                </div>
                <div class="containerHor">
                    <p><b>NID:</b></p>
                    <p>[[patient.nid]]</p>
                </div>
                <div class="containerHorGender">
                    <p><b>Gender:</b> [[patient.gender]]</p>
                    <p style="margin-left: 8px;"><b>Blood type:</b> [[patient.bloodType]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Smoker:</b></p>
                    <p>{{getSmokerStr(patient.smoker)}}</p>
                </div>
                <div class="containerHor">
                    <p><b>Height:</b></p>
                    <p>{{getHeightStr(patient.height)}}</p>
                </div>
                <div class="containerHor">
                    <p><b>Address:</b></p>
                    <p>[[patient.address]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Phone:</b></p>
                    <p>[[patient.phone]]</p>
                </div>
                <div style="text-align:center;"><paper-icon-button title="Show less info" icon="expand-less" on-tap="resize"></paper-icon-button></div>
            </div>

            <div id="lessInfo">
                <div class="containerHorLessInfo">
                    <p>{{getDateString(patient.birth)}}</p>
                    <p>{{getGenderStr(patient.gender)}}</p>
                    <p>[[patient.bloodType]]</p>
                </div>
                <div style="text-align:center;"><paper-icon-button title="Show more info" icon="expand-more" on-tap="resize"></paper-icon-button></div>
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
        
        this.setPatientId();
        
        this.$.ajaxPatient.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxPatient.generateRequest();
    }

    getDateString(date) {
        return moment(date).format("DD/MM/YYYY");
    }

    getHeightStr(height) {
        var heightStr = "";
        heightStr += parseInt(Math.floor((height/100)), 10) + ",";
        heightStr += (height % 100) + "m";
        return heightStr;
    }

    getGenderStr(gender) {
        if (gender === "F") return "Female";
        return "Male";
    }

    getSmokerStr(smoker) {
        if (smoker) return "Yes";
        return "No";
    }

    setPatientId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.pId = param;
    }

    handleResponse(e) {
        this.patient = e.detail.response;
    }

    resize(e) {
        if (this.$.allInfo.style.display === "none") {
            this.$.allInfo.style.display = "block";
            this.$.lessInfo.style.display = "none";
        } else {
            this.$.allInfo.style.display = "none";
            this.$.lessInfo.style.display = "block";
        }
    }
}

window.customElements.define('patient-element', PatientElement);
