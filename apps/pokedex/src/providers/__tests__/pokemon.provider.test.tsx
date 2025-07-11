import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonProvider, usePokemonData } from '../pokemon.provider';

// Mocks
const mockFetchPokemon = jest.fn();
const mockExportDataToCSV = jest.fn();
const mockUseSearchParamsState = jest.fn();
const mockUsePokedex = jest.fn();
const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('@/services/pokemon', () => ({
  fetchPokemon: (...args: any[]) => mockFetchPokemon(...args),
  exportDataToCSV: (...args: any[]) => mockExportDataToCSV(...args),
}));
jest.mock('@/hooks', () => ({
  useSearchParamsState: () => mockUseSearchParamsState(),
}));
jest.mock('../pokedex.provider', () => ({
  usePokedex: () => mockUsePokedex(),
}));
jest.mock('@/services/cache', () => ({
  CacheService: {
    getInstance: () => mockCacheService,
  },
}));

function setup(children: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>{children}</PokemonProvider>
    </QueryClientProvider>
  );
}

describe('PokemonProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParamsState.mockReturnValue({
      searchTerm: '',
      selectedTypes: [],
      sortBy: 'id',
      sortOrder: 'asc',
      showOnlyCaught: false,
    });
    mockUsePokedex.mockReturnValue({ caughtPokemon: {} });
    mockCacheService.get.mockResolvedValue(undefined);
    mockFetchPokemon.mockResolvedValue([
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
        description: '',
      },
    ]);
  });

  it('loads and provides pokemon data', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokemonData();
      return null;
    }

    // Act
    await act(async () => {
      setup(<Consumer />);
    });

    // Assert (wait for state update)
    await waitFor(() => {
      expect(context.pokemonData).toHaveLength(1);
      expect(context.pokemonData[0].name).toBe('bulbasaur');
      expect(context.totalNrOfPokemon).toBe(1);
      expect(context.isLoadingPokedex).toBe(false);
    });
  });

  it('filters by search term', async () => {
    // Arrange
    mockUseSearchParamsState.mockReturnValue({
      searchTerm: 'bulba',
      selectedTypes: [],
      sortBy: 'id',
      sortOrder: 'asc',
      showOnlyCaught: false,
    });
    let context: any;
    function Consumer() {
      context = usePokemonData();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Assert
    await waitFor(() => {
      expect(context.pokemonData).toHaveLength(1);
    });
  });

  it('filters by type', async () => {
    // Arrange
    mockUseSearchParamsState.mockReturnValue({
      searchTerm: '',
      selectedTypes: ['grass'],
      sortBy: 'id',
      sortOrder: 'asc',
      showOnlyCaught: false,
    });
    let context: any;
    function Consumer() {
      context = usePokemonData();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Assert
    await waitFor(() => {
      expect(context.pokemonData).toHaveLength(1);
    });
  });

  it('filters by caught', async () => {
    // Arrange
    mockUsePokedex.mockReturnValue({
      caughtPokemon: { 1: { timestamp: new Date(), notes: '' } },
    });
    mockUseSearchParamsState.mockReturnValue({
      searchTerm: '',
      selectedTypes: [],
      sortBy: 'id',
      sortOrder: 'asc',
      showOnlyCaught: true,
    });
    let context: any;
    function Consumer() {
      context = usePokemonData();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Assert
    await waitFor(() => {
      expect(context.pokemonData).toHaveLength(1);
    });
  });

  it('calls exportDataToCSV with correct data', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokemonData();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Wait for data to be loaded
    await waitFor(() => {
      expect(context.pokemonData).toHaveLength(1);
    });

    // Act
    await act(async () => {
      context.exportData();
    });

    // Assert
    await waitFor(() => {
      expect(mockExportDataToCSV).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'bulbasaur' })])
      );
    });
  });
});
