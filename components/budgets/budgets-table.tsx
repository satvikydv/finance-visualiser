'use client';

import { useState } from 'react';
import { Budget } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';

interface BudgetsTableProps {
  budgets: Budget[];
  categorySpending: { [category: string]: number };
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function BudgetsTable({ 
  budgets, 
  categorySpending, 
  onEdit, 
  onDelete, 
  onAdd 
}: BudgetsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { currency } = useCurrency();

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = categorySpending[budget.category] || 0;
    const percentage = (spent / budget.monthlyLimit) * 100;
    const remaining = budget.monthlyLimit - spent;
    
    return {
      spent,
      percentage: Math.min(percentage, 100),
      remaining,
      isOverBudget: spent > budget.monthlyLimit,
    };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Budgets</CardTitle>
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <Alert>
            <AlertDescription>
              No budgets found. Click "Add Budget" to start tracking your spending limits!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const status = getBudgetStatus(budget);
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.category}</TableCell>
                      <TableCell>{formatCurrency(budget.monthlyLimit, currency)}</TableCell>
                      <TableCell>
                        <span className={status.isOverBudget ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                          {formatCurrency(status.spent, currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={status.remaining < 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400'}>
                          {formatCurrency(status.remaining, currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={status.percentage} 
                            className={`w-20 ${status.isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                          />
                          <span className={`text-sm font-medium ${status.isOverBudget ? 'text-red-600 dark:text-red-400' : ''}`}>
                            {status.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={() => onEdit(budget)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(budget.id!)}
                            className={`h-8 w-8 p-0 ${deleteConfirm === budget.id ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}