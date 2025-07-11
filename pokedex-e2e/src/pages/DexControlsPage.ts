import { Page, Locator } from '@playwright/test';

export class DexControlsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly sortBySelect: Locator;
  readonly sortOrderButton: Locator;
  readonly gridViewButton: Locator;
  readonly tableViewButton: Locator;
  readonly caughtOnlyButton: Locator;
  readonly typeFilterButton: Locator;
  readonly exportButton: Locator;
  readonly releaseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.sortBySelect = page.locator('[data-testid="sort-by-select"]');
    this.sortOrderButton = page.locator(
      'button:has-text("↑"), button:has-text("↓")'
    );
    this.gridViewButton = page.locator('[data-testid="grid-view-btn"]');
    this.tableViewButton = page.locator('[data-testid="table-view-btn"]');
    this.caughtOnlyButton = page.locator('button:has-text("Caught Only")');
    this.typeFilterButton = page.locator('button:has-text("Types")');
    this.exportButton = page.locator('button:has-text("Export CSV")');
    this.releaseButton = page.locator(
      'button:has-text("Release Into The Wild")'
    );
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async selectSortBy(option: string) {
    await this.sortBySelect.click();
    await this.page.locator(`text=${option}`).click();
  }

  async toggleSortOrder() {
    await this.sortOrderButton.click();
  }

  async switchToGridView() {
    await this.gridViewButton.click();
  }

  async switchToTableView() {
    await this.tableViewButton.click();
  }

  async toggleCaughtOnly() {
    await this.caughtOnlyButton.click();
  }

  async openTypeFilter() {
    await this.typeFilterButton.click();
  }

  async selectType(type: string) {
    await this.page.locator(`label:has-text("${type}")`).click();
  }

  async clearAllTypes() {
    await this.page.locator('button:has-text("Clear All")').click();
  }

  async exportCSV() {
    await this.exportButton.click();
  }

  async releaseSelected() {
    await this.releaseButton.click();
  }
}
