'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget } from '@/lib/schemas';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';

interface BudgetVsActualChartProps {
  budgets: Budget[];
  categorySpending: { [category: string]: number };
}

export default function BudgetVsActualChart({ budgets, categorySpending }: BudgetVsActualChartProps) {
  const { currency } = useCurrency();

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
        <div className="space-y-6">
          {data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No budgets set. Create your first budget to see the comparison chart.
            </p>
          ) : (
            data.map((item) => {
              const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={item.category} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{item.category}</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Budget: {formatCurrency(item.budget, currency)}
                      </div>
                      <div className="text-sm">
                        Actual: <span className={isOverBudget ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                          {formatCurrency(item.actual, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    {isOverBudget && (
                      <div className="text-xs text-red-600">
                        {(percentage - 100).toFixed(1)}% over budget
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}