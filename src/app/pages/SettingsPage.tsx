import { useState } from 'react';
import { User, DollarSign, Bell, Moon, Save } from 'lucide-react';

export function SettingsPage() {
  const [budgetLimit, setBudgetLimit] = useState('6000');
  const [currency, setCurrency] = useState('UAH');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert('Налаштування збережено!');
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 className="text-2xl md:text-3xl mb-6" style={{ color: '#222e54' }}>Налаштування</h1>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <User size={20} style={{ color: '#4c929e' }} />
          Профіль
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Ім'я
            </label>
            <input
              type="text"
              defaultValue="Олена Петренко"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Email
            </label>
            <input
              type="email"
              defaultValue="olena@example.com"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
            />
          </div>
        </div>
      </div>

      {/* Budget Settings */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <DollarSign size={20} style={{ color: '#4c929e' }} />
          Бюджет
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Місячний ліміт витрат (₴)
            </label>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
              Валюта
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
              style={{ borderColor: '#bed3c4' }}
              onFocus={(e) => e.target.style.borderColor = '#4c929e'}
              onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
            >
              <option value="UAH">₴ Гривня (UAH)</option>
              <option value="USD">$ Долар (USD)</option>
              <option value="EUR">€ Євро (EUR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <Bell size={20} style={{ color: '#4c929e' }} />
          Налаштування програми
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
            <span style={{ color: '#222e54' }}>Сповіщення про перевищення бюджету</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ backgroundColor: notifications ? '#4c929e' : '#bed3c4' }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ left: notifications ? '28px' : '4px' }}
              />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
            <span style={{ color: '#222e54' }}>Темна тема</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-12 h-6 rounded-full transition-colors flex items-center"
              style={{ backgroundColor: darkMode ? '#222e54' : '#bed3c4' }}
            >
              <Moon
                size={14}
                className="absolute left-1.5"
                style={{ color: 'white', opacity: darkMode ? 1 : 0.5 }}
              />
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ left: darkMode ? '28px' : '4px' }}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full md:w-auto px-8 py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 min-h-[44px]"
        style={{ backgroundColor: '#4c929e' }}
      >
        <Save size={20} />
        Зберегти зміни
      </button>
    </div>
  );
}
