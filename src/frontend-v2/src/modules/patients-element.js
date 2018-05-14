import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js'
/**
 * @customElement
 * @polymer
 */
class PatientsElement extends PolymerElement {
  static get template() {
    return html`
    <style> 
    #resizable {
      padding: 20px;
      resize: both;
      overflow: auto;
    }
    </style>
    <iron-ajax 
      auto 
      content-type="application/json"
      method = "GET"
      url="http://localhost:3000/getusers" 
      handle-as="json" 
      last-response="{{users}}" on-response="checkPriority">
    </iron-ajax>
    <div id="resizable" class="d-flex justify-content-center card">
      <h3 class="">Patient list</h3>

    <ul id="listbox" class="list-group">
    </ul>
            
    </div>
    `;
  }
  static get properties() {
    return {
      
    };
    
  }
  checkPriority(data) {
    var dummy = data.detail.response;
    for (var k in dummy) {
      var el = document.createElement("li");
      el.classList.add("list-group-item");
      var elLink = document.createElement("a");
      elLink.href = "/user/" + dummy[k].id;;
      elLink.innerHTML = String(dummy[k].last_name) + " " + dummy[k].first_name;
      el.appendChild(elLink);
      this.$.listbox.appendChild(el);
    }
  }
}

window.customElements.define('patients-element', PatientsElement);