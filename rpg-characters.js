/**
 * Copyright 2025 nickcos912
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';

export class GithubRpgContributors extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() { return "github-rpg-contributors"; }

  constructor() {
    super();
    this.items = [];
    this.org = '';
    this.repo = '';
    this.title = "";
    this.limit = 25;
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      items: { type: Array },
      org: { type: String },
      repo: { type: String },
      limit: { type: Number }
    };
  }

  static get styles() {
    return [super.styles, css`
      :host {
        display: block;
        font-family: var(--ddd-font-navigation);
      }
      .rpg-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .character-stuff {
        padding: var(--ddd-spacing-3);
        text-align: center;
        min-width: 176px;
      }
      .contDetails {
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

  updated(changedProps) {
      super.updated(changedProps);
      if ((changedProps.has("org") || changedProps.has("repo")) && this.org && this.repo) {
        this.getData();
      }

    // 🔥 force re-rendering of RPG characters after update
    setTimeout(() => {
      this.shadowRoot?.querySelectorAll('rpg-character').forEach((el) => {
        el.draw?.();
      });
    }, 100);
  }

  getData() {
      const url = `https://api.github.com/repos/${this.org}/${this.repo}/contributors`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          this.items = Array.isArray(data) ? data : [];
        })
        .catch(err => console.error(err));
    }

    render() {
      return html`
        <div class="rpg-wrapper">
          ${this.items.slice(0, this.limit).map(item => html`
            <div class="character-stuff">
              <rpg-character seed="${item.login}" width="128" height="128"></rpg-character>
              <div class="contDetails">
                <a href="https://github.com/${item.login}" target="_blank">${item.login}</a><br/>
                Contributions: ${item.contributions}
              </div>
            </div>
          `)}
        </div>
      `;
    }
}

globalThis.customElements.define(GithubRpgContributors.tag, GithubRpgContributors);