import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-icon-button/paper-icon-button'
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class UserElementSmall extends PolymerElement {
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
                margin-bottom: 8px;
            }

            .containerHor {
                display: grid;
                grid-template-columns: 5fr 4fr 2fr;
                justify-items: center;
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
                    <p>[[date]]</p>
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
        var param = split[split.length - 1];
        this.userId = param;

        this.$.ajaxUser.headers['authorization'] = "Bearer " + window.sessionStorage.accessToken;
        this.$.ajaxUser.generateRequest();
    }

    handleResponse(event) {
        this.user = event.detail.response;
        var newDate = new Date(this.user.birth);
        this.date = ("0" + newDate.getDate()).slice(-2) + "/" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "/" + newDate.getFullYear();

        if (this.user.gender === "F") {
            this.gender = "Female";
        } else {
            this.gender = "Male";
        }
    }

    resize(e) {
        this.dispatchEvent(new CustomEvent('resizeUserSmall', { composed: true }));
    }
}

window.customElements.define('user-element-small', UserElementSmall);
