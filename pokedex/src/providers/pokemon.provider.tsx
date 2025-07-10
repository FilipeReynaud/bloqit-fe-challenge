import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, compareAsc, compareDesc } from 'date-fns';
import {
  fetchPokemon,
  exportDataToCSV,
  type PokemonDto,
  type ExportPokemonDto,
  Stats,
} from '@/services/pokemon';
import { useSearchParamsState } from '@/hooks';
import { usePokedex } from './pokedex.provider';
import { CacheService } from '@/services/cache';

interface IPokemonContext {
  pokemonData: PokemonDto[];
  totalNrOfPokemon: number;
  isLoadingPokedex: boolean;
  exportData: () => void;
}

const PokemonContext = createContext<IPokemonContext | null>(null);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { searchTerm, selectedTypes, sortBy, sortOrder, showOnlyCaught } =
    useSearchParamsState();
  const { caughtPokemon } = usePokedex();

  const { data, isLoading: isLoadingPokedex } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon-details'],
    queryFn: async (): Promise<PokemonDto[]> => {
      const cacheService = CacheService.getInstance();
      const cachedData = await cacheService.get<PokemonDto[]>('pokemonData');

      if (!cachedData) {
        const data = await fetchPokemon();
        await cacheService.set<PokemonDto[]>('pokemonData', data);
        return data;
      }

      return cachedData;
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

    if (showOnlyCaught) {
      const isCaught = !!caughtPokemon[pokemon.id];
      if (!isCaught) {
        return false;
      }
    }

    return true;
  });

  const sortedPokemon = filteredPokemon.sort((pokemon1, pokemon2) => {
    if (sortBy === 'caught') {
      const caught1 = caughtPokemon[pokemon1.id]?.timestamp ?? 0;
      const caught2 = caughtPokemon[pokemon2.id]?.timestamp ?? 0;

      return sortOrder === 'asc'
        ? compareAsc(caught1, caught2)
        : compareDesc(caught1, caught2);
    }

    const sortFactor = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'name')
      return pokemon1.name.localeCompare(pokemon2.name) * sortFactor;

    return (pokemon1[sortBy] - pokemon2[sortBy]) * sortFactor;
  });

  const exportData = () => {
    const getStat = (stats: Stats, key: string) => {
      const statIndex = stats.findIndex((stat) => stat.stat.name === key);
      if (statIndex < 0) return 0;
      return stats[statIndex].base_stat;
    };

    const data: ExportPokemonDto[] = pokemonData.map((pokemon) => {
      return {
        id: pokemon.id,
        name: pokemon.name,
        height: `${pokemon.height / 10} m`,
        weight: `${pokemon.weight / 10} kg`,
        types: pokemon.types.map((type) => type.type.name),
        hp: getStat(pokemon.stats, 'hp'),
        attack: getStat(pokemon.stats, 'attack'),
        defense: getStat(pokemon.stats, 'defense'),
        speed: getStat(pokemon.stats, 'speed'),
        special_attack: getStat(pokemon.stats, 'special_attack'),
        special_defense: getStat(pokemon.stats, 'special_defense'),
        caught: caughtPokemon[pokemon.id] ? 'Yes' : 'No',
        caught_at: caughtPokemon[pokemon.id]?.timestamp
          ? format(caughtPokemon[pokemon.id]?.timestamp, 'dd/MM/yyyy')
          : '--',
        note: caughtPokemon[pokemon.id]?.notes ?? '--',
      };
    });

    exportDataToCSV(data);
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemonData: sortedPokemon,
        totalNrOfPokemon: pokemonData.length,
        isLoadingPokedex,
        exportData,
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
