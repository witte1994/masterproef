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
                id="ajaxUpdateWorkflow"
                url="http://localhost:3000/patient/[[pId]]/workflow/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxDeleteWorkflow"
                url="http://localhost:3000/patient/[[pId]]/workflow/delete/[[workflowId]]"
                method="DELETE"
                handle-as="json"
                on-response="workflowDeleted"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCreateStep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="createStepResponse"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxUpdateStep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxDeleteStep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/delete/[[curStepId]]"
                method="DELETE"
                handle-as="json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCreateSubstep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/step/[[curStepId]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxUpdateSubstep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/step/[[curStepId]]/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                on-response="workflowReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxDeleteSubstep"
                url="http://localhost:3000/patient/[[pId]]/workflow/[[workflowId]]/step/[[curStepId]]/delete/[[curSubstepId]]"
                method="DELETE"
                handle-as="json"
                on-response="workflowReceived"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="openWorkflowDialog">
                <h2>Open workflow</h2>
                
                <div>
                    <paper-dropdown-menu label="Workflows" id="workflowList">
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

            <paper-dialog id="updateWorkflowDialog">
                <h2>Edit workflow</h2>
                
                <div>
                    <div><paper-checkbox id="patientBoundUpdate">Patient bound</paper-checkbox></div>
                    <div><paper-checkbox id="publicUpdate">Public</paper-checkbox></div>
                </div>

                <div>
                    <paper-input style="padding: 0px;" id="nameUpdate" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateWorkflowAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteWorkflowDialog">
                <h2>Delete workflow</h2>
                
                <div>
                    Are you sure you want to delete this workflow?
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteWorkflowAction">Delete</paper-button>
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

            <paper-dialog id="updateStepDialog">
                <h2>Edit step</h2>
                
                <div>
                    <paper-input style="padding: 0px;" id="nameStepUpdate" label="Name"></paper-input>
                </div>
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionStepUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateStepAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteStepDialog">
                <h2>Delete step</h2>
                
                <div>
                    Are you sure you want to delete this step?
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteStepAction">Delete</paper-button>
            </paper-dialog>

            <paper-dialog id="createSubstepDialog">
                <h2>Add substep</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionSubstep" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createSubstepAction">Create</paper-button>
            </paper-dialog>

            <paper-dialog id="updateSubstepDialog">
                <h2>Edit substep</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionSubstepUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateSubstepAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteSubstepDialog">
                <h2>Delete substep</h2>
                
                <div>
                    Are you sure you want to delete this substep?
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteSubstepAction">Delete</paper-button>
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
                            <vaadin-item on-tap="updateWorkflow">Edit workflow</vaadin-item>
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
                                <vaadin-item value="[[index]]" on-tap="createSubstep">Add substep</vaadin-item>
                                <hr>
                                <vaadin-item value="[[index]]" on-tap="updateStep">Edit step</vaadin-item>
                                <vaadin-item value="[[index]]" on-tap="deleteStep">Delete step</vaadin-item>
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

                        <dom-repeat items="{{step.substeps}}" as="substep" index-as="substepIndex">
                            <template>
                                <vaadin-context-menu selector=".isSelector">
                                    <template>
                                        <vaadin-list-box>
                                        <vaadin-item value="[[index]] [[substepIndex]]" on-tap="updateSubstep">Edit substep</vaadin-item>
                                        <vaadin-item value="[[index]] [[substepIndex]]" on-tap="deleteSubstep">Delete substep</vaadin-item>
                                        </vaadin-list-box>
                                    </template>

                                    <div class="subStepRow isSelector">
                                        <div></div>
                                        <div class="circleSmall">{{displayIndex(substepIndex)}}</div>
                                        <div style="margin-left: 6px; margin-top: 2px;">[[substep.description]]</div>
                                    </div>
                                </vaadin-context-menu>
                            </template>
                        </dom-repeat>

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

    updateWorkflow(e) {
        if (this.currentWorkflow.pId == null)
            this.$.patientBoundUpdate.checked = false;
        else
            this.$.patientBoundUpdate.checked = true;

        if (this.currentWorkflow.cId == null)
            this.$.publicUpdate.checked = true;
        else
            this.$.publicUpdate.checked = false;

        this.$.nameUpdate.value = this.currentWorkflow.name;
        this.$.descriptionUpdate.value = this.currentWorkflow.description;

        this.$.updateWorkflowDialog.open();
    }

    updateWorkflowAction(e) {
        var pId = null;
        if (this.$.patientBoundUpdate.checked)
            pId = this.pId;

        var cId = null;
        if (!this.$.publicUpdate.checked) {
            cId = window.sessionStorage.cId;
        }

        var body = {
            "id": this.currentWorkflow._id,
            "pId": pId,
            "cId": cId,
            "name": this.$.nameUpdate.value,
            "description": this.$.descriptionUpdate.value
        };

        this.$.ajaxUpdateWorkflow.body = body;
        this.$.ajaxUpdateWorkflow.generateRequest();
    }

    deleteWorkflow(e) {
        this.$.deleteWorkflowDialog.open();
    }

    deleteWorkflowAction(e) {
        this.$.ajaxDeleteWorkflow.generateRequest();
    }

    workflowDeleted(e) {
        this.$.ajaxGetAvailableWorkflows.generateRequest();
        this.title = "Workflow"
        this.$.workflowContent.style.display = "none";
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

    updateStep(e) {
        var index = e.target.value;
        this.curStep = this.currentWorkflow.steps[index];

        this.$.nameStepUpdate.value = this.curStep.name;
        this.$.descriptionStepUpdate.value = this.curStep.description;

        this.$.updateStepDialog.open();
    }

    updateStepAction(e) {
        var body = {
            "id": this.curStep._id,
            "pId": this.pId,
            "cId": window.sessionStorage.cId,
            "name": this.$.nameStepUpdate.value,
            "description": this.$.descriptionStepUpdate.value
        };

        this.$.ajaxUpdateStep.body = body;
        this.$.ajaxUpdateStep.generateRequest();
    }

    deleteStep(e) {
        var index = e.target.value;
        this.curStepId = this.currentWorkflow.steps[index]._id;
        this.$.deleteStepDialog.open();
    }

    deleteStepAction(e) {
        this.$.ajaxDeleteStep.generateRequest();
    }

    createSubstep(e) {
        var index = e.target.value;
        this.curStepId = this.currentWorkflow.steps[index]._id;

        this.$.createSubstepDialog.open();
    }

    createSubstepAction(e) {
        var body = {
            "pId": this.pId,
            "cId": window.sessionStorage.cId,
            "description": this.$.descriptionSubstep.value
        };

        this.$.ajaxCreateSubstep.body = body;
        this.$.ajaxCreateSubstep.generateRequest();
    }

    updateSubstep(e) {
        var stepIndex = e.target.value.split(" ")[0];
        var substepIndex = e.target.value.split(" ")[1];
        this.curStepId = this.currentWorkflow.steps[stepIndex]._id;
        this.curSubstepId = this.currentWorkflow.steps[stepIndex].substeps[substepIndex]._id;
        var substep = this.currentWorkflow.steps[stepIndex].substeps[substepIndex];

        this.$.descriptionSubstepUpdate.value = substep.description;

        this.$.updateSubstepDialog.open();
    }

    updateSubstepAction(e) {
        var body = {
            "pId": this.pId,
            "cId": window.sessionStorage.cId,
            "id": this.curSubstepId,
            "description": this.$.descriptionSubstepUpdate.value
        };

        this.$.ajaxUpdateSubstep.body = body;
        this.$.ajaxUpdateSubstep.generateRequest();
    }

    deleteSubstep(e) {
        var stepIndex = e.target.value.split(" ")[0];
        var substepIndex = e.target.value.split(" ")[1];
        this.curStepId = this.currentWorkflow.steps[stepIndex]._id;
        this.curSubstepId = this.currentWorkflow.steps[stepIndex].substeps[substepIndex]._id;

        this.$.deleteSubstepDialog.open();
    }

    deleteSubstepAction(e) {
        this.$.ajaxDeleteSubstep.generateRequest();
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
        this.workflowId = workflow._id;
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
