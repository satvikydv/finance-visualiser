'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import * as Recharts from 'recharts';

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

  const formatCurrencyForChart = (value: number) => {
    return formatCurrency(value, currency);
  };

  const PieChart = Recharts.PieChart as any;
  const Pie = Recharts.Pie as any;
  const Cell = Recharts.Cell as any;
  const Tooltip = Recharts.Tooltip as any;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <PieChart width={400} height={300} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percent }: any) => `${category} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [formatCurrencyForChart(value as number), 'Amount']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}