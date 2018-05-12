import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js'
/**
 * @customElement
 * @polymer
 */
class PatientsElement extends PolymerElement {
  static get template() {
    return html`
    <iron-ajax 
      auto 
      content-type="application/json"
      method = "GET"
      url="http://localhost:3000/getusers" 
      handle-as="json" 
      last-response="{{users}}" on-response="checkPriority">
    </iron-ajax>

    <div class="d-flex justify-content-center m-3">
      <div class="card p-4">
        <h3 class="">Patient list</h3>

      <ul id="listbox" class="list-group">
      </ul>
              
      </div>
    <div>
    `;
  }
  static get properties() {
    return {
      
    };
    
  }
  checkPriority(data) {
    var dummy = data.detail.response;
    console.log()
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