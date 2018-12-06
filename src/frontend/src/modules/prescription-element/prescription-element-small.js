import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElementSmall} from '../base-element-small.js'

import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PrescriptionElementSmall extends BaseElementSmall {
    static get cssTemplate() {
        return html`
            <style>
                .icon {
                    height: 22px;
                    width: 22px;
                }

                .green {
                    color: #4CAF50;
                }

                .red {
                    color: #E64A19;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxPrescriptionsByDate"
                url="http://localhost:3000/patient/[[pId]]/prescription/[[currTime]]\&[[currTime]]"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid theme="compact" id="vaadinGrid" style="height: 100%;" items="{{prescriptions}}">
                <vaadin-grid-column width="38px" flex-grow="0">
                    <template class="header"><iron-icon title="Interaction" style="width: 20px; height: 20px; color: #757575;" icon="flag"></iron-icon></template>
                    <template>
                        <div>
                            <iron-icon class$="icon {{getInteractionColor(item.medication)}}" title="{{getInteractionTitle(item.medication)}}" icon$="{{getInteractionIcon(item.medication)}}"></iron-icon>
                        </div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column width="122px">
                    <template class="header">
                        Medicine
                    </template>
                    <template>[[item.medication.name]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="72px" flex-grow="0">
                    <template class="header">Dosage</template>
                    <template>[[item.dosage.morning]]/[[item.dosage.noon]]/[[item.dosage.evening]]/[[item.dosage.bed]]</template>
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

        this.title = "Current medication";
        this.dispatchEvent(new CustomEvent("sizeSmall", {bubbles: true, composed: true, detail: this.getMinHeight() }));

        var todayStr = (new Date()).toISOString().substring(0,10) + "T00:00:00.000Z";
        var today = new Date(todayStr);

        this.currTime = today.getTime();
        this.update();
    }

    getInteractionColor(medicine) {
        if (this.interactionCheck(medicine.interactsWith).length == 0)
            return "green";
        return "red";
    }

    getInteractionTitle(medicine) {
        var interactions = this.interactionCheck(medicine.interactsWith);
        if (interactions.length == 0)
            return "No interaction present.";

        var str = "Interaction alert: " + this.getInteractionString(interactions);
        return str;
    }

    getInteractionIcon(medicine) {
        if (this.interactionCheck(medicine.interactsWith).length == 0)
            return "check-circle";
        return "report-problem";
    }

    getInteractionString(meds) {
        var str = "";
        for (var i = 0; i < meds.length; i++) {
            str += meds[i];
            if (i < meds.length - 1) 
                str += ", ";
        }

        return str;
    }

    interactionCheck(interactingMeds) {
        var foundInteractions = [];

        for (var i = 0; i < this.prescriptions.length; i++) {
            for (var j = 0; j < interactingMeds.length; j++) {
                if (this.prescriptions[i].medication.name == interactingMeds[j])
                    foundInteractions.push(interactingMeds[j]);
            }
        }

        return foundInteractions.filter(function(item, pos) {
            return foundInteractions.indexOf(item) == pos;
        });
    }

    getMinHeight() {
        return "140px";
    }

    update(e) {
        this.$.ajaxPrescriptionsByDate.generateRequest();
    }
}

window.customElements.define('prescription-element-small', PrescriptionElementSmall);
