import { test, expect } from '@playwright/test';
import { DexControlsPage } from '../pages/DexControlsPage';
import { PokedexPage } from '../pages/PokedexPage';

const mockPokemonList = [
  {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    types: [{ type: { name: 'grass' } }],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
      { base_stat: 49, stat: { name: 'defense' } },
      { base_stat: 45, stat: { name: 'speed' } },
      { base_stat: 65, stat: { name: 'special_attack' } },
      { base_stat: 65, stat: { name: 'special_defense' } },
    ],
    sprites: {
      other: {
        'official-artwork': { front_default: 'https://img.url/bulba.png' },
      },
    },
    description: 'A seed Pokémon.',
    species: {
      url: 'https://pokeapi.co/api/v2/pokemon-species/1',
    },
  },
  {
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    types: [{ type: { name: 'grass' } }],
    stats: [
      { base_stat: 60, stat: { name: 'hp' } },
      { base_stat: 62, stat: { name: 'attack' } },
      { base_stat: 63, stat: { name: 'defense' } },
      { base_stat: 60, stat: { name: 'speed' } },
      { base_stat: 80, stat: { name: 'special_attack' } },
      { base_stat: 80, stat: { name: 'special_defense' } },
    ],
    sprites: {
      other: {
        'official-artwork': { front_default: 'https://img.url/ivy.png' },
      },
    },
    description: 'A seed Pokémon evolved.',
    species: {
      url: 'https://pokeapi.co/api/v2/pokemon-species/2',
    },
  },
];

test.beforeEach(async ({ page }) => {
  // Arrange: Mock all main API endpoints
  await page.route(
    'https://pokeapi.co/api/v2/pokemon-species?*',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: mockPokemonList.length,
          next: null,
          previous: null,
          results: mockPokemonList.map((p) => ({
            name: p.name,
            url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
          })),
        }),
      });
    }
  );

  await page.route('https://pokeapi.co/api/v2/pokemon/*', async (route) => {
    const id = route.request().url().split('/').filter(Boolean).pop();
    const pokemon = mockPokemonList.find((p) => String(p.id) === id);

    if (pokemon) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pokemon),
      });
    } else {
      await route.abort();
    }
  });

  await page.route(
    'https://pokeapi.co/api/v2/pokemon-species/*',
    async (route) => {
      const id = route.request().url().split('/').filter(Boolean).pop();
      const pokemon = mockPokemonList.find((p) => String(p.id) === id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          flavor_text_entries: [
            {
              language: { name: 'en' },
              flavor_text: pokemon?.description || 'No description.',
            },
          ],
        }),
      });
    }
  );
});

test.describe('Pokedex', () => {
  test('should search for a pokemon', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    const pokedex = new PokedexPage(page);
    await page.goto('/');

    // Act
    await controls.search('bulba');
    const names = await pokedex.getVisiblePokemonNames();

    // Assert
    expect(names).toContain('bulbasaur');
    expect(names).not.toContain('ivysaur');
  });
  test('should sort by name', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    const pokedex = new PokedexPage(page);
    await page.goto('/');

    // Act
    await controls.selectSortBy('Name');
    const names = await pokedex.getVisiblePokemonNames();

    // Assert
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
  test('should toggle sort order', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    const pokedex = new PokedexPage(page);
    await page.goto('/');
    await controls.selectSortBy('Name');
    const before = await pokedex.getVisiblePokemonNames();

    // Act
    await controls.toggleSortOrder();
    const after = await pokedex.getVisiblePokemonNames();

    // Assert
    expect(after).toEqual([...before].reverse());
  });
  test('should switch between grid and table views', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    await page.goto('/');

    // Act
    await controls.switchToTableView();

    // Assert
    await expect(page.locator('table')).toBeVisible();

    // Act
    await controls.switchToGridView();

    // Assert
    await expect(
      page.locator('[data-testid="pokemon-card"]').first()
    ).toBeVisible();
  });
  test('should filter by caught only', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    const pokedex = new PokedexPage(page);
    await page.goto('/');
    await pokedex.catchOne(0);

    // Act
    await controls.toggleCaughtOnly();

    // Assert
    const cards = page.locator('[data-testid="pokemon-card"]');
    const count = await cards.count();
    expect(count).toBe(1);
  });
  test('should open type filter and select a type', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    await page.goto('/');

    // Act
    await controls.openTypeFilter();
    await controls.selectType('grass');

    // Assert
    const cards = page.locator('[data-testid="pokemon-card"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText(/grass/i);
    }

    // Act
    await controls.clearAllTypes();

    // Assert
    const afterClearCount = await cards.count();
    expect(afterClearCount).toBeGreaterThanOrEqual(count);
  });
  test('should export CSV', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    await page.goto('/');

    // Act
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      controls.exportCSV(),
    ]);

    // Assert
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });
  test('should release selected pokemon', async ({ page }) => {
    // Arrange
    const controls = new DexControlsPage(page);
    const pokedex = new PokedexPage(page);
    await page.goto('/');
    await pokedex.catchOne(0);
    const firstCard = pokedex.pokemonCards.first();
    const checkbox = firstCard.locator('[data-testid="pokemon-checkbox"]');

    // Act
    await checkbox.check();
    await controls.releaseSelected();

    // Assert
    await expect(checkbox).not.toBeVisible();
  });
});
