import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'

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

            .containerVer {
                display: grid;
                grid-template-rows: repeat(7, 1fr);
                grid-gap: 10px;
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

            #allInfo {
                display: block;
            }

            #lessInfo {
                display: none;
            }
        </style>

        <iron-ajax 
            id="ajaxUser"
            url="http://localhost:3000/user/[[userId]]"
            method="GET"
            handle-as="json"
            on-response="handleResponse"
        ></iron-ajax>

        <div class="card" style="padding-bottom: 0px;">
            <h1>[[user.lastName]] [[user.firstName]]</h1>

            <div id="allInfo">
                <div class="containerHor">
                    <p><b>Birth:</b></p>
                    <p>[[user.dateStr]]</p>
                </div>
                <div class="containerHor">
                    <p><b>NID:</b></p>
                    <p>[[user.nid]]</p>
                </div>
                <div class="containerHorGender">
                    <p><b>Gender:</b> [[user.gender]]</p>
                    <p style="margin-left: 8px;"><b>Blood type:</b> [[user.bloodType]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Smoker:</b></p>
                    <p>[[smoker]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Height:</b></p>
                    <p>[[user.heightStr]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Address:</b></p>
                    <p>[[user.address]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Phone:</b></p>
                    <p>[[user.phone]]</p>
                </div>
                <div style="text-align:center;"><paper-icon-button title="Show less info" icon="expand-less" on-tap="resize"></paper-icon-button></div>
            </div>

            <div id="lessInfo">
                <div class="containerHorLessInfo">
                    <p>[[user.dateStr]]</p>
                    <p>[[gender]]</p>
                    <p>[[user.bloodType]]</p>
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
        
        this.setUserId();
        
        this.$.ajaxUser.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxUser.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    handleResponse(e) {
        this.user = e.detail.response;

        this.gender = (this.user.gender === "F") ? "Female" : "Male";
        this.smoker = (this.user.smoker) ? "Yes" : "No";
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
