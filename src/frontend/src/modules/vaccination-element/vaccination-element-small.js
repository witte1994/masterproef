import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {BaseElementSmall} from '../base-element-small.js'

import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class VaccinationElementSmall extends BaseElementSmall {
    static get cssTemplate() {
        return html`
            <style>
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
                id="ajaxVaccinations"
                url="http://localhost:3000/patient/[[pId]]/vaccination"
                method="GET"
                handle-as="json"
                last-response="{{vaccinations}}"
            ></iron-ajax>
        `;
    }

    static get contentTemplate() {
        return html`
            <vaadin-grid id="vaadinGrid" style="height: 100%;" items="{{vaccinations}}">
                <vaadin-grid-column width="132px">
                    <template class="header">
                        Vaccination
                    </template>
                    <template>[[item.name]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="100px" flex-grow="0">
                    <template class="header">Next date</template>
                    <template>[[item.dateNextStr]]</template>
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

        this.title = "Vaccinations";
        this.dispatchEvent(new CustomEvent("sizeSmall", {bubbles: true, composed: true, detail: this.getMinHeight() }));

        this.update();
    }

    getMinHeight() {
        return "200px";
    }

    update(e) {
        this.$.ajaxVaccinations.generateRequest();
    }
}

window.customElements.define('vaccination-element-small', VaccinationElementSmall);
