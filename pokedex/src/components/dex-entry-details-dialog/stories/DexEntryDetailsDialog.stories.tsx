import type { Meta, StoryFn } from '@storybook/react';
import {
  DexEntryDetailsDialog,
  DexEntryDetailsDialogProps,
} from '../DexEntryDetailsDialog';

const meta: Meta<typeof DexEntryDetailsDialog> = {
  component: DexEntryDetailsDialog,
  title: 'DexEntryDetailsDialog',
};
export default meta;

const Template: StoryFn<DexEntryDetailsDialogProps> = (args) => {
  return <DexEntryDetailsDialog {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  onOpenChange: () => {},
  dexId: '1',
  name: 'Bulbasaur',
  description:
    'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.',
  types: ['grass', 'poison'],
  sprite:
    'https://upload.wikimedia.org/wikipedia/en/2/28/Pok%C3%A9mon_Bulbasaur_art.png',
  gallerySprites: [
    'https://upload.wikimedia.org/wikipedia/en/2/28/Pok%C3%A9mon_Bulbasaur_art.png',
    'https://upload.wikimedia.org/wikipedia/en/2/28/Pok%C3%A9mon_Bulbasaur_art.png',
    'https://upload.wikimedia.org/wikipedia/en/2/28/Pok%C3%A9mon_Bulbasaur_art.png',
  ],
  isCaught: true,
  height: 0.7,
  weight: 6.9,
  stats: [
    { baseStat: 45, stat: { name: 'HP' } },
    { baseStat: 49, stat: { name: 'Attack' } },
    { baseStat: 49, stat: { name: 'Defense' } },
    { baseStat: 65, stat: { name: 'Special Attack' } },
    { baseStat: 65, stat: { name: 'Special Defense' } },
    { baseStat: 45, stat: { name: 'Speed' } },
  ],
  toggleCaught: () => {},
  onShare: () => {},
};
