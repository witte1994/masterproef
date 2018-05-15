import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
/**
 * @customElement
 * @polymer
 */
class PatientsElement extends PolymerElement {
  static get template() {
    return html`
    <style> 
    #resizable {
      resize: both;
      overflow: auto;
      height: 200px;
      width: 600px;
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
      <vaadin-grid aria-label="Basic Binding Example" items="[[users]]">
        <vaadin-grid-column>
            <template class="header">Name</template>
            <template>[[item.last_name]] [[item.first_name]]</template>
        </vaadin-grid-column>
    
        <vaadin-grid-column>
            <template class="header">Last Activity</template>
            <template>[[item.last_activity]]</template>
        </vaadin-grid-column>
    
        <vaadin-grid-column>
            <template class="header">Last Visit</template>
            <template>[[item.last_visit]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
            <template class="header">Next Visit</template>
            <template>[[item.next_visit]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column width="60px" flex-grow="0">
            <template class="header"></template>
            <template>
                <a href="/user/[[item.id]]">
                    <paper-icon-button icon="icons:arrow-forward"></paper-icon-button>
                </a>
            </template>
        </vaadin-grid-column>
      </vaadin-grid>
    </div>
    `;
  }
/*

  <h3 class="">Patient list</h3>

  <ul id="listbox" class="list-group">
  </ul>
            

*/

  static get properties() {
    return {
      
    };
    
  }
  checkPriority(data) {
    var dummy = data.detail.response;
    for (var k in dummy) {
        dummy[k].last_activity = new Date(dummy[k].last_activity).toLocaleDateString();
        dummy[k].last_visit = new Date(dummy[k].last_visit).toLocaleDateString();
        dummy[k].next_visit = new Date(dummy[k].next_visit).toLocaleDateString();
    }
    
  }
}

window.customElements.define('patients-element', PatientsElement);