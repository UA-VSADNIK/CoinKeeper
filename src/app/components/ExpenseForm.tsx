import { useState } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';

interface ExpenseFormProps {
  onAddExpense: (expense: { category: string; amount: number; description: string; date?: string }) => void;
  currentBalance?: number;
}

export function ExpenseForm({ onAddExpense, currentBalance = 0 }: ExpenseFormProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isInsufficientBalance = amount && parseFloat(amount) > currentBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!category) newErrors.category = 'Оберіть категорію';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Введіть коректну суму';
    if (!description.trim()) newErrors.description = 'Введіть опис';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddExpense({
      category,
      amount: parseFloat(amount),
      description,
      date
    });
    setCategory('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
      <h3 className="mb-4" style={{ color: '#222e54' }}>Швидке додавання витрати</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
            Категорія
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors(prev => ({ ...prev, category: '' }));
            }}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors min-h-[44px]"
            style={{ borderColor: errors.category ? '#ce6a6c' : '#bed3c4' }}
            onFocus={(e) => e.target.style.borderColor = '#4c929e'}
            onBlur={(e) => e.target.style.borderColor = errors.category ? '#ce6a6c' : '#bed3c4'}
          >
            <option value="">Виберіть категорію</option>
            <option value="Їжа">Їжа</option>
            <option value="Транспорт">Транспорт</option>
            <option value="Розваги">Розваги</option>
            <option value="Здоров'я">Здоров'я</option>
            <option value="Інше">Інше</option>
          </select>
          {errors.category && (
            <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
            Сума (₴)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors(prev => ({ ...prev, amount: '' }));
            }}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors min-h-[44px]"
            style={{
              borderColor: isInsufficientBalance || errors.amount ? '#ce6a6c' : '#bed3c4'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4c929e'}
            onBlur={(e) => e.target.style.borderColor = isInsufficientBalance || errors.amount ? '#ce6a6c' : '#bed3c4'}
            placeholder="0.00"
            step="0.01"
          />
          {errors.amount && (
            <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.amount}</p>
          )}
          {isInsufficientBalance && !errors.amount && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle size={14} style={{ color: '#ce6a6c' }} />
              <p className="text-xs" style={{ color: '#ce6a6c' }}>
                Недостатньо коштів на балансі (доступно: {currentBalance.toFixed(2)} ₴)
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
            Дата
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors min-h-[44px]"
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

        <div>
          <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
            Опис
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: '' }));
            }}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors min-h-[44px]"
            style={{ borderColor: errors.description ? '#ce6a6c' : '#bed3c4' }}
            onFocus={(e) => e.target.style.borderColor = '#4c929e'}
            onBlur={(e) => e.target.style.borderColor = errors.description ? '#ce6a6c' : '#bed3c4'}
            placeholder="Наприклад: Обід у ресторані"
          />
          {errors.description && (
            <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isInsufficientBalance}
          className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-opacity min-h-[44px]"
          style={{
            backgroundColor: isInsufficientBalance ? '#bed3c4' : '#4c929e',
            opacity: isInsufficientBalance ? 0.5 : 1,
            cursor: isInsufficientBalance ? 'not-allowed' : 'pointer'
          }}
        >
          <Plus size={20} />
          Додати
        </button>
      </form>
    </div>
  );
}
