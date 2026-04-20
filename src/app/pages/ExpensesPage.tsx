import { useState } from 'react';
import { TransactionsTable, Transaction } from '../components/TransactionsTable';
import { Search, Filter, Calendar } from 'lucide-react';

export function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '28.03.2026', category: 'Їжа', description: 'Продукти в супермаркеті', amount: 850.00 },
    { id: '2', date: '27.03.2026', category: 'Транспорт', description: 'Паливо', amount: 1200.00 },
    { id: '3', date: '26.03.2026', category: 'Розваги', description: 'Кіно з друзями', amount: 320.00 },
    { id: '4', date: '25.03.2026', category: 'Їжа', description: 'Ресторан', amount: 450.00 },
    { id: '5', date: '24.03.2026', category: "Здоров'я", description: 'Аптека', amount: 280.30 },
    { id: '6', date: '23.03.2026', category: 'Транспорт', description: 'Метро', amount: 50.00 },
    { id: '7', date: '22.03.2026', category: 'Інше', description: 'Подарунок', amount: 550.00 },
    { id: '8', date: '21.03.2026', category: 'Їжа', description: 'Кафе', amount: 180.00 },
  ]);

  const categories = ['all', 'Їжа', 'Транспорт', 'Розваги', "Здоров'я", 'Інше'];

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

    // Date filter
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const transactionDate = t.date.split('.').reverse().join('-'); // Convert DD.MM.YYYY to YYYY-MM-DD
      if (dateFrom && transactionDate < dateFrom) matchesDate = false;
      if (dateTo && transactionDate > dateTo) matchesDate = false;
    }

    // Amount filter
    let matchesAmount = true;
    if (minAmount && t.amount < parseFloat(minAmount)) matchesAmount = false;
    if (maxAmount && t.amount > parseFloat(maxAmount)) matchesAmount = false;

    return matchesSearch && matchesCategory && matchesDate && matchesAmount;
  });

  const totalExpense = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 className="text-2xl md:text-3xl mb-6" style={{ color: '#222e54' }}>Мої витрати</h1>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="text-sm opacity-80 mb-2" style={{ color: '#222e54' }}>
          Загальна сума {selectedCategory !== 'all' ? `(${selectedCategory})` : ''}
        </h3>
        <p className="text-3xl md:text-4xl" style={{ color: '#ce6a6c' }}>
          {totalExpense.toFixed(2)} ₴
        </p>
        <p className="text-sm mt-2 text-gray-500">
          Знайдено транзакцій: {filteredTransactions.length}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} style={{ color: '#4c929e' }} />
          <h3 style={{ color: '#222e54' }}>Фільтри</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Пошук
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#4c929e' }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
                placeholder="Шукати за описом або категорією"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Категорія
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Всі категорії' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Дата від
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              />
              <Calendar
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#4c929e' }}
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Дата до
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              />
              <Calendar
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#4c929e' }}
              />
            </div>
          </div>

          {/* Min Amount */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Мінімальна сума (₴)
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Максимальна сума (₴)
            </label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setDateFrom('');
            setDateTo('');
            setMinAmount('');
            setMaxAmount('');
          }}
          className="mt-4 px-6 py-2 rounded-lg border transition-colors min-h-[44px]"
          style={{
            borderColor: '#4c929e',
            color: '#4c929e',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4c929e10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Скинути фільтри
        </button>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={filteredTransactions} onDelete={handleDelete} />
    </div>
  );
}
