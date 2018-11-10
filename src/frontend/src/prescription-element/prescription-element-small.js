import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class PrescriptionElementSmall extends PolymerElement {
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

            .containerHeader {
                width: 100%;
                display: grid;
                grid-template-columns: auto 28px;
                align-items: center;
                margin-bottom: 8px;
            }

            .buttonsHeader {
                padding: 0px;
                height: 24px;
                width: 24px;
            }

            .resizers {
                width: 20px;
                height: 20px;
                padding: 0px;
                margin: auto;
                display: inline-block;
            }

            .card {
                display: grid;
                grid-template-rows: 36px auto 21px;
            }
        </style>

        <iron-ajax 
            id="ajaxPrescriptionsByDate"
            url="http://localhost:3000/user/[[userId]]/prescription/[[currTime]]\&[[currTime]]"
            method="GET"
            handle-as="json"
            last-response="{{prescriptions}}"
        ></iron-ajax>

        <div id="cardId" class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>Current medication</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div>
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
            </div>

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
            currTime: {
                type: Number
            }
        };
    }

    ready() {
        super.ready();

        this.height = 210;
        this.$.cardId.style.height = this.height + "px";

        this.setUserId();

        var todayStr = (new Date()).toISOString().substring(0,10) + "T00:00:00.000Z";
        var today = new Date(todayStr);

        this.currTime = today.getTime();
        this.$.ajaxPrescriptionsByDate.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    resizeSmaller(e) {
        if (this.height > 200)
            this.height -= 50;
        
        this.$.cardId.style.height = this.height + "px";
    }

    resizeLarger(e) {
        this.height += 50;
        this.$.cardId.style.height = this.height + "px";
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('prescription-element-small', PrescriptionElementSmall);
