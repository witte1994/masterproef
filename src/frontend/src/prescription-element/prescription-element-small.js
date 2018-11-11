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
            <style >
                vaadin-grid-cell-content {
                    padding: 4px 8px 4px 8px;
                }

                .header {
                    height: 45px;
                }
            </style>
        `;
    }

    static get ironAjaxTemplate() {
        return html`
            <iron-ajax 
                id="ajaxPrescriptionsByDate"
                url="http://localhost:3000/user/[[userId]]/prescription/[[currTime]]\&[[currTime]]"
                method="GET"
                handle-as="json"
                last-response="{{prescriptions}}"
            ></iron-ajax>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid id="vaadinGrid" style="height: 100%;" items="{{prescriptions}}">
                <vaadin-grid-column width="160px">
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

        var todayStr = (new Date()).toISOString().substring(0,10) + "T00:00:00.000Z";
        var today = new Date(todayStr);

        this.currTime = today.getTime();
        this.update();
    }

    update(e) {
        this.$.ajaxPrescriptionsByDate.generateRequest();
    }
}

window.customElements.define('prescription-element-small', PrescriptionElementSmall);
