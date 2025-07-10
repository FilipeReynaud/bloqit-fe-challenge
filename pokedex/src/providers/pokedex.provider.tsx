import { CacheService } from '@/services/cache';
import { createContext, useContext, useEffect, useState } from 'react';

type CaughtInfo = {
  timestamp: Date;
  notes: string;
};
type CaughtPokemon = {
  [k: string]: CaughtInfo;
};

interface IPokedexContext {
  selectedPokemonIds: number[];
  selectPokemon: (id: number | number[]) => void;
  unSelectPokemon: (id: number | number[]) => void;
  caughtPokemon: CaughtPokemon;
  catchPokemon: (id: number) => void;
  releasePokemon: (id: number | number[]) => void;
  onAddNote: (id: number, note: string) => void;
}

const PokedexContext = createContext<IPokedexContext | null>(null);

export const PokedexProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon>({});

  const cacheService = CacheService.getInstance();

  useEffect(() => {
    const init = async () => {
      const initCaughtData = await cacheService.get<CaughtPokemon>(
        'caughtPokemon'
      );

      return initCaughtData ?? {};
    };

    init().then(setCaughtPokemon);
  }, []);

  const selectPokemon = (id: number | number[]) => {
    const idsToSelect = typeof id === 'number' ? [id] : id;
    setSelectedPokemonIds((prev) => [...prev, ...idsToSelect]);
  };

  const unSelectPokemon = (id: number | number[]) => {
    const idsToFilter = typeof id === 'number' ? [id] : id;
    setSelectedPokemonIds((prev) =>
      prev.filter((pokemonId) => !idsToFilter.includes(pokemonId))
    );
  };

  const catchPokemon = (id: number) => {
    setCaughtPokemon((prev) => {
      const newCaughtData = {
        ...prev,
        [id]: {
          timestamp: new Date(),
          notes: '',
        },
      };

      cacheService.set<CaughtPokemon>('caughtPokemon', newCaughtData);
      return newCaughtData;
    });
  };

  const releasePokemon = (id: number | number[]) => {
    const idsToRelease = typeof id === 'number' ? [id] : id;
    setCaughtPokemon((prev) => {
      const copy = { ...prev };
      idsToRelease.forEach((id) => {
        delete copy[id];
      });
      cacheService.set<CaughtPokemon>('caughtPokemon', copy);
      return copy;
    });
    unSelectPokemon(idsToRelease);
  };

  const onAddNote = (id: number, note: string) => {
    setCaughtPokemon((prev) => {
      const newCaughtData = {
        ...prev,
        [id]: {
          ...prev[id],
          notes: note,
        },
      };

      cacheService.set<CaughtPokemon>('caughtPokemon', newCaughtData);
      return newCaughtData;
    });
  };

  return (
    <PokedexContext.Provider
      value={{
        selectedPokemonIds,
        selectPokemon,
        unSelectPokemon,
        caughtPokemon,
        catchPokemon,
        releasePokemon,
        onAddNote,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
};

export const usePokedex = () => {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error('usePokedex must be used within PokedexProvider');
  }

  return context;
};
