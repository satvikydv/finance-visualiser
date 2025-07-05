'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface CategoryPieChartProps {
  data: { category: string; amount: number }[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { currency } = useCurrency();

  const chartData = useMemo(() => ({
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, v: number) => sum + v, 0);
            const percent = total > 0 ? (value / total) * 100 : 0;
            return `${formatCurrency(value, currency)} (${percent.toFixed(1)}%)`;
          },
        },
      },
    },
  }), [currency, formatCurrency]);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No category data available.
          </p>
        ) : (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Pie data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}