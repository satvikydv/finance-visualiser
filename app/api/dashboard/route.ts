import { NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/db-operations';

export async function GET() {
  try {
    // Fetch all required data from the database
    const [transactions, monthlyData, categoryData] = await Promise.all([
      DatabaseOperations.getAllTransactions(),
      DatabaseOperations.getMonthlyExpenses(),
      DatabaseOperations.getCategoryExpenses(),
    ]);

    return NextResponse.json({
      transactions,
      monthlyData,
      categoryData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 