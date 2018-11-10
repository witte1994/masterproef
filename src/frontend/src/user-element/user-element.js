import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class UserElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 256px;
                font-family: 'Roboto', Helvetica, sans-serif;
            }

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
            
            paper-icon-button {
                width: 20px;
                height: 20px;
                padding: 0px;
                margin: auto;
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

            <div>
                <div class="containerHor">
                    <p><b>Birth:</b></p>
                    <p>[[date]]</p>
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
                    <p>[[heightStr]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Address:</b></p>
                    <p>[[user.address]]</p>
                </div>
                <div class="containerHor">
                    <p><b>Phone:</b></p>
                    <p>[[user.phone]]</p>
                </div>
                <div style="text-align:center;"><paper-icon-button icon="expand-less" on-tap="resize"></paper-icon-button></div>
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            user: {
                value: Object
            },
            data: {
                value: String
            }
        };
    }

    ready() {
        super.ready();
        var split = document.URL.split("/");
        var param = split[split.length-1];
        this.userId = param;
        
        this.$.ajaxUser.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxUser.generateRequest();
    }

    handleResponse(event) {
        this.user = event.detail.response;
        var newDate = new Date(this.user.birth);
        this.date = ("0" + newDate.getDate()).slice(-2) + "/" + ("0" + (newDate.getMonth()+1)).slice(-2) + "/" + newDate.getFullYear();

        var heightStr = "";
        var height = this.user.height;
        heightStr += parseInt(Math.floor((height/100)), 10) + ",";
        heightStr += (height % 100) + "m";
        this.heightStr = heightStr;

        if (this.user.smoker)
            this.smoker = "Yes";
        else
            this.smoker = "No";
    }

    resize(e) {
        this.dispatchEvent(new CustomEvent('resizeUser', { composed: true }));
    }
}

window.customElements.define('user-element', UserElement);
