import type { Meta, StoryFn } from '@storybook/react';
import { DexEntryCard, type DexEntryCardProps } from '../DexEntryCard';

const meta: Meta<typeof DexEntryCard> = {
  component: DexEntryCard,
  title: 'DexEntryCard',
};
export default meta;

const Template: StoryFn<DexEntryCardProps> = (args) => {
  return <DexEntryCard {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  dexId: '1',
  name: 'Bulbasaur',
  types: ['grass', 'poison'],
  sprite:
    'https://upload.wikimedia.org/wikipedia/en/2/28/Pok%C3%A9mon_Bulbasaur_art.png',
};
