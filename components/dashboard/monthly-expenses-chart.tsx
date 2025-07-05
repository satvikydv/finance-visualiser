'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface MonthlyExpensesChartProps {
  data: { month: string; amount: number }[];
}

export default function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  const { currency } = useCurrency();

  const chartData = useMemo(() => ({
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Expenses',
        data: data.map((item) => item.amount),
        backgroundColor: 'hsl(var(--primary))',
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y, currency),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 12 },
          callback: function(this: any, value: string | number) {
            return formatCurrency(Number(value), currency);
          },
        },
      },
    },
  }), [currency, formatCurrency]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No monthly expense data available.
          </p>
        ) : (
          <div className="h-[300px] w-full">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}