'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget } from '@/lib/schemas';
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
import { useMemo, useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface BudgetVsActualChartProps {
  budgets: Budget[];
  categorySpending: { [category: string]: number };
}

export default function BudgetVsActualChart({ budgets, categorySpending }: BudgetVsActualChartProps) {
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

  const chartData = useMemo(() => {
    const data = budgets.map(budget => ({
      category: budget.category,
      budget: budget.monthlyLimit,
      actual: categorySpending[budget.category] || 0,
    }));

    return {
      labels: data.map(item => item.category),
      datasets: [
        {
          label: 'Budget',
          data: data.map(item => item.budget),
          backgroundColor: '#3b82f6', // Blue
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 30,
        },
        {
          label: 'Actual Spending',
          data: data.map(item => item.actual),
          backgroundColor: '#ef4444', // Red
          borderColor: '#dc2626',
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 30,
        },
      ],
    };
  }, [budgets, categorySpending]);

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
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 },
          color: isDarkMode ? '#ffffff' : '#000000',
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 15,
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
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value, currency)}`;
          },
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
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          padding: 8,
        },
        border: {
          color: isDarkMode ? '#374151' : '#d1d5db',
          width: 1,
        },
      },
      y: {
        grid: { 
          color: isDarkMode ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          padding: 8,
          callback: function(this: any, value: string | number) {
            return formatCurrency(Number(value), currency);
          },
        },
        border: {
          color: isDarkMode ? '#374151' : '#d1d5db',
          width: 1,
        },
        beginAtZero: true,
      },
    },
  }), [currency, formatCurrency, isDarkMode]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {budgets.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground text-center">
              No budgets set. Create your first budget to see the comparison chart.
            </p>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}