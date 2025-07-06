import { api } from '@/lib/api';
import type { PokemonType } from '@/shared';

type PokemonUrl = `https://pokeapi.co/api/v2/pokemon/${string}/`;
type SpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${string}/`;
type PokemonGetAllResult = {
  count: number;
  next: string;
  previous: string;
  results: { name: string; url: PokemonUrl }[];
};
type PokemonGetDataResult = {
  id: number;
  name: string;
  height: number;
  weight: number;
  species: { url: SpeciesUrl };
  sprites: {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
  };
  stats: { base_stat: number; stat: { name: string } }[];
  types: {
    type: { name: PokemonType };
  }[];
};

export type TPokemonData = PokemonGetDataResult & { description: string };

export type GetAllDto = Array<TPokemonData>;

const getPokemonDescription = async (speciesUrl: SpeciesUrl) => {
  try {
    const pokemonId: string = speciesUrl.split('/')[6];
    const speciesData = await api.get(`pokemon-species/${pokemonId}`);
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en'
    );
    return (
      englishEntry?.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') ||
      'No description available.'
    );
  } catch (error) {
    return 'No description available.';
  }
};

export const getAll = async (): Promise<GetAllDto> => {
  const data: PokemonGetAllResult = await api.get('pokemon');
  console.log(data);

  const pokemonDetails = await Promise.all(
    data.results.map(async ({ url }) => {
      const pokemonId: string = url.split('/')[6];
      const pokemonData: PokemonGetDataResult = await api.get(
        `pokemon/${pokemonId}`
      );

      const description: string = await getPokemonDescription(
        pokemonData.species.url
      );

      return {
        ...pokemonData,
        description,
      };
    })
  );

  return pokemonDetails;
};
