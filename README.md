# Personal Finance Tracker

A modern, full-stack personal finance management application built with Next.js, TypeScript, and MongoDB. Track your expenses, manage budgets, and gain insights into your spending habits with a beautiful, responsive interface.

## 🚀 Features

### 📊 Dashboard
- **Real-time Analytics**: View spending trends and category breakdowns
- **Monthly Expense Charts**: Visual representation of your spending over time
- **Recent Transactions**: Quick overview of your latest financial activities
- **Budget Performance**: Track how well you're sticking to your budgets

### 💰 Transaction Management
- **Add/Edit/Delete Transactions**: Full CRUD operations for financial records
- **Category Classification**: Organize expenses into predefined categories
- **Date Tracking**: Record transactions with specific dates
- **Amount Validation**: Ensure accurate financial data entry

### 📈 Budget Management
- **Set Monthly Limits**: Define spending limits for different categories
- **Budget vs Actual Tracking**: Compare planned vs actual spending
- **Visual Progress Indicators**: See how close you are to budget limits
- **Category-wise Budgets**: Manage budgets for different expense types


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd personal-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/personal-finance
```

**For MongoDB Atlas users:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
```

### 4. Seed the Database

Populate your database with sample data:

```bash
npm run seed
```

This will create:
- **30 sample transactions** across different categories
- **9 budget entries** with realistic monthly limits
- **Data spanning 2 months** for testing analytics

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Dashboard Analytics
- **Total Expenses**: Sum of all transactions
- **Monthly Expenses**: Current month spending
- **Budget Usage**: Percentage of budget used
- **Transaction Count**: Total number of transactions
- **Category Breakdown**: Pie chart of spending by category
- **Monthly Trends**: Line chart of expenses over time

### Transaction Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Groceries
- Rent
- Other

### Budget Management
- Set monthly spending limits per category
- Track actual spending vs budget
- Visual progress indicators
- Budget alerts and notifications
