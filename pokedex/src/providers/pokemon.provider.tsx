import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, type PokemonDto } from '@/services/pokemon';

interface IPokemonContext {
  pokemonData: PokemonDto[];
  isLoadingPokedex: boolean;
}

const PokemonContext = createContext<IPokemonContext | null>(null);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading: isLoadingPokedex } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon-details'],
    queryFn: async (): Promise<PokemonDto[]> => {
      return await fetchPokemon();
    },
  });

  const pokemonData = data ?? [];

  return (
    <PokemonContext.Provider value={{ pokemonData, isLoadingPokedex }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokedex = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokedex must be used within PokemonProvider');
  }

  return context;
};
