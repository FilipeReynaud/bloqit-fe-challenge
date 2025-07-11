'use client';

import {
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Radar,
  RadarChart as ReRadarChart,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export type ChartDataPoint<T> = {
  [k in keyof T]: string | number;
};

export interface RadarChartProps<T> {
  data: ChartDataPoint<T>[];
}

export const RadarChart = <T,>({ data }: RadarChartProps<T>) => {
  const [xAxisKey, radarDataKey] = Object.keys(data[0]);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square">
      <ReRadarChart
        data={data}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        outerRadius="80%"
      >
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis
          dataKey={xAxisKey}
          tick={({ payload, x, y, textAnchor }) => {
            const words: string[] = payload.value.split(' ');
            return (
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                fill="#000"
                fontSize={12}
                fontWeight="bold"
              >
                {words.map((word, index) => (
                  <tspan key={index} x={x} dy={index === 0 ? 0 : 14}>
                    {word}
                  </tspan>
                ))}
              </text>
            );
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 255]}
          tick={{ fontSize: 10 }}
          tickCount={6}
        />
        <PolarGrid />
        <Radar
          dataKey={radarDataKey}
          fill="var(--color-value)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </ReRadarChart>
    </ChartContainer>
  );
};
