import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { groupVacationBy, normalizeVacations } from '../utils/dataTransforms.js';

const GROUP_OPTIONS = [
  { value: 'employmentType', label: 'Employment type' },
  { value: 'gender', label: 'Gender' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'ethnicity', label: 'Ethnicity' }
];

export default function VacationsChart({ data, filters, onGroupingChange }) {
  const vacations = normalizeVacations(data);
  const chartData = groupVacationBy(filters, vacations);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Vacation Days</h2>
          <p>Total vacation days taken grouped by {filters.vacationGrouping ?? 'employment type'}.</p>
        </div>
        <div className="segmented-control" role="group" aria-label="Group vacation data">
          {GROUP_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === (filters.vacationGrouping ?? 'employmentType') ? 'segmented-control__button segmented-control__button--active' : 'segmented-control__button'}
              onClick={() => onGroupingChange?.(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="panel__content panel__content--chart">
        {chartData.length === 0 ? (
          <p>No vacation data found.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 16, right: 24, left: 12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#fef3c7' }} />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

