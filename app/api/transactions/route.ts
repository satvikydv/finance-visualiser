import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/db-operations';
import { transactionSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const transactions = await DatabaseOperations.getAllTransactions();
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received transaction data:', body);
    
    // Convert date string to Date object before validation
    const dataWithDate = {
      ...body,
      date: new Date(body.date),
    };
    console.log('Data with converted date:', dataWithDate);
    
    // Validate the transaction data
    const validatedData = transactionSchema.parse(dataWithDate);
    console.log('Validated transaction data:', validatedData);
    
    const transaction = await DatabaseOperations.createTransaction(validatedData);
    console.log('Created transaction:', transaction);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 