import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/db-operations';
import { transactionSchema } from '@/lib/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('Updating transaction with data:', body);
    
    // Convert date string to Date object before validation
    const dataWithDate = {
      ...body,
      date: new Date(body.date),
    };
    console.log('Data with converted date:', dataWithDate);
    
    // Validate the transaction data
    const validatedData = transactionSchema.parse(dataWithDate);
    console.log('Validated transaction data:', validatedData);
    
    const transaction = await DatabaseOperations.updateTransaction(params.id, validatedData);
    console.log('Updated transaction:', transaction);
    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting transaction with id:', params.id);
    await DatabaseOperations.deleteTransaction(params.id);
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 