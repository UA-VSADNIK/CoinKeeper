import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';

interface AddBalanceModalProps {
  onAddBalance: (amount: number) => void;
}

export function AddBalanceModal({ onAddBalance }: AddBalanceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onAddBalance(numAmount);
      setAmount('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="mt-4 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-opacity hover:opacity-90 min-h-[44px]"
          style={{ backgroundColor: '#4c929e' }}
        >
          <Plus size={18} />
          Поповнити баланс
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl" style={{ color: '#222e54' }}>
              Поповнити баланс
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ color: '#222e54' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2" style={{ color: '#222e54' }}>
                Сума поповнення (₴)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Введіть суму, яку хочете додати до балансу
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 py-3 rounded-lg border transition-colors min-h-[44px]"
                  style={{
                    borderColor: '#bed3c4',
                    color: '#222e54'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Скасувати
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg text-white transition-opacity hover:opacity-90 min-h-[44px]"
                style={{ backgroundColor: '#4c929e' }}
              >
                Додати
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
