'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Budget } from '@/lib/schemas';

interface BudgetVsActualChartProps {
  budgets: Budget[];
  categorySpending: { [category: string]: number };
}

export default function BudgetVsActualChart({ budgets, categorySpending }: BudgetVsActualChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const data = budgets.map(budget => ({
    category: budget.category,
    budget: budget.monthlyLimit,
    actual: categorySpending[budget.category] || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value, name) => [formatCurrency(value as number), name === 'budget' ? 'Budget' : 'Actual']}
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}