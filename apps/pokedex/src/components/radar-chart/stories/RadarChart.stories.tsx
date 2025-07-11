import type { Meta, StoryFn } from '@storybook/react';
import {
  RadarChart,
  type RadarChartProps,
  type ChartDataPoint,
} from '../RadarChart';

const meta: Meta<typeof RadarChart> = {
  title: 'RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Stats = { stat: string; value: number };

const sampleData: ChartDataPoint<Stats>[] = [
  { stat: 'HP', value: 45 },
  { stat: 'Attack', value: 49 },
  { stat: 'Defense', value: 49 },
  { stat: 'Special Attack', value: 65 },
  { stat: 'Special Defense', value: 65 },
  { stat: 'Speed', value: 45 },
];

const Template: StoryFn<RadarChartProps<Stats>> = (args) => {
  return (
    <div className="h-64 w-64">
      <RadarChart {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  data: sampleData,
};
