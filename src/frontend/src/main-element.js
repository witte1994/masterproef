import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import './shared-styles.js';

import '../node_modules/packery/dist/packery.pkgd.min.js';
import '../node_modules/draggabilly/dist/draggabilly.pkgd.js';
import '../node_modules/css-element-queries/src/ResizeSensor.js';

import '@polymer/app-layout/app-layout';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-ajax/iron-ajax';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import './patient-list-element/patient-list-element';
import './patient-element/patient-element';

import './modules/allergy-element/allergy-element';
import './modules/prescription-element/prescription-element';
import './modules/vaccination-element/vaccination-element';

import './modules/allergy-element/allergy-element-small';
import './modules/prescription-element/prescription-element-small';
import './modules/vaccination-element/vaccination-element-small';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class MainElement extends PolymerElement {
    static get template() {
        return html`

        ${this.cssTemplate}
        ${this.ironAjaxTemplate}
        ${this.dialogTemplate}
        ${this.contentTemplate}
    `;
    }

    static get cssTemplate() {
        return html`
            <style include="shared-styles">
			app-toolbar {
				/* Toolbar is the main header, so give it some color */
				background-color: #1E88E5;
				font-family: 'Roboto', Helvetica, sans-serif;
				color: white;
				--app-toolbar-font-size: 24px;
			}
			
			app-drawer-layout:not([narrow]) [drawer-toggle] {
				display: none;
			}
			
			app-drawer {
				--app-drawer-content-container: {
					box-shadow: 1px 0 0px 0px rgba(0,0,0,0.30);
				}
			}

			.patientSelector {
				margin-left: auto;
				margin-right: 0;
			}
			
			.handle {
				height: 10px;
				background-color:#e0e0e0;
				border-radius: 8px;
				margin-left: 8px;
				margin-right: 8px;
				margin-bottom: 2px;
			}

			.resizeDiv {
				resize: both;
    			overflow: auto;
			}

			.resizeDivVert {
				resize: vertical;
				overflow: auto;
			}

			.containerGrid {
                display: grid;
                grid-template-rows: 10px auto;
            }
        </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
        <iron-ajax 
            id="ajaxLogin" 
            url="http://localhost:3000/clinician/login"
            method="POST"
            handle-as="json"
            content-type="application/json"
            bubbles="true"
            on-response="loginResponse"
            on-error="loginError">
        </iron-ajax>

        <iron-ajax 
            id="ajaxSaveLayout" 
            url="http://localhost:3000/patient/"
            method="POST"
            handle-as="json"
            content-type="application/json"
            bubbles="true">
        </iron-ajax>

        <iron-ajax 
            id="ajaxGetLayout" 
            url="http://localhost:3000/patient/"
            method="GET"
            handle-as="json"
            content-type="application/json"
            bubbles="true"
            on-response="loadLayout">
        </iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
        <paper-dialog id="addModule">
            <h2>Add module</h2>
            <p>Select the module and its size that you want to add:</p>
            
            <paper-dropdown-menu id="moduleMenu" label="Module">
                <paper-listbox slot="dropdown-content">
                    <paper-item value="allergy-element">Allergies</paper-item>
                    <paper-item value="prescription-element">Prescriptions</paper-item>
                    <paper-item value="vaccination-element">Vaccinations</paper-item>
                </paper-listbox>
            </paper-dropdown-menu>

            <paper-button dialog-dismiss autofocus>Decline</paper-button>
            <paper-button dialog-confirm on-tap="add">Accept</paper-button>
        </paper-dialog>

        <paper-dialog id="addModuleSmall">
            <h2>Pin small module</h2>
            <p>Select a small module to pin to the left-hand side:</p>
        
            <paper-dropdown-menu id="moduleMenuSmall" label="Module">
                <paper-listbox slot="dropdown-content">
                    <paper-item value="allergy-element-small">Allergies</paper-item>
                    <paper-item value="prescription-element-small">Prescriptions</paper-item>
                    <paper-item value="vaccination-element-small">Vaccinations</paper-item>
                </paper-listbox>
            </paper-dropdown-menu>
        
            <paper-button dialog-dismiss autofocus>Decline</paper-button>
            <paper-button dialog-confirm on-tap="addSmall">Accept</paper-button>
        </paper-dialog>

        <paper-dialog opened id="loginDialog" no-cancel-on-esc-key="true" no-cancel-on-outside-click="true" with-backdrop="true">
            <h2>Log in</h2>
            <p>Please log in:</p>
        
            <paper-input id="login" label="username"></paper-input>
            <paper-input id="password" type="password" label="password"></paper-input>
        
            <paper-button dialog-confirm on-tap="login">Login</paper-button>
        </paper-dialog>

        <paper-dialog id="loginError" no-cancel-on-esc-key="true" no-cancel-on-outside-click="true" with-backdrop="true">
            <h2>Error: log in failed</h2>
            <p>Please try again.</p>
        
            <paper-button dialog-confirm on-tap="openLoginDialog">Retry</paper-button>
        </paper-dialog>

        <paper-dialog style="width: 700px;" id="patientDialog" no-cancel-on-esc-key="true" no-cancel-on-outside-click="true" with-backdrop="true">

        </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <app-drawer-layout responsive-width="1076px" fullbleed style="--app-drawer-width: 285px;">
                <app-drawer id="drawer" slot="drawer" style="overflow-y: auto;">
                    <app-header-layout id="drawerLayout" has-scrolling-region="">
                        <app-header slot="header" fixed>
                            <app-toolbar style="margin-bottom: 8px;">
                                <paper-icon-button title="Switch patients" icon="compare-arrows" on-tap="openPatientDialog"></paper-icon-button>
                                <div main-title>Patient info</div>
                                <paper-icon-button title="Add small module" icon="add" on-tap="openSmallModuleDialog"></paper-icon-button>
                            </app-toolbar>
                        </app-header>

                        <div id="smallGrid" class="grid">
                        </div>
                    </app-header-layout>
                </app-drawer>
                
                <app-header-layout has-scrolling-region="">
                    <app-header slot="header" fixed>
                        <app-toolbar>
                            <paper-icon-button title="Open summary panel" icon="menu" drawer-toggle></paper-icon-button>
                            <div main-title>Dashboard</div>
                            <paper-icon-button title="Save layout" icon="save" on-tap="saveLayout"></paper-icon-button>
                            <paper-icon-button title="Add module" icon="add" on-tap="openModuleDialog"></paper-icon-button>
                        </app-toolbar>
                    </app-header>
                    
                    <div id="mainGrid" class="grid" style="margin: 8px;">

                    </div>

                </app-header-layout>
            </app-drawer-layout>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();
        this.onMainGrid = true;

        this.pckryMain = new Packery( this.$.mainGrid, {
            itemSelector: '.grid-item',
            columnWidth: 20,
            transitionDuration: 0
        });

        this.pckrySmall = new Packery( this.$.smallGrid, {
            itemSelector: '.grid-item',
            columnWidth: 20,
            transitionDuration: 0
        });

        this.addEventListener('patient-click', function (e) {
            this.$.patientDialog.toggle();
        
            var split = document.URL.split("/");
            var param = split[split.length-1];
            window.sessionStorage.setItem('pId', param);
        
            this.loadPatientPage();
        });
    }

    login() {
        this.$.ajaxLogin.body = {
            "login": this.$.login.value,
            "password": this.$.password.value
        };
        this.$.ajaxLogin.generateRequest();
    }

    loginResponse(e) {
        window.sessionStorage.accessToken = e.detail.response.token;
        
        var patientList = document.createElement("patient-list-element");
        this.$.patientDialog.appendChild(patientList);
        this.$.patientDialog.toggle();
    }

    loginError(e) {
        this.$.loginError.open();
    }

    saveLayout() {
        var positions = this.getElementPositions();

        this.savePositions(positions);
    }

    getElementPositions() {
        var mainPositions = this.getMainElements();
        var smallPositions = this.getSmallElements();
    
        return {small: smallPositions, main: mainPositions};
    }

    getMainElements() {
        var elements = this.pckryMain.getItemElements();
    
        var posMain = this.getPosition(this.$.mainGrid);
        var positions = [];
        var offset = { x: 0, y: 0 };
        for (var i = 0; i < elements.length; i++) {
            var pos = this.getPosition(elements[i]);
    
            offset.x = pos.x - posMain.x;
            offset.y = pos.y - posMain.y;
            var savePos = {
                elementName: elements[i].children[1].tagName.toLowerCase(),
                x: offset.x,
                y: offset.y,
                width: elements[i].offsetWidth,
                height: elements[i].offsetHeight
            };
            positions.push(savePos);
        }
    
        return positions;
    }

    getSmallElements() {
        var elements = this.pckrySmall.getItemElements();
    
        var order = [];
        for (var i = 0; i < elements.length; i++) {
            var pos = {
                elementName: elements[i].children[1].tagName.toLowerCase(),
                height: elements[i].offsetHeight
            };
    
            order.push(pos);
        }
    
        return order;
    }

    savePositions(positions) {  
        this.$.ajaxSaveLayout.url = "http://localhost:3000/patient/" + window.sessionStorage.getItem('pId') + "/layout";
    
        this.$.ajaxSaveLayout.body = {
            layout: positions
        };
        this.$.ajaxSaveLayout.generateRequest();
    }

    getPosition(element) {
        var rect = element.getBoundingClientRect();
        return { x: rect.left, y: rect.top, xRight: rect.right, yBottom: rect.bottom };
    }

    loadPatientPage() {
        this.clearGrids();
    
        this.addPatientElement();
    
        this.loadLayoutProcess();
    }

    clearGrids() {
        if (this.patientElement != null) {
            this.patientElement.parentNode.removeChild(this.patientElement);
            this.patientElement = null;
        }

        var elements = this.pckryMain.getItemElements();
        this.pckryMain.remove(elements);
        var elementsSmall = this.pckrySmall.getItemElements();
        this.pckrySmall.remove(elementsSmall);
    }

    addPatientElement() {
        this.patientElement = document.createElement("patient-element");
        this.patientElement.setAttribute("id", "patientElement");
        this.$.drawerLayout.insertBefore(this.patientElement, this.$.smallGrid);
    }

    loadLayoutProcess() {
        this.$.ajaxGetLayout.url = "http://localhost:3000/patient/" + window.sessionStorage.getItem('pId') + "/layout";
        this.$.ajaxGetLayout.generateRequest();
    }

    loadLayout(e) {
        var elements = e.detail.response;
        if (elements == null)
            return;
    
        this.loadSmallLayout(elements.small);
        this.loadMainLayout(elements.main);
    }

    loadSmallLayout(elements) {
        this.onMainGrid = false;
        for (var i = 0; i < elements.length; i++) {
            var container = this.createModuleContainer(elements[i].elementName);
            container.style.height = elements[i].height + "px";
            this.addContainerToGrid(container);
        }
    }

    loadMainLayout(elements) {
        this.onMainGrid = true;
    
        for (var i = 0; i < elements.length; i++) {
            var container = this.createModuleContainer(elements[i].elementName);
            container.style.width = elements[i].width + "px";
            container.style.height = elements[i].height + "px";
            this.addContainerToGrid(container);
            this.pckryMain.fit(container, elements[i].x, elements[i].y)
        }
    }

    add() {
        this.onMainGrid = true;
        var moduleName = this.$.moduleMenu.selectedItem.getAttribute("value");
    
        var container = this.createModuleContainer(moduleName);
        this.addContainerToGrid(container);
    }

    createModuleContainer(moduleName) {
        var newModule = document.createElement(moduleName);
        newModule.setAttribute("update", false);
    
        var parentDiv = document.createElement("div");
        parentDiv.classList.add("grid-item");
        parentDiv.classList.add("containerGrid");
    
        if (!this.onMainGrid) {
            parentDiv.classList.add("resizeDivVert");
            parentDiv.style.minWidth = "100%";
            parentDiv.addEventListener("sizeSmall", function (e) {
                parentDiv.style.minHeight = e.detail;
            });
        } else {
            parentDiv.classList.add("resizeDiv");
            parentDiv.addEventListener("size", function (e) {
                parentDiv.style.minWidth = e.detail.width;
                parentDiv.style.minHeight = e.detail.height;
            });
        }
        
        var handlerDiv = document.createElement("div");
        handlerDiv.classList.add("handle");
    
        parentDiv.appendChild(handlerDiv);
        parentDiv.appendChild(newModule);
    
        this.addListeners(parentDiv, newModule);
    
        return parentDiv;
    }

    addContainerToGrid(container) {
        var tarGrid = this.getTargetGrid();
        var tarPackery = this.getTargetPackery();
    
        tarGrid.appendChild(container);
        tarPackery.appended(container);
        tarPackery.layout();

        var draggie = new Draggabilly(container, {
            handle: '.handle'
        });

        tarPackery.bindDraggabillyEvents(draggie);
    }

    addSmall() {
        this.onMainGrid = false;
        var moduleName = this.$.moduleMenuSmall.selectedItem.getAttribute("value");
    
        var container = this.createModuleContainer(moduleName);
        this.addContainerToGrid(container);
    }

    addListeners(parent, mod) {
        this.addRemoveListener(parent, mod);
    
        var updateStr = mod.tagName.split("-")[0].toLowerCase();
        var outerThis = this;
        mod.addEventListener(updateStr, function (e) {
            outerThis.broadcastUpdate(updateStr);
        });
    
        var tarPackery = this.getTargetPackery();
        new ResizeSensor(parent, function () {
            tarPackery.shiftLayout();
        });
    }

    broadcastUpdate(updateStr) {
        var elements = this.pckryMain.getItemElements();
        
        for (var i = 0; i < elements.length; i++) {
            var curElement = elements[i].children[1];
            var curName = curElement.tagName.split("-")[0].toLowerCase();
    
            if (curName === updateStr) {
                curElement.update();
            }
        }
    
        var elements = this.pckrySmall.getItemElements();
        for (var i = 0; i < elements.length; i++) {
            var curElement = elements[i].children[1];
            var curName = curElement.tagName.split("-")[0].toLowerCase();
    
            if (curName === updateStr) {
                curElement.update();
            }
        }
    }

    addRemoveListener(parent, mod) {
        var tarPackery = this.getTargetPackery();
    
        mod.addEventListener('delete', function (e) {
            tarPackery.remove(parent);
            tarPackery.shiftLayout();
        });
    }

    getTargetGrid() {
        if (this.onMainGrid)
            return this.$.mainGrid;
        else
            return this.$.smallGrid;
    }

    getTargetPackery() {
        if (this.onMainGrid)
            return this.pckryMain;
        else
            return this.pckrySmall;
    }

    openLoginDialog() {
        this.$.loginDialog.open()
    }

    openPatientDialog() {
        this.$.patientDialog.open();
    }

    openSmallModuleDialog() {
        this.$.addModuleSmall.open();
    }

    openModuleDialog() {
        this.$.addModule.open()
    }
}

window.customElements.define('main-element', MainElement);
