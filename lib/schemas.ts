import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.date(),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  category: z.string().min(1, 'Category is required'),
});

export const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  monthlyLimit: z.number().min(0.01, 'Monthly limit must be greater than 0'),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type Budget = z.infer<typeof budgetSchema>;

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Rent',
  'Other',
] as const;