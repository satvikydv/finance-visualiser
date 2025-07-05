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
        backgroundColor: '#3b82f6', // Bright blue
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 50,
        minBarLength: 10,
        hoverBackgroundColor: '#60a5fa',
        hoverBorderColor: '#3b82f6',
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 10,
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y, currency),
        },
      },
    },
    scales: {
      x: {
        grid: { 
          display: false,
          color: '#374151',
        },
        ticks: { 
          font: { size: 11 },
          color: '#9ca3af',
          padding: 8,
        },
        border: {
          color: '#374151',
          width: 1,
        },
      },
      y: {
        grid: { 
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#9ca3af',
          padding: 8,
          callback: function(this: any, value: string | number) {
            return formatCurrency(Number(value), currency);
          },
        },
        border: {
          color: '#374151',
          width: 1,
        },
        beginAtZero: true,
      },
    },
  }), [currency, formatCurrency]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground text-center">
              No monthly expense data available.
            </p>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}