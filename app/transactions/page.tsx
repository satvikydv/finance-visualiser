'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/schemas';
import TransactionForm from '@/components/transactions/transaction-form';
import TransactionsTable from '@/components/transactions/transactions-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
      console.log('Adding transaction with data:', data);
      
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      const newTransaction = await response.json();
      console.log('Transaction added successfully:', newTransaction);
      setTransactions(prev => [newTransaction.transaction, ...prev]);
      setShowForm(false);
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add transaction');
    }
  };

  const handleEditTransaction = async (data: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    try {
      console.log('Updating transaction with data:', data);
      
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      console.log('Transaction updated successfully:', updatedTransaction);
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? updatedTransaction.transaction : t)
      );
      setEditingTransaction(null);
      setShowForm(false);
      toast.success('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

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
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          Manage your financial transactions and track your expenses.
        </p>
      </div>

      <TransactionsTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDeleteTransaction}
        onAdd={handleAdd}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction || undefined}
            onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}