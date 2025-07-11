type PokemonUrl = `https://pokeapi.co/api/v2/pokemon/${string}/`;

export type ListPokemonDto = {
  count: number;
  next: string;
  previous: string;
  results: { name: string; url: PokemonUrl }[];
};
