import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-icon-button/paper-icon-button'
import '../shared-styles.js'

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
export class BaseElementSmall extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
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

            .mainContainer {
                display: grid;
                grid-template-rows: auto;
                height: 100%;
            }

            .card {
                display: grid;
                grid-template-rows: 36px auto;
            }
        </style>

        ${this.cssTemplate}
        ${this.ironAjaxTemplate}
        ${this.dialogTemplate}
        
        <div class="mainContainer">
            <div id="cardId" class="card">
                <div class="containerHeader">
                    <h1>[[title]]</h1>

                    <div>
                    <paper-icon-button title="Remove module" class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                    </div>
                </div>

                <div id="content">
                    ${this.contentTemplate}
                </div>
            </div>
        </div>
    `;
    }

    static get cssTemplate() {
        return html`
        `;
    }

    static get ironAjaxTemplate() {
        return html`
        `;
    }

    static get dialogTemplate() {
        return html`
        `;
    }

    static get contentTemplate() {
        return html`
            <p>Fill with content</p>
        `;
    }

    static get properties() {
        return {
            title: {
                type: String,
                value: "Title"
            }
        };
    }

    ready() {
        super.ready();
        
        this.setPatientId();
    }

    update(e) {
        console.log("update: implement in child class - small");
    }

    sendUpdateSignal() {
        console.log("sendUpdateSignal: implement in child class");
    }

    setPatientId() {
        var split = document.URL.split("/");
        var param = split[split.length - 1];
        this.pId = param;
    }

    getMinHeight() {
        console.log("implement in child element");
        return "0px";
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('base-element-small', BaseElementSmall);
