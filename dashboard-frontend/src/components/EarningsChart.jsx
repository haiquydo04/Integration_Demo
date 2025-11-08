import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { normalizeEarnings } from '../utils/dataTransforms.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export default function EarningsChart({ data }) {
  const chartData = normalizeEarnings(data);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Total Earnings by Department</h2>
          <p>Distribution of total earnings split by department after applying filters.</p>
        </div>
      </header>

      <div className="panel__content panel__content--chart">
        {chartData.length === 0 ? (
          <p>No earnings data available for the selected filters.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="department" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => currencyFormatter.format(value)} tickLine={false} axisLine={false} width={120} />
              <Tooltip formatter={(value) => currencyFormatter.format(value)} cursor={{ fill: '#eef2ff' }} />
              <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

