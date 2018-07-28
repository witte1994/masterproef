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
            auto
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
            prop1: {
                type: String,
                value: 'user-element'
            },
            userId: {
                type: String,
                value: '5b5c65e3ad30264506380dd1'
            },
            user: {
                value: Object
            },
            data: {
                value: String
            }
        };
    }

    handleResponse(event) {
        this.user = event.detail.response;
        var newDate = new Date(this.user.birth);
        this.date = newDate.getFullYear() + "-" + ("0" + newDate.getMonth()).slice(-2) + "-" + ("0" + newDate.getDate()).slice(-2); 
        console.log(this.date);
    }
}

window.customElements.define('user-element', UserElement);
