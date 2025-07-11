import { api } from '@/lib/api';
import { ExportPokemonDto } from './dtos/export-pokemon.dto';
import type { ListPokemonDto, PokemonDetailsDto, PokemonDto } from './dtos';

export const getPokemonDescription = async (speciesUrl: string) => {
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

export const fetchPokemon = async (): Promise<PokemonDto[]> => {
  const data: ListPokemonDto = await api.get('pokemon-species?limit=1300');

  const pokemonDetails = await Promise.all(
    data.results.map(async ({ url }) => {
      const pokemonId: string = url.split('/')[6];
      const pokemonData: PokemonDetailsDto = await api.get(
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

export const exportDataToCSV = (data: ExportPokemonDto[]) => {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => `"${row[header as keyof typeof row]}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pokedex.csv';
  a.click();
  URL.revokeObjectURL(url);
};
