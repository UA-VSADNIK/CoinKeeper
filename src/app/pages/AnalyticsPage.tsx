import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

const monthlyData = {
  week: [
    { month: 'Пн', Їжа: 350, Транспорт: 200, Розваги: 100, "Здоров'я": 70, Інше: 50 },
    { month: 'Вт', Їжа: 320, Транспорт: 180, Розваги: 150, "Здоров'я": 60, Інше: 40 },
    { month: 'Ср', Їжа: 380, Транспорт: 220, Розваги: 120, "Здоров'я": 80, Інше: 60 },
    { month: 'Чт', Їжа: 340, Транспорт: 190, Розваги: 130, "Здоров'я": 65, Інше: 45 },
    { month: 'Пт', Їжа: 400, Транспорт: 250, Розваги: 200, "Здоров'я": 90, Інше: 70 },
    { month: 'Сб', Їжа: 450, Транспорт: 100, Розваги: 300, "Здоров'я": 50, Інше: 80 },
    { month: 'Нд', Їжа: 260, Транспорт: 80, Розваги: 180, "Здоров'я": 40, Інше: 30 }
  ],
  3: [
    { month: 'Січ', Їжа: 2400, Транспорт: 1398, Розваги: 800, "Здоров'я": 480, Інше: 300 },
    { month: 'Лют', Їжа: 2210, Транспорт: 1480, Розваги: 967, "Здоров'я": 520, Інше: 250 },
    { month: 'Бер', Їжа: 2500, Транспорт: 1500, Розваги: 800, "Здоров'я": 480, Інше: 0 }
  ],
  6: [
    { month: 'Жов', Їжа: 2100, Транспорт: 1200, Розваги: 650, "Здоров'я": 400, Інше: 200 },
    { month: 'Лис', Їжа: 2300, Транспорт: 1350, Розваги: 720, "Здоров'я": 450, Інше: 280 },
    { month: 'Гру', Їжа: 2600, Транспорт: 1450, Розваги: 900, "Здоров'я": 500, Інше: 350 },
    { month: 'Січ', Їжа: 2400, Транспорт: 1398, Розваги: 800, "Здоров'я": 480, Інше: 300 },
    { month: 'Лют', Їжа: 2210, Транспорт: 1480, Розваги: 967, "Здоров'я": 520, Інше: 250 },
    { month: 'Бер', Їжа: 2500, Транспорт: 1500, Розваги: 800, "Здоров'я": 480, Інше: 0 }
  ],
  12: [
    { month: 'Кві 25', Їжа: 1950, Транспорт: 1100, Розваги: 550, "Здоров'я": 380, Інше: 150 },
    { month: 'Тра', Їжа: 2050, Транспорт: 1150, Розваги: 600, "Здоров'я": 400, Інше: 180 },
    { month: 'Чер', Їжа: 2200, Транспорт: 1250, Розваги: 700, "Здоров'я": 420, Інше: 220 },
    { month: 'Лип', Їжа: 2150, Транспорт: 1180, Розваги: 680, "Здоров'я": 410, Інше: 200 },
    { month: 'Сер', Їжа: 2250, Транспорт: 1280, Розваги: 750, "Здоров'я": 440, Інше: 240 },
    { month: 'Вер', Їжа: 2180, Транспорт: 1220, Розваги: 700, "Здоров'я": 430, Інше: 210 },
    { month: 'Жов', Їжа: 2100, Транспорт: 1200, Розваги: 650, "Здоров'я": 400, Інше: 200 },
    { month: 'Лис', Їжа: 2300, Транспорт: 1350, Розваги: 720, "Здоров'я": 450, Інше: 280 },
    { month: 'Гру', Їжа: 2600, Транспорт: 1450, Розваги: 900, "Здоров'я": 500, Інше: 350 },
    { month: 'Січ 26', Їжа: 2400, Транспорт: 1398, Розваги: 800, "Здоров'я": 480, Інше: 300 },
    { month: 'Лют', Їжа: 2210, Транспорт: 1480, Розваги: 967, "Здоров'я": 520, Інше: 250 },
    { month: 'Бер', Їжа: 2500, Транспорт: 1500, Розваги: 800, "Здоров'я": 480, Інше: 0 }
  ]
};

