import { PokemonType } from '@/shared';

type SpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${string}/`;

export type Sprites = {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
};
export type Stats = { base_stat: number; stat: { name: string } }[];
export type Types = { type: { name: PokemonType } }[];
export interface PokemonDetailsDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  species: { url: SpeciesUrl };
  sprites: Sprites;
  stats: Stats;
  types: Types;
}
