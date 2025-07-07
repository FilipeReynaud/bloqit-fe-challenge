import { createContext, useContext, useState } from 'react';

type CaughtPokemon = {
  [k: string]: Date;
};

interface IPokedexContext {
  selectedPokemonIds: number[];
  selectPokemon: (id: number) => void;
  unSelectPokemon: (id: number | number[]) => void;
  caughtPokemon: CaughtPokemon;
  catchPokemon: (id: number) => void;
  releasePokemon: (id: number) => void;
}

const PokedexContext = createContext<IPokedexContext | null>(null);

export const PokedexProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon>({});

  const selectPokemon = (id: number) => {
    setSelectedPokemonIds((prev) => [...prev, id]);
  };

  const unSelectPokemon = (id: number | number[]) => {
    const idsToFilter = typeof id === 'number' ? [id] : id;
    setSelectedPokemonIds((prev) =>
      prev.filter((pokemonId) => !idsToFilter.includes(pokemonId))
    );
    idsToFilter.forEach((id) => releasePokemon(id));
  };

  const catchPokemon = (id: number) => {
    setCaughtPokemon((prev) => ({
      ...prev,
      [id]: new Date(),
    }));
  };

  const releasePokemon = (id: number) => {
    setCaughtPokemon((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
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
