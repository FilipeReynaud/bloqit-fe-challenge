import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, type PokemonDto } from '@/services/pokemon';
import { useSearchParamsState } from '@/hooks';

interface IPokemonContext {
  pokemonData: PokemonDto[];
  totalNrOfPokemon: number;
  isLoadingPokedex: boolean;
}

const PokemonContext = createContext<IPokemonContext | null>(null);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { searchTerm, selectedTypes, sortBy, sortOrder, showOnlyCaught } =
    useSearchParamsState();

  const { data, isLoading: isLoadingPokedex } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon-details'],
    queryFn: async (): Promise<PokemonDto[]> => {
      return await fetchPokemon();
    },
  });

  const pokemonData = data ?? [];

  const filteredPokemon = pokemonData.filter((pokemon) => {
    const shouldFilterBySearchString = !!searchTerm;
    const shouldFilterByType = selectedTypes.length > 0;

    if (shouldFilterByType) {
      const types = pokemon.types.map((type) => type.type.name);
      const hasType = types.some((type) => selectedTypes.includes(type));
      if (!hasType) {
        return false;
      }
    }

    if (shouldFilterBySearchString) {
      const isNameMatch = pokemon.name.includes(searchTerm);
      if (!isNameMatch) {
        return false;
      }
    }

    return true;
  });

  const sortedPokemon = filteredPokemon.sort((pokemon1, pokemon2) => {
    const sortFactor = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'name')
      return pokemon1.name.localeCompare(pokemon2.name) * sortFactor;

    return (pokemon1[sortBy] - pokemon2[sortBy]) * sortFactor;
  });

  return (
    <PokemonContext.Provider
      value={{
        pokemonData: sortedPokemon,
        totalNrOfPokemon: pokemonData.length,
        isLoadingPokedex,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonData = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonData must be used within PokemonProvider');
  }

  return context;
};
