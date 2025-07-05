import { dbConnect } from './mongodb';
import { Transaction, Budget, CATEGORIES } from './schemas';

const sampleTransactions: Omit<Transaction, 'id'>[] = [
  {
    amount: 45.50,
    date: new Date('2024-01-15'),
    description: 'Grocery shopping at Walmart',
    category: 'Groceries',
  },
  {
    amount: 120.00,
    date: new Date('2024-01-16'),
    description: 'Monthly electricity bill',
    category: 'Bills & Utilities',
  },
  {
    amount: 25.00,
    date: new Date('2024-01-17'),
    description: 'Lunch at Chipotle',
    category: 'Food & Dining',
  },
  {
    amount: 35.00,
    date: new Date('2024-01-18'),
    description: 'Gas for car',
    category: 'Transportation',
  },
  {
    amount: 89.99,
    date: new Date('2024-01-19'),
    description: 'New headphones from Amazon',
    category: 'Shopping',
  },
  {
    amount: 15.00,
    date: new Date('2024-01-20'),
    description: 'Movie tickets',
    category: 'Entertainment',
  },
  {
    amount: 75.00,
    date: new Date('2024-01-21'),
    description: 'Doctor appointment',
    category: 'Healthcare',
  },
  {
    amount: 1500.00,
    date: new Date('2024-01-22'),
    description: 'Monthly rent payment',
    category: 'Rent',
  },
  {
    amount: 12.50,
    date: new Date('2024-01-23'),
    description: 'Coffee and breakfast',
    category: 'Food & Dining',
  },
  {
    amount: 45.00,
    date: new Date('2024-01-24'),
    description: 'Uber ride to airport',
    category: 'Transportation',
  },
  {
    amount: 200.00,
    date: new Date('2024-01-25'),
    description: 'Online course subscription',
    category: 'Education',
  },
  {
    amount: 18.00,
    date: new Date('2024-01-26'),
    description: 'Dinner at Italian restaurant',
    category: 'Food & Dining',
  },
  {
    amount: 65.00,
    date: new Date('2024-01-27'),
    description: 'Shopping at Target',
    category: 'Shopping',
  },
  {
    amount: 30.00,
    date: new Date('2024-01-28'),
    description: 'Gym membership',
    category: 'Healthcare',
  },
  {
    amount: 22.00,
    date: new Date('2024-01-29'),
    description: 'Pizza delivery',
    category: 'Food & Dining',
  },
  // February transactions
  {
    amount: 48.75,
    date: new Date('2024-02-01'),
    description: 'Weekly grocery shopping',
    category: 'Groceries',
  },
  {
    amount: 85.00,
    date: new Date('2024-02-02'),
    description: 'Internet bill',
    category: 'Bills & Utilities',
  },
  {
    amount: 28.50,
    date: new Date('2024-02-03'),
    description: 'Lunch with colleagues',
    category: 'Food & Dining',
  },
  {
    amount: 40.00,
    date: new Date('2024-02-04'),
    description: 'Car maintenance',
    category: 'Transportation',
  },
  {
    amount: 120.00,
    date: new Date('2024-02-05'),
    description: 'Concert tickets',
    category: 'Entertainment',
  },
  {
    amount: 1500.00,
    date: new Date('2024-02-06'),
    description: 'Monthly rent payment',
    category: 'Rent',
  },
  {
    amount: 95.00,
    date: new Date('2024-02-07'),
    description: 'New shoes',
    category: 'Shopping',
  },
  {
    amount: 15.75,
    date: new Date('2024-02-08'),
    description: 'Coffee and snacks',
    category: 'Food & Dining',
  },
  {
    amount: 55.00,
    date: new Date('2024-02-09'),
    description: 'Dental checkup',
    category: 'Healthcare',
  },
  {
    amount: 35.00,
    date: new Date('2024-02-10'),
    description: 'Gas station fill-up',
    category: 'Transportation',
  },
];

const sampleBudgets: Omit<Budget, 'id'>[] = [
  {
    category: 'Food & Dining',
    monthlyLimit: 400.00,
  },
  {
    category: 'Transportation',
    monthlyLimit: 200.00,
  },
  {
    category: 'Shopping',
    monthlyLimit: 300.00,
  },
  {
    category: 'Entertainment',
    monthlyLimit: 150.00,
  },
  {
    category: 'Bills & Utilities',
    monthlyLimit: 250.00,
  },
  {
    category: 'Healthcare',
    monthlyLimit: 100.00,
  },
  {
    category: 'Education',
    monthlyLimit: 200.00,
  },
  {
    category: 'Groceries',
    monthlyLimit: 300.00,
  },
  {
    category: 'Rent',
    monthlyLimit: 1500.00,
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const connection = await dbConnect();
    const db = connection.db;
    
    if (!db) {
      throw new Error('Failed to connect to database');
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('transactions').deleteMany({});
    await db.collection('budgets').deleteMany({});

    // Insert sample transactions
    console.log('📝 Inserting sample transactions...');
    const transactionResult = await db.collection('transactions').insertMany(sampleTransactions);
    // console.log(`✅ Inserted ${transactionResult.insertedIds.length} transactions`);

    // Insert sample budgets
    console.log('💰 Inserting sample budgets...');
    const budgetResult = await db.collection('budgets').insertMany(sampleBudgets);
    // console.log(`✅ Inserted ${budgetResult.insertedIds.length} budgets`);

    console.log('🎉 Database seeding completed successfully!');
    
    // Log some statistics
    const totalTransactions = await db.collection('transactions').countDocuments();
    const totalBudgets = await db.collection('budgets').countDocuments();
    
    console.log(`📊 Database now contains:`);
    console.log(`   - ${totalTransactions} transactions`);
    console.log(`   - ${totalBudgets} budgets`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
} 