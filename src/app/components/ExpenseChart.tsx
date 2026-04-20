import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#4c929e', '#ce6a6c', '#e9ada2', '#bed3c4', '#222e54'];

export function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="mb-4" style={{ color: '#222e54' }}>Розподіл витрат за категоріями</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(2)} ₴`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
