'use client';

import { useState, useEffect } from 'react';
import { Budget, Transaction } from '@/lib/schemas';
import BudgetForm from '@/components/budgets/budget-form';
import BudgetsTable from '@/components/budgets/budgets-table';
import BudgetVsActualChart from '@/components/budgets/budget-vs-actual-chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budgets and transactions from the database
        const [budgetsResponse, transactionsResponse] = await Promise.all([
          fetch('/api/budgets'),
          fetch('/api/transactions')
        ]);

        if (!budgetsResponse.ok || !transactionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const budgetsData = await budgetsResponse.json();
        const transactionsData = await transactionsResponse.json();

        setBudgets(budgetsData.budgets);
        setTransactions(transactionsData.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        // Fallback to empty data on error
        setBudgets([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categorySpending = transactions.reduce((acc, transaction) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const transactionDate = new Date(transaction.date);
    
    if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    
    return acc;
  }, {} as { [category: string]: number });

  const handleAddBudget = async (data: Omit<Budget, 'id'>) => {
    try {
      console.log('Adding budget with data:', data);
      
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to add budget');
      }

      const newBudget = await response.json();
      console.log('Budget added successfully:', newBudget);
      setBudgets(prev => [...prev, newBudget.budget]);
      setShowForm(false);
      toast.success('Budget added successfully!');
    } catch (error) {
      console.error('Error adding budget:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add budget');
    }
  };

  const handleEditBudget = async (data: Omit<Budget, 'id'>) => {
    if (!editingBudget) return;
    
    try {
      console.log('Updating budget with data:', data);
      
      const response = await fetch(`/api/budgets/${editingBudget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to update budget');
      }

      const updatedBudget = await response.json();
      console.log('Budget updated successfully:', updatedBudget);
      setBudgets(prev => 
        prev.map(b => b.id === editingBudget.id ? updatedBudget.budget : b)
      );
      setEditingBudget(null);
      setShowForm(false);
      toast.success('Budget updated successfully!');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      setBudgets(prev => prev.filter(b => b.id !== id));
      toast.success('Budget deleted successfully!');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const existingCategories = budgets.map(b => b.category);

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
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <p className="text-muted-foreground">
          Set monthly spending limits and track your budget performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <BudgetVsActualChart budgets={budgets} categorySpending={categorySpending} />
        
        <BudgetsTable
          budgets={budgets}
          categorySpending={categorySpending}
          onEdit={handleEdit}
          onDelete={handleDeleteBudget}
          onAdd={handleAdd}
        />
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={editingBudget || undefined}
            onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
            onCancel={handleCloseForm}
            existingCategories={existingCategories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}