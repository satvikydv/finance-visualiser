'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, Budget, CATEGORIES } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (data: Omit<Budget, 'id'>) => void;
  onCancel?: () => void;
  existingCategories?: string[];
}

export default function BudgetForm({ 
  budget, 
  onSubmit, 
  onCancel, 
  existingCategories = [] 
}: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<Budget, 'id'>>({
    resolver: zodResolver(budgetSchema.omit({ id: true })),
    defaultValues: {
      category: budget?.category || '',
      monthlyLimit: budget?.monthlyLimit || 0,
    },
  });

  const selectedCategory = watch('category');
  const monthlyLimit = watch('monthlyLimit');

  const handleFormSubmit = async (data: Omit<Budget, 'id'>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = CATEGORIES.filter(
    category => !existingCategories.includes(category) || category === budget?.category
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthlyLimit">Monthly Limit</Label>
        <Input
          id="monthlyLimit"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={monthlyLimit}
          onChange={(e) => setValue('monthlyLimit', parseFloat(e.target.value) || 0)}
        />
        {errors.monthlyLimit && (
          <p className="text-sm text-red-600">{errors.monthlyLimit.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : (budget ? 'Update' : 'Add')} Budget
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}