import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElementSmall} from '../base-element-small.js'

import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class AllergyElementSmall extends BaseElementSmall {
    static get cssTemplate() {
        return html`
            <style>
                .circle {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    display: inline-block;
                    text-align: center;
                    line-height: 20px;
                    border-style: solid;
                    border-width: 1px;
                }

                .yellow {
                    background-color: #FFEA00;
                }

                .orange {
                    background-color: #FFA000;
                }

                .red {
                    background-color: #E64A19;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxAllergies"
                url="http://localhost:3000/patient/[[pId]]/allergy"
                method="GET"
                handle-as="json"
                last-response="{{allergies}}"
            ></iron-ajax>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" id="vaadinGrid" style="height: 100%;" items="{{allergies}}">
                <vaadin-grid-column width="36px" flex-grow="0">
                    <template class="header"><iron-icon title="Severity" style="width: 20px; height: 20px;" icon="flag"></iron-icon></template>
                    <template>
                        <div class$="circle {{getSeverityColor(item.severity)}}">
                            {{incrementSeverity(item.severity)}}
                        </div>
                    </template>
                </vaadin-grid-column>

                <vaadin-grid-column width="196px">
                    <template class="header">
                        Allergy (type)
                    </template>
                    <template>[[item.name]] ([[item.type]])</template>
                </vaadin-grid-column>
            </vaadin-grid>
        `;
    }

    static get properties() {
        return {
        };
    }

    ready() {
        super.ready();

        this.title = "Allergies";
        this.dispatchEvent(new CustomEvent("sizeSmall", {bubbles: true, composed: true, detail: this.getMinHeight() }));

        this.update();
    }

    getMinHeight() {
        return "140px";
    }

    update(e) {
        this.$.ajaxAllergies.generateRequest();
    }

    incrementSeverity(severity) {
        return severity + 1;
    }

    getSeverityColor(severity) {
        if (severity == 0 || severity == 1) {
            return "yellow";
        } 
        if (severity == 2 || severity == 3) {
            return "orange";
        }
        return "red";
    }
}

window.customElements.define('allergy-element-small', AllergyElementSmall);
