'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import * as Recharts from 'recharts';

interface MonthlyExpensesChartProps {
  data: { month: string; amount: number }[];
}

export default function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  const { currency } = useCurrency();

  const formatCurrencyForChart = (value: number) => {
    return formatCurrency(value, currency);
  };

  const BarChart = Recharts.BarChart as any;
  const Bar = Recharts.Bar as any;
  const XAxis = Recharts.XAxis as any;
  const YAxis = Recharts.YAxis as any;
  const CartesianGrid = Recharts.CartesianGrid as any;
  const Tooltip = Recharts.Tooltip as any;

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <BarChart width={800} height={300} data={data} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={formatCurrencyForChart}
              width={80}
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrencyForChart(value as number), 'Amount']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}