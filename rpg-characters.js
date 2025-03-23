/**
 * Copyright 2025 nickcos912
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';


/**
 * `github-rpg-contributors`
 * 
 * @demo index.html
 * @element github-rpg-contributors
 */
export class GithubRpgContributors extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "github-rpg-contributors";
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
        font-size: var(--github-rpg-contributors-label-font-size, var(--ddd-font-size-s));
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

  updated(changedProperties) {
    super.updated(changedProperties);
  
    if ((changedProperties.has('org') || changedProperties.has('repo')) && this.org && this.repo) {
      this.getData();
    }
  
    // 🔥 Trigger redraw
    setTimeout(() => {
      this.shadowRoot?.querySelectorAll('rpg-character').forEach((el) => {
        if (typeof el.draw === 'function') {
          el.draw();
        }
      });
    }, 100);
  }

  getData() {
    const url = `https://api.github.com/repos/${this.org}/${this.repo}/contributors`;
    console.log("Fetching contributors from", url);
  
    fetch(url)
      .then(d => {
        if (!d.ok) {
          console.error("GitHub API error:", d.status, d.statusText);
          return [];
        }
        return d.json();
      })
      .then(data => {
        console.log("Contributors received:", data);
        this.items = Array.isArray(data) ? data : [];
      })
      .catch(error => {
        console.error("Fetch failed:", error);
      });
  }

  render() {
    return html`
      <div class="header">
        <h3>GitHub Repo: <a href="https://github.com/${this.org}/${this.repo}">${this.org}/${this.repo}</a></h3>
      </div>
      <slot></slot>
      <div class="rpg-wrapper">
        ${this.items.slice(0, this.limit).map((item, index) => html`
          <div class="character-stuff">
            <rpg-character
              id="rpg-${item.login}-${index}"
              seed="${item.login}"
              width="128"
              height="128"
              style="width:128px; height:128px;">
            </rpg-character>
            <div class="contdetails">
              <a href="https://github.com/${item.login}">${item.login}</a>
              Contributions: ${item.contributions}
            </div>
          </div>
        `)}
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

globalThis.customElements.define(GithubRpgContributors.tag, GithubRpgContributors);

