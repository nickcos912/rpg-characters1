/**
 * Copyright 2025 nickcos912
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `rpg-characters`
 * 
 * @demo index.html
 * @element rpg-characters
 */
export class RpgCharacters extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "rpg-characters";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/rpg-characters.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--rpg-characters-label-font-size, var(--ddd-font-size-s));
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3><span>${this.t.title}:</span> ${this.title}</h3>
  <slot></slot>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
render() {
  return html`
  <h2>${this.title}</h2>
  <details open>
    <summary>Search inputs</summary>
    <div>
      <input id="input" placeholder="Search NASA images" @input="${this.inputChanged}" />
    </div>
  </details>
  <div class="results">
    ${this.items.map((item, index) => html`
    <nasa-image
      source="${item.links[0].href}"
      title="${item.data[0].title}"
    ></nasa-image>
    `)}
  </div>
  `;
}

inputChanged(e) {
  this.value = this.shadowRoot.querySelector('#input').value;
}
// life cycle will run when anything defined in `properties` is modified
updated(changedProperties) {
  // see if value changes from user input and is not empty
  if (changedProperties.has('value') && this.value) {
    this.updateResults(this.value);
  }
  else if (changedProperties.has('value') && !this.value) {
    this.items = [];
  }
  // @debugging purposes only
  if (changedProperties.has('items') && this.items.length > 0) {
    console.log(this.items);
  }
}

updateResults(value) {
  this.loading = true;
  fetch(`https://images-api.nasa.gov/search?media_type=image&q=${value}`).then(d => d.ok ? d.json(): {}).then(data => {
    if (data.collection) {
      this.items = [];
      this.items = data.collection.items;
      this.loading = false;
    }  
  });
}
globalThis.customElements.define(RpgCharacters.tag, RpgCharacters);