'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/schemas';
import StatsCards from '@/components/dashboard/stats-cards';
import MonthlyExpensesChart from '@/components/dashboard/monthly-expenses-chart';
import CategoryPieChart from '@/components/dashboard/category-pie-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the database
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        setTransactions(data.transactions);
        setMonthlyData(data.monthlyData);
        setCategoryData(data.categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty data on error
        setTransactions([]);
        setMonthlyData([]);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetUsage = monthlyExpenses > 0 ? (monthlyExpenses / 3000) * 100 : 0; // Assuming 3000 budget

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your financial activity.
        </p>
      </div>

      <StatsCards
        totalExpenses={totalExpenses}
        monthlyExpenses={monthlyExpenses}
        budgetUsage={budgetUsage}
        transactionCount={transactions.length}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MonthlyExpensesChart data={monthlyData} />
        <CategoryPieChart data={categoryData} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}