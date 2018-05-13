import '@polymer/app-route/app-route.js'
import '@polymer/iron-ajax/iron-ajax.js'

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * @customElement
 * @polymer
 */
class UserElement extends PolymerElement {
  static get template() {
    return html`
      <app-route route="{{route}}" pattern="[[rootPath]]:user_id" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      <iron-ajax
        id = "request"
        auto 
        content-type="application/json"
        method = "GET"
        url="http://localhost:3000/getuser/{{routeData.user_id}}"
        handle-as="json" 
        last-response="{{data}}" on-response="loadData">
      </iron-ajax>
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="d-flex justify-content-center m-3">
        <div class="card p-4">
          <h2>Hello [[data.last_name]] [[data.first_name]]!</h2>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      routeData: Object,
      data: {type: Array},
    };
  }

  ready() {
    super.ready();
    console.log("ready");
  }

  loadData(data) {
    console.log(data.detail.response[0]);
    this.data = data.detail.response[0];/*
    this.birth = (new Date(this.data.birth)).toLocaleDateString();
    this.last_activity = new Date(this.data.last_activity).toLocaleDateString();
    this.last_visit = new Date(this.data.last_visit).toLocaleDateString();
    this.next_visit = new Date(this.data.next_visit).toLocaleDateString();*/
  }
}

window.customElements.define('user-element', UserElement);