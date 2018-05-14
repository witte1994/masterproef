import '@polymer/app-route/app-route.js'
import '@polymer/iron-ajax/iron-ajax.js'
import 'interactjs/dist/interact.js'
import '../modules/patients-element.js'
import Draggable from '@shopify/draggable/lib/draggable';

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
    #dragme { 
      position:  absolute;
      left: 50;
      top: 200;
    }
	</style>
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
      <div id="holder" style="width: 400px; height: 400px;">
        <div id="dragme" draggable="true" class="resizable d-flex justify-content-center m-3 card p-4">
          <h2>yo [[data.last_name]] [[data.first_name]]</h2>
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