'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget } from '@/lib/schemas';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import * as Recharts from 'recharts';

interface BudgetVsActualChartProps {
  budgets: Budget[];
  categorySpending: { [category: string]: number };
}

export default function BudgetVsActualChart({ budgets, categorySpending }: BudgetVsActualChartProps) {
  const { currency } = useCurrency();

  const formatCurrencyForChart = (value: number) => {
    return formatCurrency(value, currency);
  };

  const data = budgets.map(budget => ({
    category: budget.category,
    budget: budget.monthlyLimit,
    actual: categorySpending[budget.category] || 0,
  }));

  const BarChart = Recharts.BarChart as any;
  const Bar = Recharts.Bar as any;
  const XAxis = Recharts.XAxis as any;
  const YAxis = Recharts.YAxis as any;
  const CartesianGrid = Recharts.CartesianGrid as any;
  const Tooltip = Recharts.Tooltip as any;
  const Legend = Recharts.Legend as any;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 400 }}>
          <BarChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="category" 
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={formatCurrencyForChart}
              width={80}
            />
            <Tooltip 
              formatter={(value: any, name: any) => [formatCurrencyForChart(value as number), name === 'budget' ? 'Budget' : 'Actual']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="Actual" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}