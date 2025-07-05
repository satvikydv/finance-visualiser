'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  totalExpenses: number;
  monthlyExpenses: number;
  budgetUsage: number;
  transactionCount: number;
}

export default function StatsCards({ 
  totalExpenses, 
  monthlyExpenses, 
  budgetUsage, 
  transactionCount 
}: StatsCardsProps) {
  const { currency } = useCurrency();

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses, currency),
      icon: DollarSign,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(monthlyExpenses, currency),
      icon: TrendingDown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Budget Usage',
      value: `${budgetUsage.toFixed(1)}%`,
      icon: PiggyBank,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Transactions',
      value: transactionCount.toString(),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}