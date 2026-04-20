import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export function FeedbackPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 className="text-2xl md:text-3xl mb-6" style={{ color: '#222e54' }}>Зворотний зв'язок</h1>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md max-w-2xl">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <MessageCircle size={20} style={{ color: '#4c929e' }} />
          Напишіть нам
        </h3>

        {submitted ? (
          <div
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: '#bed3c420', border: '2px solid #bed3c4' }}
          >
            <p className="text-xl mb-2" style={{ color: '#222e54' }}>✓ Дякуємо за звернення!</p>
            <p className="text-sm text-gray-600">Ми отримали ваше повідомлення і скоро зв'яжемося з вами.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Тема повідомлення
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
                required
              >
                <option value="">Оберіть тему</option>
                <option value="bug">Повідомити про помилку</option>
                <option value="feature">Запропонувати функцію</option>
                <option value="question">Питання по роботі</option>
                <option value="other">Інше</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm md:text-base" style={{ color: '#222e54' }}>
                Текст повідомлення
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none resize-none"
                style={{ borderColor: '#bed3c4', minHeight: '150px' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
                placeholder="Опишіть детально вашу проблему або пропозицію..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: '#4c929e' }}
            >
              <Send size={20} />
              Надіслати
            </button>
          </form>
        )}

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f9f9f9' }}>
          <p className="text-sm text-gray-600">
            <strong style={{ color: '#222e54' }}>Це демонстраційна версія</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
