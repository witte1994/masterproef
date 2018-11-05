import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button'
import '@vaadin/vaadin-grid/vaadin-grid';
import '../shared-styles.js';

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
class VaccinationElementSmall extends PolymerElement {
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
        </style>

        <iron-ajax 
            id="ajaxVaccinations"
            url="http://localhost:3000/user/[[userId]]/vaccination"
            method="GET"
            handle-as="json"
            last-response="{{vaccinations}}"
        ></iron-ajax>

        <div class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>Vaccinations</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <vaadin-grid id="vaadinGrid" style="height: {{height}}px;" items="{{vaccinations}}">

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
            }
        };
    }

    ready() {
        super.ready();

        this.height = 210;
        this.setUserId();

        this.$.ajaxVaccinations.generateRequest();
    }

    setUserId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.userId = param;
    }

    resizeSmaller(e) {
        if (this.height > 210)
            this.height -= 50;
    }

    resizeLarger(e) {
        this.height += 50;
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('vaccination-element-small', VaccinationElementSmall);
