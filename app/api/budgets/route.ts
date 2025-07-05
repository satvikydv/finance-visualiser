import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/db-operations';
import { budgetSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const budgets = await DatabaseOperations.getAllBudgets();
    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received budget data:', body);
    
    // Validate the budget data
    const validatedData = budgetSchema.parse(body);
    console.log('Validated budget data:', validatedData);
    
    const budget = await DatabaseOperations.createBudget(validatedData);
    console.log('Created budget:', budget);
    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
} 