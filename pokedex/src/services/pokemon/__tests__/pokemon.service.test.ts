import {
  fetchPokemon,
  getPokemonDescription,
  exportDataToCSV,
} from '../pokemon.service';
import { api } from '../../../lib/api';
import type {
  ListPokemonDto,
  PokemonDetailsDto,
  ExportPokemonDto,
} from '../dtos';

const mockList: ListPokemonDto = {
  count: 2,
  next: '',
  previous: '',
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockDetails: PokemonDetailsDto[] = [
  {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
    sprites: {
      back_default: '',
      back_shiny: '',
      front_default: '',
      front_shiny: '',
      other: { 'official-artwork': { front_default: '' } },
    },
    stats: [],
    types: [],
  },
  {
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    species: { url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
    sprites: {
      back_default: '',
      back_shiny: '',
      front_default: '',
      front_shiny: '',
      other: { 'official-artwork': { front_default: '' } },
    },
    stats: [],
    types: [],
  },
];

const mockSpecies = [
  {
    flavor_text_entries: [
      { language: { name: 'en' }, flavor_text: 'Seed Pokémon.' },
    ],
  },
  {
    flavor_text_entries: [
      { language: { name: 'en' }, flavor_text: 'Seed Pokémon evolved.' },
    ],
  },
];

jest.mock('../../../lib/api', () => {
  return {
    api: {
      get: jest.fn().mockImplementation((url: string) => {
        if (url.startsWith('pokemon-species?'))
          return Promise.resolve(mockList);
        if (url.startsWith('pokemon/1')) return Promise.resolve(mockDetails[0]);
        if (url.startsWith('pokemon/2')) return Promise.resolve(mockDetails[1]);
        if (url.startsWith('pokemon-species/1'))
          return Promise.resolve(mockSpecies[0]);
        if (url.startsWith('pokemon-species/2'))
          return Promise.resolve(mockSpecies[1]);
        return Promise.resolve({});
      }),
    },
  };
});

describe('Pokemon Service', () => {
  describe('fetchPokemon', () => {
    it('fetches and combines pokemon data with descriptions', async () => {
      // Act
      const result = await fetchPokemon();

      // Assert
      expect(api.get).toHaveBeenCalledWith('pokemon-species?limit=1300');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[0].description).toBe('Seed Pokémon.');
      expect(result[1].name).toBe('ivysaur');
      expect(result[1].description).toBe('Seed Pokémon evolved.');
    });
  });

  describe('getPokemonDescription', () => {
    it('returns default description if no english entry', async () => {
      // Arrange
      (api.get as jest.Mock).mockImplementation((url: string) => {
        if (url.startsWith('pokemon-species/1'))
          return Promise.resolve({ flavor_text_entries: [] });
        return Promise.resolve({});
      });

      // Act
      const result = await getPokemonDescription(mockDetails[0].species.url);

      // Assert
      expect(result).toBe('No description available.');
    });
  });

  describe('exportDataToCSV', () => {
    const data: ExportPokemonDto[] = [
      {
        id: 1,
        name: 'bulbasaur',
        height: '7',
        weight: '69',
        types: ['grass', 'poison'],
        hp: 45,
        attack: 49,
        defense: 49,
        special_attack: 65,
        special_defense: 65,
        speed: 45,
        caught: 'Yes',
        caught_at: '2024-01-01',
        note: 'Starter',
      },
    ];

    beforeEach(() => {
      jest.spyOn(document, 'createElement').mockImplementation(() => {
        return {
          set href(h: string) {},
          set download(d: string) {},
          click: jest.fn(),
        } as any;
      });

      global.URL.createObjectURL = jest.fn(() => 'blob:url');
      global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('creates and downloads a CSV file', () => {
      // Act
      exportDataToCSV(data);

      // Assert
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });
});
