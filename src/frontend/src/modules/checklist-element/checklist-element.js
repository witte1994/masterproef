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
class ChecklistElement extends BaseElement {
    static get cssTemplate() {
        return html`
            <style>
                paper-input {
                    margin-top: 0px;
                    height: 50px;
                }

                #checklistContent {
                    margin: 4px;
                }

                .infoHeader {
                    display: grid;
                    grid-template-columns: auto;
                    margin-bottom: 8px;
                }

                .stepRow {
                    display: grid;
                    grid-template-columns: auto;
                }

                .striked {
                    text-decoration: line-through;
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
                auto
                id="ajaxGetChecklist"
                url="http://localhost:3000/patient/[[pId]]/checklist/"
                method="GET"
                handle-as="json"
                last-response="{{checklist}}"
                on-response="checklistReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxUpdateChecklist"
                url="http://localhost:3000/patient/[[pId]]/checklist/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                last-response="{{checklist}}"
                on-response="checklistReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCreateStep"
                url="http://localhost:3000/patient/[[pId]]/checklist/[[checklist._id]]/create"
                method="POST"
                handle-as="json"
                content-type="application/json"
                last-response="{{checklist}}"
                on-response="checklistReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxCheckStep"
                url="http://localhost:3000/patient/[[pId]]/checklist/[[checklist._id]]/check"
                method="POST"
                handle-as="json"
                content-type="application/json"
                last-response="{{checklist}}"
                on-response="checklistReceived"
            ></iron-ajax>

            <iron-ajax 
                id="ajaxUpdateStep"
                url="http://localhost:3000/patient/[[pId]]/checklist/[[checklist._id]]/update"
                method="POST"
                handle-as="json"
                content-type="application/json"
                last-response="{{checklist}}"
                on-response="checklistReceived"
            ></iron-ajax>
        `;
    }

    static get dialogTemplate() {
        return html`
            <paper-dialog id="updateChecklistDialog">
                <h2>Edit checklist</h2>

                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateChecklistAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="createStepDialog">
                <h2>Add task</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionStep" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createStepAction">Create</paper-button>
            </paper-dialog>

            <paper-dialog id="updateStepDialog">
                <h2>Edit task</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionStepUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateStepAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteStepDialog">
                <h2>Delete task</h2>
                
                <div>
                    Are you sure you want to delete this task?
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteStepAction">Delete</paper-button>
            </paper-dialog>

            <paper-dialog id="createSubstepDialog">
                <h2>Add sub-task</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionSubstep" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="createSubstepAction">Create</paper-button>
            </paper-dialog>

            <paper-dialog id="updateSubstepDialog">
                <h2>Edit sub-task</h2>
                
                <div style="width: 225px;">
                    <paper-textarea style="padding: 0px;" id="descriptionSubstepUpdate" label="Description"></paper-textarea>
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="updateSubstepAction">Edit</paper-button>
            </paper-dialog>

            <paper-dialog id="deleteSubstepDialog">
                <h2>Delete sub-task</h2>
                
                <div>
                    Are you sure you want to delete this sub-task?
                </div>

                <paper-button dialog-dismiss autofocus>Cancel</paper-button>
                <paper-button dialog-confirm on-tap="deleteSubstepAction">Delete</paper-button>
            </paper-dialog>
        `;
    }

    static get contentTemplate() {
        return html`
            <div id="checklistContent">
                <vaadin-context-menu selector=".isSelector">
                    <template>
                        <vaadin-list-box>
                            <vaadin-item on-tap="createStep">Add task</vaadin-item>
                            <hr>
                            <vaadin-item on-tap="updateChecklist">Edit checklist description</vaadin-item>
                        </vaadin-list-box>
                    </template>

                    <div class="infoHeader isSelector">
                        <div>[[checklist.description]]</div>
                    </div>
                </vaadin-context-menu>

                <dom-repeat items="{{checklist.steps}}" as="step">
                    <template>
                        <vaadin-context-menu selector=".isSelector">
                            <template>
                                <vaadin-list-box>
                                <vaadin-item value="[[step._id]]" on-tap="createSubstep">Add subtask</vaadin-item>
                                <hr>
                                <vaadin-item value="[[step]]" on-tap="updateStep">Edit task</vaadin-item>
                                <vaadin-item value="[[step._id]]" on-tap="deleteStep">Delete task</vaadin-item>
                                </vaadin-list-box>
                            </template>

                            <div class="stepRow isSelector">
                                <paper-checkbox value="[[step._id]]" checked="[[step.checked]]" on-checked-changed="checkStep">
                                    <div class$="{{getStepClass(step.checked)}}">
                                        [[step.description]]
                                    </div>
                                </paper-checkbox>
                            </div>
                        </vaadin-context-menu>

                    </template>
                </dom-repeat>
            </div>
        `;
    }

    static get dialogButtonTemplate() {
        return html`
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.title = "Checklist";
        this.dispatchEvent(new CustomEvent("size", {bubbles: true, composed: true, detail: this.getMinSizes() }));

        this.update();
    }
    
    update(e) {

    }

    getStepClass(checked) {
        if (checked)
            return "striked";
        
        return null;
    }

    checklistReceived(e) {
        //console.log(this.checklist);
    }

    updateChecklist(e) {
        this.$.descriptionUpdate.value = this.checklist.description;

        this.$.updateChecklistDialog.open();
    }

    updateChecklistAction(e) {
        var body = {
            "id": this.checklist._id,
            "cId": window.sessionStorage.cId,
            "description": this.$.descriptionUpdate.value
        };

        this.$.ajaxUpdateChecklist.body = body;
        this.$.ajaxUpdateChecklist.generateRequest();
    }

    createStep(e) {
        this.$.createStepDialog.open();
    }

    createStepAction(e) {
        var body = {
            "cId": window.sessionStorage.cId,
            "description": this.$.descriptionStep.value
        };

        this.$.ajaxCreateStep.body = body;
        this.$.ajaxCreateStep.generateRequest();
    }

    updateStep(e) {
        this.$.ajaxUpdateStep.body.id = e.target.value._id;
        
        this.$.descriptionStepUpdate.value = e.target.value.description;

        this.$.updateStepDialog.open();
    }

    updateStepAction(e) {
        this.$.ajaxUpdateStep.body.description = this.$.descriptionStepUpdate.value;
        this.$.ajaxUpdateStep.body.cId = window.sessionStorage.cId;

        this.$.ajaxUpdateStep.generateRequest();
    }

    checkStep(e) {
        this.$.ajaxCheckStep.body = {
            "id": e.srcElement.value,
            "checked": e.detail.value
        };

        this.$.ajaxCheckStep.generateRequest();
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

window.customElements.define('checklist-element', ChecklistElement);
