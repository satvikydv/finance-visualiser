import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/db-operations';
import { budgetSchema } from '@/lib/schemas';
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate the budget data
    const validatedData = budgetSchema.parse(body);
    
    const budget = await DatabaseOperations.updateBudget(params.id, validatedData);
    return NextResponse.json({ budget });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DatabaseOperations.deleteBudget(params.id);
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
} 