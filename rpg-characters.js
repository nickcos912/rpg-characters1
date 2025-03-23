/**
 * Copyright 2025 nickcos912
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';


/**
 * `rpg-characters`
 * 
 * @demo index.html
 * @element rpg-characters
 */
export class GithubRpgContributors extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "rpg-characters";
  }

  constructor() {
    super();
    this.items = []
    this.org=''
    this.repo=''
    this.title = "";
    this.limit = 25;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      items: { type: Array},
      org: {type: String},
      repo: {type: String},
      limit: {type: Number}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--rpg-characters-label-font-size, var(--ddd-font-size-s));
      }
      .rpg-wrapper{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      }

      .character-stuff {
        padding: var(--ddd-spacing-3);
        text-align: center;
        min-width: 176px;
      }

      .contdetails {
        display: flex;
        flex-direction: column;
        margin: var(--ddd-spacing-3);
      }

      .header {
        text-align: center;
        margin: 0 auto;
      }
      h3 {
        display: inline-block;
      }
    `];
  }

  updated(changedProperties){
    super.updated(changedProperties);
    if (changedProperties.has('org') || changedProperties.has('repo')){
      this.getData();
    }
  }
getData() {
  const url = `https://api.github.com/repos/${this.org}/${this.repo}/contributors`;
  try {
    fetch(url).then(d => d.ok ? d.json(): {}).then(data => {
      if (data) {
        this.items = [];
        this.items = data;
      }});
  } catch (error) {
    console.error("HI");
  }}

  render() {
    return html`
    <div class="header">
      <h3>GitHub Repo: <a href="https://github.com/${this.org}/${this.repo}">${this.org}/${this.repo}</a></h3>
    </div>
    <slot></slot>
    <div class="rpg-wrapper">
    ${this.items.filter((item, index) => index < this.limit).map((item) => 
        html`
        <div class="character-stuff">
        <rpg-character  seed="${item.login}"></rpg-character>
          <div class="contdetails">
          <a href=https://github.com/${item.login}>${item.login}</a>
          Contributions: ${item.contributions}
          </div>
          </div>
        `)}
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

globalThis.customElements.define(GithubRpgContributors.tag, GithubRpgContributors);