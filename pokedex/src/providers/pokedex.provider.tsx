import { createContext, useContext, useState } from 'react';

type CaughtPokemon = {
  [k: string]: Date;
};

interface IPokedexContext {
  selectedPokemonIds: number[];
  selectPokemon: (id: number | number[]) => void;
  unSelectPokemon: (id: number | number[]) => void;
  caughtPokemon: CaughtPokemon;
  catchPokemon: (id: number) => void;
  releasePokemon: (id: number | number[]) => void;
}

const PokedexContext = createContext<IPokedexContext | null>(null);

export const PokedexProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon>({});

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
    setCaughtPokemon((prev) => ({
      ...prev,
      [id]: new Date(),
    }));
  };

  const releasePokemon = (id: number | number[]) => {
    const idsToRelease = typeof id === 'number' ? [id] : id;
    setCaughtPokemon((prev) => {
      const copy = { ...prev };
      idsToRelease.forEach((id) => {
        delete copy[id];
      });
      return copy;
    });
    unSelectPokemon(idsToRelease);
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
