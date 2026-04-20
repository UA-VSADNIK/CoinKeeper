import { useState } from 'react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'setup'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currency, setCurrency] = useState('UAH');
  const [language, setLanguage] = useState('uk');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = 'Введіть ПІБ';
    }

    if (!email) {
      newErrors.email = 'Введіть email';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Некоректний формат email';
    }

    if (!password) {
      newErrors.password = 'Введіть пароль';
    } else if (password.length < 8) {
      newErrors.password = 'Пароль повинен містити мінімум 8 символів';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Підтвердіть пароль';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Паролі не співпадають';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If login, go to dashboard
    if (isLogin) {
      window.location.href = '/dashboard';
    } else {
      // If register, go to setup step
      setStep('setup');
      setErrors({});
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!initialBalance || parseFloat(initialBalance) < 0) {
      newErrors.initialBalance = 'Введіть початкову суму (мінімум 0)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save settings and redirect to dashboard
    localStorage.setItem('userSettings', JSON.stringify({
      fullName,
      email,
      initialBalance: parseFloat(initialBalance),
      currency,
      language
    }));

    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: '#222e54' }}>CoinKeeper</h1>
          <p className="text-gray-500">
            {step === 'setup' ? 'Первинне налаштування' : 'Управління фінансами'}
          </p>
        </div>

        {/* Auth Form */}
        {step === 'auth' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4 md:space-y-6">
            {!isLogin && (
              <div>
                <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                  ПІБ
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors(prev => ({ ...prev, fullName: undefined }));
                  }}
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                  style={{
                    borderColor: errors.fullName ? '#ce6a6c' : '#bed3c4',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                  onBlur={(e) => e.target.style.borderColor = errors.fullName ? '#ce6a6c' : '#bed3c4'}
                  placeholder="Іван Петренко"
                />
                {errors.fullName && (
                  <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{
                  borderColor: errors.email ? '#ce6a6c' : '#bed3c4',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#ce6a6c' : '#bed3c4'}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Пароль {!isLogin && '(мінімум 8 символів)'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: undefined }));
                }}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{
                  borderColor: errors.password ? '#ce6a6c' : '#bed3c4',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = errors.password ? '#ce6a6c' : '#bed3c4'}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                  Підтвердження пароля
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                  style={{
                    borderColor: errors.confirmPassword ? '#ce6a6c' : '#bed3c4',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                  onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#ce6a6c' : '#bed3c4'}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white transition-opacity hover:opacity-90 min-h-[44px]"
                style={{ backgroundColor: '#4c929e' }}
              >
                {isLogin ? 'Увійти' : 'Продовжити'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="w-full py-3 rounded-lg border transition-colors min-h-[44px]"
                style={{
                  borderColor: '#4c929e',
                  color: '#4c929e',
                  backgroundColor: 'transparent'
                }}
              >
                {isLogin ? 'Створити акаунт' : 'Вже маю акаунт'}
              </button>
            </div>
          </form>
        )}

        {/* Setup Form */}
        {step === 'setup' && (
          <form onSubmit={handleSetupSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Початкова сума *
              </label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => {
                  setInitialBalance(e.target.value);
                  setErrors(prev => ({ ...prev, initialBalance: undefined }));
                }}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{
                  borderColor: errors.initialBalance ? '#ce6a6c' : '#bed3c4',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = errors.initialBalance ? '#ce6a6c' : '#bed3c4'}
                placeholder="0.00"
                step="0.01"
              />
              {errors.initialBalance && (
                <p className="text-xs mt-1" style={{ color: '#ce6a6c' }}>{errors.initialBalance}</p>
              )}
              <p className="text-xs mt-1 text-gray-500">
                Введіть вашу поточну суму коштів
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Валюта
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              >
                <option value="UAH">₴ Гривня (UAH)</option>
                <option value="USD">$ Долар (USD)</option>
                <option value="EUR">€ Євро (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Мова інтерфейсу
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              >
                <option value="uk">Українська</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white transition-opacity hover:opacity-90 min-h-[44px]"
                style={{ backgroundColor: '#4c929e' }}
              >
                Завершити налаштування
              </button>

              <button
                type="button"
                onClick={() => setStep('auth')}
                className="w-full py-3 rounded-lg border transition-colors min-h-[44px]"
                style={{
                  borderColor: '#bed3c4',
                  color: '#222e54',
                  backgroundColor: 'transparent'
                }}
              >
                Назад
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