const categories = ['Їжа', 'Транспорт', 'Розваги', "Здоров'я", 'Інше'];
const categoryColors: Record<string, string> = {
  'Їжа': '#4c929e',
  'Транспорт': '#ce6a6c',
  'Розваги': '#e9ada2',
  "Здоров'я": '#bed3c4',
  'Інше': '#222e54'
};

export function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 3 | 6 | 12 | 'custom'>('week');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Calculate top 3 categories from last period
  const currentData = period === 'custom' ? monthlyData[3] : monthlyData[period];
  const lastMonth = currentData[currentData.length - 1];
  const topCategories = Object.entries(lastMonth)
    .filter(([key]) => key !== 'month')
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 className="text-2xl md:text-3xl mb-6" style={{ color: '#222e54' }}>Аналітика витрат</h1>

      {/* Period Selection */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4" style={{ color: '#222e54' }}>Період аналізу</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setPeriod('week')}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
            style={{
              backgroundColor: period === 'week' ? '#4c929e' : 'transparent',
              color: period === 'week' ? 'white' : '#222e54',
              border: period === 'week' ? 'none' : '1px solid #bed3c4'
            }}
          >
            1 Тиждень
          </button>
          {([3, 6, 12] as const).map(months => (
            <button
              key={months}
              onClick={() => setPeriod(months)}
              className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: period === months ? '#4c929e' : 'transparent',
                color: period === months ? 'white' : '#222e54',
                border: period === months ? 'none' : '1px solid #bed3c4'
              }}
            >
              {months} міс
            </button>
          ))}
          <button
            onClick={() => setPeriod('custom')}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center gap-2"
            style={{
              backgroundColor: period === 'custom' ? '#4c929e' : 'transparent',
              color: period === 'custom' ? 'white' : '#222e54',
              border: period === 'custom' ? 'none' : '1px solid #bed3c4'
            }}
          >
            <Calendar size={18} />
            Вибраний період
          </button>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: chartType === 'bar' ? '#4c929e' : 'transparent',
                color: chartType === 'bar' ? 'white' : '#222e54',
                border: chartType === 'bar' ? 'none' : '1px solid #bed3c4'
              }}
            >
              Стовпці
            </button>
            <button
              onClick={() => setChartType('line')}
              className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
              style={{
                backgroundColor: chartType === 'line' ? '#4c929e' : 'transparent',
                color: chartType === 'line' ? 'white' : '#222e54',
                border: chartType === 'line' ? 'none' : '1px solid #bed3c4'
              }}
            >
              Лінії
            </button>
          </div>
        </div>

        {/* Custom Date Range */}
        {period === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: '#bed3c4' }}>
            <div>
              <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
                Від
              </label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm" style={{ color: '#222e54' }}>
                До
              </label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
                style={{ borderColor: '#bed3c4' }}
                onFocus={(e) => e.target.style.borderColor = '#4c929e'}
                onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4" style={{ color: '#222e54' }}>Фільтр категорій</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer min-h-[44px] px-3 rounded-lg transition-colors"
              style={{
                backgroundColor: selectedCategories.includes(category)
                  ? `${categoryColors[category]}20`
                  : 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: categoryColors[category] }}
              />
              <span style={{ color: '#222e54' }}>{category}</span>
              <div
                className="w-4 h-4 rounded-full ml-1"
                style={{ backgroundColor: categoryColors[category] }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4" style={{ color: '#222e54' }}>Тренд витрат</h3>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#222e54" />
              <YAxis stroke="#222e54" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #bed3c4',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `${value.toFixed(2)} ₴`}
              />
              <Legend />
              {selectedCategories.map(category => (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={categoryColors[category]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#222e54" />
              <YAxis stroke="#222e54" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #bed3c4',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `${value.toFixed(2)} ₴`}
              />
              <Legend />
              {selectedCategories.map(category => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={categoryColors[category]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Top 3 Categories */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
        <h3 className="mb-4" style={{ color: '#222e54' }}>Топ-3 категорії цього місяця</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCategories.map((cat, index) => (
            <div
              key={cat.name}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: `${categoryColors[cat.name]}20`,
                border: `2px solid ${categoryColors[cat.name]}`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70" style={{ color: '#222e54' }}>
                  #{index + 1}
                </span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[cat.name] }}
                />
              </div>
              <h4 className="mb-1" style={{ color: '#222e54' }}>{cat.name}</h4>
              <p className="text-2xl" style={{ color: categoryColors[cat.name] }}>
                {cat.value.toFixed(2)} ₴
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
