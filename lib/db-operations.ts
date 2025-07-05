import { dbConnect } from './mongodb';
import { Transaction, Budget } from './schemas';
import mongoose from 'mongoose';

export class DatabaseOperations {
  private static async getDb() {
    const connection = await dbConnect();
    return connection.db;
  }

  // Transaction operations
  static async getAllTransactions(): Promise<Transaction[]> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();
    return transactions.map(t => ({
      amount: t.amount,
      date: new Date(t.date),
      description: t.description,
      category: t.category,
      id: t._id.toString(),
    }));
  }

  static async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const result = await db.collection('transactions').insertOne(transaction);
    return {
      ...transaction,
      id: result.insertedId.toString(),
    };
  }

  static async updateTransaction(id: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    await db.collection('transactions').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: transaction }
    );
    return {
      ...transaction,
      id,
    };
  }

  static async deleteTransaction(id: string): Promise<void> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    await db.collection('transactions').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  }

  // Budget operations
  static async getAllBudgets(): Promise<Budget[]> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const budgets = await db.collection('budgets').find({}).toArray();
    return budgets.map(b => ({
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      id: b._id.toString(),
    }));
  }

  static async createBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const result = await db.collection('budgets').insertOne(budget);
    return {
      ...budget,
      id: result.insertedId.toString(),
    };
  }

  static async updateBudget(id: string, budget: Omit<Budget, 'id'>): Promise<Budget> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    await db.collection('budgets').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: budget }
    );
    return {
      ...budget,
      id,
    };
  }

  static async deleteBudget(id: string): Promise<void> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    await db.collection('budgets').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  }

  // Analytics operations
  static async getMonthlyExpenses(): Promise<{ month: string; amount: number }[]> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $limit: 12,
      },
    ];

    const result = await db.collection('transactions').aggregate(pipeline).toArray();
    return result.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: item.amount,
    }));
  }

  static async getCategoryExpenses(): Promise<{ category: string; amount: number }[]> {
    const db = await this.getDb();
    if (!db) throw new Error('Database connection failed');
    
    const pipeline = [
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { amount: -1 },
      },
    ];

    const result = await db.collection('transactions').aggregate(pipeline).toArray();
    return result.map(item => ({
      category: item._id,
      amount: item.amount,
    }));
  }
}