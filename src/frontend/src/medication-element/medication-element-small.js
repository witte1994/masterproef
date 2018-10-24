import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class MedicationElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                width: 256px;
                font-family: 'Roboto', Helvetica, sans-serif;
            }

            vaadin-grid-cell-content {
                padding: 4px 8px 4px 8px;
            }

            .header {
                height: 45px;
            }
        </style>



        <div class="card" style="padding-bottom: 0px;">
            <h1>Current medication</h1>

            <vaadin-grid id="vaadinGrid" style="height: {{height}}px;" items="{{prescriptions}}">

                <vaadin-grid-column width="160px">
                    <template class="header">
                        Medicine
                    </template>
                    <template>[[item.medName]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="72px" flex-grow="0">
                    <template class="header">Dosage</template>
                    <template>[[item.dosage]]</template>
                </vaadin-grid-column>
            </vaadin-grid>

            <div style="text-align: center;">
            <paper-icon-button class="resizers" icon="expand-less" on-tap="resizeSmaller"></paper-icon-button>
            <paper-icon-button class="resizers" icon="expand-more" on-tap="resizeLarger"></paper-icon-button>
            </div>
        </div>
    `;
    }
    static get properties() {
        return {
            height: {
                type: Number
            },
        };
    }

    ready() {
        super.ready();
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;

        this.height = 210;

        this.prescriptions = [
            {
                _id: "lala",
                medName: "Aliceran",
                details: "Dit is een medicijn dat helpt tegen de hoofdpijn.",
                dosage: "0/1/1/0",
                start: "02/01/19",
                end: "21/01/19"
            },
            {
                _id: "lala2",
                medName: "Belraren",
                details: "Dit geneesmiddel helpt met maagklachten.",
                dosage: "0/1/1/0",
                start: "02/01/19",
                end: "21/01/19"
            }
        ];
    }

}

window.customElements.define('medication-element-small', MedicationElementSmall);
