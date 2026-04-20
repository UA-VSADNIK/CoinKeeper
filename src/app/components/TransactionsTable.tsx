import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionsTable({ transactions, onDelete }: TransactionsTableProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowConfirm(id);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setShowConfirm(null);
  };

  const cancelDelete = () => {
    setShowConfirm(null);
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
      <h3 className="mb-4" style={{ color: '#222e54' }}>Останні транзакції</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
              <th className="text-left py-3 px-2 md:px-4" style={{ color: '#222e54' }}>Дата</th>
              <th className="text-left py-3 px-2 md:px-4" style={{ color: '#222e54' }}>Категорія</th>
              <th className="text-left py-3 px-2 md:px-4 hidden md:table-cell" style={{ color: '#222e54' }}>Опис</th>
              <th className="text-right py-3 px-2 md:px-4" style={{ color: '#222e54' }}>Сума</th>
              <th className="text-center py-3 px-2 md:px-4" style={{ color: '#222e54' }}>Дія</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b transition-colors"
                style={{ borderColor: '#f3f4f6' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td className="py-3 px-2 md:px-4 text-gray-600 text-sm md:text-base">{transaction.date}</td>
                <td className="py-3 px-2 md:px-4 text-sm md:text-base" style={{ color: '#222e54' }}>{transaction.category}</td>
                <td className="py-3 px-2 md:px-4 text-gray-600 hidden md:table-cell">{transaction.description}</td>
                <td className="py-3 px-2 md:px-4 text-right text-sm md:text-base" style={{ color: '#ce6a6c' }}>
                  -{transaction.amount.toFixed(2)} ₴
                </td>
                <td className="py-3 px-2 md:px-4 text-center">
                  {showConfirm === transaction.id ? (
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => confirmDelete(transaction.id)}
                        className="px-2 py-1 rounded text-white text-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
                        style={{ backgroundColor: '#ce6a6c' }}
                      >
                        Так
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-2 py-1 rounded text-white text-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
                        style={{ backgroundColor: '#bed3c4', color: '#222e54' }}
                      >
                        Ні
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(transaction.id)}
                      className="p-2 rounded-lg transition-colors inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
                      style={{ color: '#ce6a6c' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(206, 106, 108, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Транзакцій поки немає
          </div>
        )}
      </div>
    </div>
  );
}
