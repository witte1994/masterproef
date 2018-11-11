import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-icon-button/paper-icon-button'
import './shared-styles.js'

/**
 * @customElement
 * @polymer
 * @extends HTMLElement
 */
export class BaseElement extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
            .containerHeader {
                width: 100%;
                display: grid;
                grid-template-columns: auto 56px;
                align-items: center;
                margin-bottom: 8px;
            }

            .buttonsHeader {
                padding: 0px;
                height: 24px;
                width: 24px;
            }

            .containerFooter {
                text-align: center;
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

        ${this.cssTemplate}
        ${this.ironAjaxTemplate}
        ${this.dialogTemplate}
        
        <div id="cardId" class="card" style="padding-bottom: 0px;">
            <div class="containerHeader">
                <h1>[[title]]</h1>

                <div>
                    <paper-icon-button class="buttonsHeader" icon="add" on-tap="openDialog"></paper-icon-button>
                    <paper-icon-button class="buttonsHeader" icon="close" on-tap="removeModule"></paper-icon-button>
                </div>
            </div>

            <div id="content">
                ${this.contentTemplate}
            </div>
                
            <div class="containerFooter">
                <paper-icon-button class="resizers" icon="expand-less" on-tap="resizeSmaller"></paper-icon-button>
                <paper-icon-button class="resizers" icon="expand-more" on-tap="resizeLarger"></paper-icon-button>
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
            },
            height: {
                type: Number,
                value: 300
            }
        };
    }

    ready() {
        super.ready();
    
        this.$.cardId.style.height = this.height + "px";

        this.setUserId();
    }

    update(e) {
        console.log("update: implement in child class");
    }

    sendUpdateSignal() {
        console.log("sendUpdateSignal: implement in child class");
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

    openDialog(e) {
        console.log("implement in child element");
    }

    removeModule(e) {
        this.dispatchEvent(new CustomEvent('delete', { composed: true }));
    }
}

window.customElements.define('base-element', BaseElement);
