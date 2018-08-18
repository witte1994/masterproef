import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class UserElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 256px;
            }

            .horizontal p {
                display: inline;
            }
        </style>

        <iron-ajax 
            id="ajaxUser"
            url="http://localhost:3000/user/[[userId]]"
            method="GET"
            handle-as="json"
            on-response="handleResponse"
        ></iron-ajax>

        <div class="card">
            <h1>[[user.lastName]] [[user.firstName]]</h1>
            <p><b>Date of birth:</b> [[date]]</p>
            <div class="horizontal">
                <p><b>Gender:</b> [[user.gender]]</p>
                <p style="margin-left: 8px;"><b>Blood type:</b> [[user.bloodType]]</p>
            </div>
            <p><b>Height:</b> [[user.height]]</p>
            <p><b>Address:</b> [[user.address]]</p>
            <p><b>Phone:</b> [[user.phone]]</p>
            
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
    }
}

window.customElements.define('user-element', UserElement);
