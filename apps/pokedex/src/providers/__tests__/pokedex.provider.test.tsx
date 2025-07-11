import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokedexProvider, usePokedex } from '../pokedex.provider';

const mockCacheService = {
  set: jest.fn(),
  get: jest.fn(),
};

jest.mock('@/services/cache', () => ({
  CacheService: {
    getInstance: () => mockCacheService,
  },
}));

describe('PokedexProvider', () => {
  beforeEach(() => {
    mockCacheService.set.mockClear();
    mockCacheService.get.mockClear();
    mockCacheService.get.mockResolvedValue(undefined);
  });

  function setup(children: React.ReactNode) {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <PokedexProvider>{children}</PokedexProvider>
      </QueryClientProvider>
    );
  }

  it('initializes caughtPokemon from cache', async () => {
    // Arrange
    const caught = { 1: { timestamp: new Date(), notes: 'test' } };
    mockCacheService.get.mockResolvedValueOnce(caught);
    let context: any;
    function Consumer() {
      context = usePokedex();
      return null;
    }

    // Act
    await act(async () => {
      setup(<Consumer />);
    });

    // Assert (wait for state update)
    await waitFor(() => {
      expect(context.caughtPokemon).toEqual(caught);
    });
  });

  it('selects and unselects pokemon', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokedex();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Act
    act(() => {
      context.selectPokemon(1);
      context.selectPokemon([2, 3]);
      context.unSelectPokemon(2);
    });

    // Assert
    expect(context.selectedPokemonIds).toEqual([1, 3]);
  });

  it('catches a pokemon and updates cache', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokedex();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });

    // Act
    act(() => {
      context.catchPokemon(42);
    });

    // Assert
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'caughtPokemon',
      expect.objectContaining({ 42: expect.any(Object) })
    );
    expect(context.caughtPokemon[42]).toBeDefined();
  });

  it('releases a pokemon and updates cache', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokedex();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });
    act(() => {
      context.catchPokemon(99);
    });

    // Act
    act(() => {
      context.releasePokemon(99);
    });

    // Assert
    expect(mockCacheService.set).toHaveBeenCalledWith('caughtPokemon', {});
    expect(context.caughtPokemon[99]).toBeUndefined();
  });

  it('adds a note to a caught pokemon and updates cache', async () => {
    // Arrange
    let context: any;
    function Consumer() {
      context = usePokedex();
      return null;
    }
    await act(async () => {
      setup(<Consumer />);
    });
    act(() => {
      context.catchPokemon(7);
    });

    // Act
    act(() => {
      context.onAddNote(7, 'my note');
    });

    // Assert
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'caughtPokemon',
      expect.objectContaining({
        7: expect.objectContaining({ notes: 'my note' }),
      })
    );
    expect(context.caughtPokemon[7].notes).toBe('my note');
  });
});
