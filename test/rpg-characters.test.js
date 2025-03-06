import { html, fixture, expect } from '@open-wc/testing';
import "../rpg-characters.js";

describe("RpgCharacters test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <rpg-characters
        title="title"
      ></rpg-characters>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
