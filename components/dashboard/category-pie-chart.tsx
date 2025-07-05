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
import { useMemo, useEffect, useState } from 'react';

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface CategoryPieChartProps {
  data: { category: string; amount: number }[];
}

// Bright, vibrant colors that work well on dark backgrounds
const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { currency } = useCurrency();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => ({
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: COLORS,
        borderColor: isDarkMode ? '#1f2937' : '#e5e7eb',
        borderWidth: 2,
        hoverBorderColor: isDarkMode ? '#374151' : '#d1d5db',
        hoverBorderWidth: 3,
      },
    ],
  }), [data, isDarkMode]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          font: { size: 11 },
          color: isDarkMode ? '#ffffff' : '#000000',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((sum: number, v: number) => sum + v, 0);
                const percent = total > 0 ? (value / total) * 100 : 0;
                return {
                  text: `${label} (${percent.toFixed(1)}%)`,
                  fillStyle: COLORS[i % COLORS.length],
                  strokeStyle: COLORS[i % COLORS.length],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? '#374151' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
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
  }), [currency, formatCurrency, isDarkMode]);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground text-center">
              No category data available.
            </p>
          </div>
        ) : (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Pie data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}