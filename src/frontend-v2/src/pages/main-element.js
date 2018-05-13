import '@polymer/app-route/app-location.js'
import '@polymer/app-route/app-route.js'
import '@polymer/iron-pages/iron-pages.js'
import 'user-element.js'
import '../modules/patients-element.js'

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';


setPassiveTouchGestures(true);
setRootPath(MyAppGlobals.rootPath);
/**
 * @customElement
 * @polymer
 */
class MainElement extends PolymerElement {
  static get template() {
    return html`
    <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
    </app-location>

    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
    </app-route>
    <!--Navbar-->
    <nav class="navbar navbar-expand-lg navbar-dark primary-color">
  
      <!-- Navbar brand -->
      <a class="navbar-brand mr-auto" href="#">Dashboard</a>
  
      <div class="d-flex justify-content-center">
        <form class="form-inline">
          <div class="md-form my-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          </div>
        </form>
      </div>
      
    
      <!-- Collapsible content -->
    </nav>
    <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
      <patients-element name="patients-element" route={{subroute}}></patients-element>
      <user-element name="user-element" route={{subroute}}></user-element>
    </iron-pages>
    `;
  }
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }
  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }
  _routePageChanged(page) {
    if (!page) {
      this.page = 'patients-element';
    } else if (page == 'user') {
      this.page = 'user-element';
    } else {
      this.page = 'view404';
    }
  }
  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'user':
        import('user-element.js');
        break;
      case 'patients-element':
        import('../modules/patients-element.js');
        break;
    }
  }
}

window.customElements.define('main-element', MainElement);
