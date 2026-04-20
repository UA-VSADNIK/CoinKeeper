import { useState } from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseChart } from '../components/ExpenseChart';
import { TransactionsTable, Transaction } from '../components/TransactionsTable';
import { AddBalanceModal } from '../components/AddBalanceModal';

export function DashboardPage() {
  const [balance, setBalance] = useState(15420.50);
  const [monthlyExpense, setMonthlyExpense] = useState(5280.30);
  const [budgetLimit] = useState(6000);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '28.03.2026',
      category: 'Їжа',
      description: 'Продукти в супермаркеті',
      amount: 850.00
    },
    {
      id: '2',
      date: '27.03.2026',
      category: 'Транспорт',
      description: 'Паливо',
      amount: 1200.00
    },
    {
      id: '3',
      date: '26.03.2026',
      category: 'Розваги',
      description: 'Кіно з друзями',
      amount: 320.00
    }
  ]);

  const [chartData, setChartData] = useState([
    { name: 'Їжа', value: 2500 },
    { name: 'Транспорт', value: 1500 },
    { name: 'Розваги', value: 800 },
    { name: "Здоров'я", value: 480.30 },
    { name: 'Інше', value: 0 }
  ]);

  const handleAddExpense = (expense: { category: string; amount: number; description: string }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('uk-UA'),
      category: expense.category,
      description: expense.description,
      amount: expense.amount
    };

    setTransactions([newTransaction, ...transactions]);
    setMonthlyExpense(prev => prev + expense.amount);

    // Update chart data
    setChartData(prevData => {
      const categoryIndex = prevData.findIndex(item => item.name === expense.category);
      if (categoryIndex !== -1) {
        const newData = [...prevData];
        newData[categoryIndex] = {
          ...newData[categoryIndex],
          value: newData[categoryIndex].value + expense.amount
        };
        return newData;
      }
      return prevData;
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactions(transactions.filter(t => t.id !== id));
      setMonthlyExpense(prev => prev - transaction.amount);

      // Update chart data
      setChartData(prevData => {
        const categoryIndex = prevData.findIndex(item => item.name === transaction.category);
        if (categoryIndex !== -1) {
          const newData = [...prevData];
          newData[categoryIndex] = {
            ...newData[categoryIndex],
            value: Math.max(0, newData[categoryIndex].value - transaction.amount)
          };
          return newData;
        }
        return prevData;
      });
    }
  };

  const handleAddBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <BalanceCard
            title="Загальний баланс"
            amount={`${balance.toFixed(2)} ₴`}
            type="balance"
          />
          <AddBalanceModal onAddBalance={handleAddBalance} />
        </div>
        <BalanceCard
          title="Витрачено за місяць"
          amount={`${monthlyExpense.toFixed(2)} ₴`}
          type="expense"
          budgetLimit={budgetLimit}
          currentExpense={monthlyExpense}
        />
      </div>

      {/* Form and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpenseForm onAddExpense={handleAddExpense} currentBalance={balance} />
        <ExpenseChart data={chartData} />
      </div>

      {/* Transactions Table */}
      <TransactionsTable 
        transactions={transactions}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}