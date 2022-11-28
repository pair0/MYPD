// load Prism to be used by the web component, used for syntax highlighting.
import {syntaxHighlighting} from "{{ get_asset_url('../stylesheets/prism.css')}}" assert { type: "css" }; 
// syntaxHighlighting = require('../stylesheets/prism.css');
const prism =require('./prism.js');
// Register <code-tab> element
class CodeTab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {

    	// pass Syntax highlighting stylesheets to be used in the ShadowDOM for <code-tab> elements.
        this.shadowRoot.adoptedStyleSheets = [syntaxHighlighting];
    // The Shadow DOM HTML for a <code-tab> element.
    this.shadowRoot.innerHTML = `
        <style>
         :host{display:block;}
        </style>

       <div class="code-snippet">
           <pre><code><slot></slot></code></pre>
       </div>
       `;
  }
}
window.customElements.define("code-tab", CodeTab);