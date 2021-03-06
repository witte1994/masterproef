/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      .card {
        margin: 0px 8px 8px 8px;
        padding: 8px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        display: grid;
        grid-template-rows: 36px auto;
      }

      h1 {
        margin: 4px;
        color: #212121;
        font-size: 22px;
        font-weight: normal;
      }

      h2 {
        font-weight: normal;
      }

      vaadin-text-field {
        height: 24px;
      }

      .containerHeader {
          width: 100%;
          display: grid;
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

      vaadin-grid {
          margin-left: -8px;
          margin-right: -8px;
          border: 0px;
      }

      vaadin-grid paper-icon-button {
        color: #757575;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
