import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElement} from '../base-element.js'

import '@polymer/iron-ajax/iron-ajax'
import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-textarea'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-checkbox/paper-checkbox';
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/vaadin-grid-filter';

import '@vaadin/vaadin-context-menu/vaadin-context-menu';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class WorkflowElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                paper-input {
                    margin-top: 0px;
                    height: 50px;
                }

                #workflowContent {
                    display: none;
                    margin: 4px;
                }

                .infoHeader {
                    display: grid;
                    grid-template-columns: auto;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .stepRow {
                    display: grid;
                    grid-template-columns: 28px auto;
                    font-weight: bold;
                }

                .stepRowDescription {
                    display: grid;
                    grid-template-columns: 28px auto;
                }

                .subStepRow {
                    display: grid;
                    grid-template-columns: 34px 24px auto;
                    margin-top: 4px;
                    margin-bottom: 4px;
                }

                .circle {
                    height: 28px;
                    width: 28px;
                    background-color: #1E88E5;
                    color: white;
                    border-radius: 50%;
                    display: inline-block;
                    text-align: center;
                    line-height: 28px;
                }
                .circleSmall {
                    height: 24px;
                    width: 24px;
                    background-color: #1E88E5;
                    color: white;
                    border-radius: 50%;
                    display: inline-block;
                    text-align: center;
                    line-height: 24px;
                    font-weight: bold;
                }

                .substeps {
                    margin-bottom: 8px;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxGetAvailableWorkflows"
                url="http://localhost:3000/patient/[[pId]]/workflow"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="availableWorkflowsReceived"
                last-response="{{workflows}}"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxGetWorkflow"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]"
                method="GET"
                handle-as="json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCreateWorkflow"
                url="http://localhost:3000/patient/[[pId]]/workflow/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCreateStep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="createStepResponse"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="openWorkflowDialog">
                <h2>Open workflow</h2>
                
                <div>
                    <paper-dropdown-menu selected="{{selected}}" label="Workflows" id="workflowList">
                        <paper-listbox slot="dropdown-content">
                            <dom-repeat items="{{workflows}}">
                                <template>
                                    <paper-item value$="{{item._id}}">{{item.name}}</paper-item>
                                </template>
                            </dom-repeat>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createNewWorkflow">Create new</paper-button>
                <paper-button id="openWorkflowButton" dialog-confirm on-tap="openWorkflow">Open</paper-button>

            </paper-dialog>

            <paper-dialog id="newWorkflowDialog">
                <h2>New workflow</h2>
                
                <div>
                    <div><paper-checkbox id="patientBound">Patient bound</paper-checkbox></div>
                    <div><paper-checkbox id="public">Public</paper-checkbox></div>
                </div>

                <div>
                    <paper-input style="padding: 0px;" id="name" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="description" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createNewWorkflowAction">Create</paper-button>
            </paper-dialog>

            <paper-dialog id="createStepDialog">
                <h2>Add step</h2>
                
                <div>
                    <paper-input style="padding: 0px;" id="nameStep" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionStep" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createStepAction">Create</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <div id="workflowContent">
                <vaadin-context-menu selector=".isSelector">
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="createStep">Add step</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="editWorkflow">Edit workflow</vaadin-item>
                            <vaadin-item on-tap="deleteWorkflow">Delete workflow</vaadin-item>
                        </vaadin-list-box>
                    </template>

                    <div class="infoHeader isSelector">
                        <div>[[currentWorkflow.description]]</div>
                    </div>
                </vaadin-context-menu>

                <dom-repeat items="{{currentWorkflow.steps}}" as="step">
                    <template>
                        <vaadin-context-menu selector=".isSelector">
                            <template>
                                <vaadin-list-box>
                                <vaadin-item value="[[step._id]]" on-tap="addSubstep">Add substep</vaadin-item>
                                <hr>
                                <vaadin-item value="[[step._id]]" on-tap="editStep">Edit step</vaadin-item>
                                <vaadin-item value="[[step._id]]" on-tap="deleteStep">Delete step</vaadin-item>
                                </vaadin-list-box>
                            </template>

                            <div class="stepRow isSelector">
                                <div class="circle">{{displayIndex(index)}}</div>
                                <div style="margin-left: 6px; margin-top: 4px;">[[step.name]]</div>
                            </div>
                            <div class="stepRowDescription isSelector">
                                <div></div>
                                <div style="margin-left: 6px;">[[step.description]]</div>
                            </div>
                        </vaadin-context-menu>

                    </template>
                </dom-repeat>
            </div>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.title = "Workflow"
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        var body = {
            "pId": this.pId,
            "cId": window.sessionStorage.cId
        };

        this.$.ajaxGetAvailableWorkflows.body = body;
        this.$.ajaxGetAvailableWorkflows.generateRequest();

        this.update();
    }

    displayIndex(index) {
        return index + 1;
    }

    update(e) {

    }

    editWorkflow(e) {
        console.log(e.target.value);
    }

    deleteWorkflow(e) {
        console.log(e.target.value);
    }

    createStep(e) {
        this.$.createStepDialog.open();
    }

    createStepAction(e) {
        var body = {
            "pId": this.pId,
            "cId": window.sessionStorage.cId,
            "name": this.$.nameStep.value,
            "description": this.$.descriptionStep.value
        };

        this.$.ajaxCreateStep.body = body;
        this.$.ajaxCreateStep.generateRequest();
    }

    createStepResponse(e) {
        this.loadWorkflow(e.detail.response);
    }

    editStep(e) {
        console.log(e.target.value);
    }

    deleteStep(e) {
        console.log(e.target.value);
    }

    addSubstep(e) {
        console.log(e.target.value);
    }

    sendUpdateSignal() {
        this.dispatchEvent(new CustomEvent("workflow", {bubbles: true, composed: true}));
    }

    availableWorkflowsReceived(e) {
        if (this.workflows.length == 0) {
            this.$.openWorkflowButton.disabled = true;
        } else {
            this.$.openWorkflowButton.disabled = false;
        }
    }

    workflowReceived(e) {
        console.log(e.detail.response); 
        this.loadWorkflow(e.detail.response);
    }

    createNewWorkflow() {
        this.$.newWorkflowDialog.open();
    }

    createNewWorkflowAction() {
        var pId = null;
        if (this.$.patientBound.checked)
            pId = this.pId;

        var cId = null;
        if (!this.$.public.checked) {
            cId = window.sessionStorage.cId;
        }

        var body = {
            "pId": pId,
            "cId": cId,
            "name": this.$.name.value,
            "description": this.$.description.value
        };

        this.$.ajaxCreateWorkflow.body = body;
        this.$.ajaxCreateWorkflow.generateRequest();
    }

    loadWorkflow(workflow) {
        this.currentWorkflow = workflow;
        this.title = "Workflow: " + this.currentWorkflow.name;
        this.$.workflowContent.style.display = "block";
    }

    openWorkflow() {
        if (this.$.workflowList.selectedItem == undefined) {
            return;
        }
        this.workflowId = this.$.workflowList.selectedItem.getAttribute("value");
        this.$.ajaxGetWorkflow.generateRequest();
    }

    getMinSizes() {
        return {
            width: "400px",
            height: "300px"
        };
    }

    openDialog(e) {
        this.$.openWorkflowDialog.open();
    }
}

window.customElements.define('workflow-element', WorkflowElement);
