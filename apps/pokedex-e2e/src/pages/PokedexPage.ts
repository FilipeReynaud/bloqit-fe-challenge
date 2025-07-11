import { Page, Locator } from '@playwright/test';

export class PokedexPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly pokemonCards: Locator;
  readonly catchBtns: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.pokemonCards = page.locator('[data-testid="pokemon-card"]');
    this.catchBtns = page.locator('[data-testid="toggle-catch"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async getVisiblePokemonNames() {
    return this.pokemonCards
      .locator('[data-testid="pokemon-card-name"]')
      .allTextContents();
  }

  async catchOne(index: number) {
    const catchBtn = this.catchBtns.nth(index);
    if (catchBtn) await catchBtn.click();
  }
}
