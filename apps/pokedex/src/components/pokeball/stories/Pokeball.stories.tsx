import type { Meta, StoryFn } from '@storybook/react';
import { Pokeball, PokeballProps } from '../Pokeball';

const meta: Meta<typeof Pokeball> = {
  title: 'Pokeball',
  component: Pokeball,
};

export default meta;

const Template: StoryFn<PokeballProps> = (args) => {
  return <Pokeball {...args} />;
};

export const Caught = Template.bind({});
Caught.args = {
  isCaught: true,
};

export const NotCaught = Template.bind({});
NotCaught.args = {
  isCaught: false,
};
