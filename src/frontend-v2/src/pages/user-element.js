import '@polymer/app-route/app-route.js'
import '@polymer/iron-ajax/iron-ajax.js'
import 'interactjs/dist/interact.js'
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
    #resizable {
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
      <div id="holder" style="height: 800px;">
      <div id="resizable" class="card m-2" draggable="true" style="position: absolute;">
        <patients-element></patients-element>
      </div>
      <div id="resizable" class="card m-2" draggable="true" style="position: absolute;">
        <patients-element></patients-element>
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
    var el = this.$.resizable;
    el.addEventListener('dragstart',drag_start,false);
    console.log(document.body);
    this.$.holder.addEventListener('dragover',drag_over,false);
    this.$.holder.addEventListener('drop',this.drop,false);
  }

  

  

  drop(event) {
    console.log("drop");
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = this.$.resizable;
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';/*
    event.preventDefault();
    return false;*/
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

function drag_start(event) {
  console.log("start drag");
  var style = window.getComputedStyle(event.target, null);
  event.dataTransfer.setData("text/plain",
  (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}

function drag_over(event) {
    
  console.log("drag over");
  event.preventDefault(); 
  return false; 
}

window.customElements.define('user-element', UserElement);