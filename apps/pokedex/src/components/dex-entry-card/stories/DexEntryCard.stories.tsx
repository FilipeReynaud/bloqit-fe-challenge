import { DexEntryCard, type DexEntryCardProps } from '../DexEntryCard';
import type { Meta, StoryFn } from '@storybook/react';
import type { PokemonDto } from '@/services';

const meta: Meta<typeof DexEntryCard> = {
  component: DexEntryCard,
  title: 'DexEntryCard',
};
export default meta;

const pokemon: PokemonDto = {
  height: 7,
  id: 1,
  name: 'bulbasaur',
  species: {
    url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
  },
  sprites: {
    back_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    back_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    front_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    },
  },
  stats: [
    {
      base_stat: 45,

      stat: {
        name: 'hp',
      },
    },
    {
      base_stat: 49,

      stat: {
        name: 'attack',
      },
    },
    {
      base_stat: 49,

      stat: {
        name: 'defense',
      },
    },
    {
      base_stat: 65,

      stat: {
        name: 'special-attack',
      },
    },
    {
      base_stat: 65,

      stat: {
        name: 'special-defense',
      },
    },
    {
      base_stat: 45,

      stat: {
        name: 'speed',
      },
    },
  ],
  types: [
    {
      type: {
        name: 'grass',
      },
    },
    {
      type: {
        name: 'poison',
      },
    },
  ],
  weight: 69,
  description:
    'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.',
};

const Template: StoryFn<DexEntryCardProps> = (args) => {
  return <DexEntryCard {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  pokemon,
};
