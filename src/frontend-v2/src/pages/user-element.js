import '@polymer/app-route/app-route.js'
import '@polymer/iron-ajax/iron-ajax.js'
import '../modules/patients-element.js'

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * @customElement
 * @polymer
 */
class UserElement extends PolymerElement {
  static get template() {
    return html`
    <style> 
    .resizable {
      padding: 20px;
      resize: both;
      overflow: auto;
    }
	  </style>
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

      <h2>yo user</h2>
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
  }

  loadData(data) {
    this.data = data.detail.response[0];/*
    this.birth = (new Date(this.data.birth)).toLocaleDateString();
    this.last_activity = new Date(this.data.last_activity).toLocaleDateString();
    this.last_visit = new Date(this.data.last_visit).toLocaleDateString();
    this.next_visit = new Date(this.data.next_visit).toLocaleDateString();*/
  }
}





window.customElements.define('user-element', UserElement);