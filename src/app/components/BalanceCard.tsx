interface BalanceCardProps {
  title: string;
  amount: string;
  type: 'balance' | 'expense';
  onAddBalance?: () => void;
  showAddButton?: boolean;
  budgetLimit?: number;
  currentExpense?: number;
}

export function BalanceCard({
  title,
  amount,
  type,
  onAddBalance,
  showAddButton,
  budgetLimit,
  currentExpense
}: BalanceCardProps) {
  const isBalance = type === 'balance';
  const isOverBudget = budgetLimit && currentExpense && currentExpense > budgetLimit;
  const budgetPercentage = budgetLimit && currentExpense ? (currentExpense / budgetLimit) * 100 : 0;

  return (
    <div
      className="rounded-2xl p-4 md:p-6 shadow-md"
      style={{
        backgroundColor: isBalance ? '#bed3c4' : '#e9ada2'
      }}
    >
      <h3
        className="text-sm mb-2 opacity-80"
        style={{ color: isBalance ? '#222e54' : '#ce6a6c' }}
      >
        {title}
      </h3>
      <p
        className="text-3xl md:text-4xl mb-2"
        style={{ color: isBalance ? '#222e54' : isOverBudget ? '#ce6a6c' : '#ce6a6c' }}
      >
        {amount}
      </p>

      {/* Budget Progress Bar for Expense Card */}
      {!isBalance && budgetLimit && currentExpense !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#222e54' }}>Ліміт: {budgetLimit.toFixed(2)} ₴</span>
            <span style={{ color: isOverBudget ? '#ce6a6c' : '#222e54' }}>
              {budgetPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: isOverBudget ? '#ce6a6c' : '#4c929e'
              }}
            />
          </div>
          {isOverBudget && (
            <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>
              ⚠️ Перевищено ліміт на {(currentExpense - budgetLimit).toFixed(2)} ₴
            </p>
          )}
        </div>
      )}

      {showAddButton && onAddBalance && (
        <button
          onClick={onAddBalance}
          className="mt-4 px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 flex items-center gap-2 min-h-[44px]"
          style={{ backgroundColor: '#4c929e' }}
        >
          <span>+</span>
          Поповнити
        </button>
      )}
    </div>
  );
}