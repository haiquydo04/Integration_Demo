import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertsPanel from '../components/AlertsPanel.jsx';
import BenefitsTable from '../components/BenefitsTable.jsx';
import EmployeeDetailDrawer from '../components/EmployeeDetailDrawer.jsx';
import EmployeeTable from '../components/EmployeeTable.jsx';
import EarningsChart from '../components/EarningsChart.jsx';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Loader from '../components/Loader.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import VacationsChart from '../components/VacationsChart.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import {
  buildDepartmentOptions,
  buildEthnicityOptions,
  buildGenderOptions,
  filterEmployees,
  normalizeAlerts,
  normalizeBenefits,
  normalizeEarnings,
  normalizeVacations,
  sumEarnings
} from '../utils/dataTransforms.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const currentYear = new Date().getFullYear();
const months = [
  { label: 'All months', value: '' },
  ...Array.from({ length: 12 }, (_, index) => ({
    label: new Date(0, index).toLocaleString('en-US', { month: 'short' }),
    value: String(index + 1).padStart(2, '0')
  }))
];

const yearOptions = [
  { label: 'All years', value: '' },
  { label: `${currentYear}`, value: `${currentYear}` },
  { label: `${currentYear - 1}`, value: `${currentYear - 1}` }
];

const initialFilters = {
  year: `${currentYear}`,
  department: '',
  gender: '',
  ethnicity: '',
  employmentType: '',
  shareholder: '',
  alertType: '',
  month: String(new Date().getMonth() + 1).padStart(2, '0'),
  vacationGrouping: 'employmentType'
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { earnings, vacations, benefits, alerts, employees, isLoading, isError, refetchAll } = useDashboardData(filters);

  const earningsData = useMemo(() => normalizeEarnings(earnings.data), [earnings.data]);
  const vacationData = useMemo(() => normalizeVacations(vacations.data), [vacations.data]);
  const benefitsData = useMemo(() => normalizeBenefits(benefits.data), [benefits.data]);
  const alertsData = useMemo(() => normalizeAlerts(alerts.data), [alerts.data]);

  const departmentOptions = useMemo(() => buildDepartmentOptions(earningsData, employees.data ?? []), [earningsData, employees.data]);
  const genderOptions = useMemo(() => buildGenderOptions(employees.data ?? []), [employees.data]);
  const ethnicityOptions = useMemo(() => buildEthnicityOptions(employees.data ?? []), [employees.data]);

  const filteredEmployees = useMemo(
    () => filterEmployees(employees.data ?? [], filters),
    [employees.data, filters]
  );

  const totalEarnings = sumEarnings(earningsData);
  const totalVacationDays = vacationData.reduce((acc, record) => acc + (record.totalDays ?? 0), 0);
  const totalBenefitPlans = new Set(benefitsData.map((plan) => plan.planName)).size;

  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGroupingChange = (grouping) => {
    setFilters((previous) => ({ ...previous, vacationGrouping: grouping }));
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden>
            HR
          </span>
          <div>
            <h1>HR Insights</h1>
            <p>People Analytics Dashboard</p>
          </div>
        </div>

        <div className="sidebar__user">
          <p>{user?.name}</p>
          <p className="sidebar__user-email">{user?.email}</p>
          <button type="button" className="secondary-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        <div className="sidebar__meta">
          <h2>Monitoring rules</h2>
          <ul>
            <li>Hiring anniversaries</li>
            <li>Birthday reminders</li>
            <li>Vacation thresholds</li>
            <li>Benefit and payroll changes</li>
          </ul>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Workforce health overview</h1>
            <p>Review compensation, benefits, vacation usage, and proactive alerts for people leaders.</p>
          </div>
          <div className="dashboard-header__actions">
            <button type="button" className="secondary-button" onClick={refetchAll} disabled={isLoading}>
              Sync now
            </button>
          </div>
        </header>

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          departmentOptions={departmentOptions}
          genderOptions={genderOptions}
          ethnicityOptions={ethnicityOptions}
          yearOptions={yearOptions}
          monthOptions={months}
        />

        {isError && <ErrorState message={earnings.error?.message ?? 'Integration API unavailable.'} onRetry={refetchAll} />}
        {isLoading && <Loader />}

        {!isLoading && !isError && (
          <>
            <section className="summary-grid">
              <SummaryCard
                title="Employees in scope"
                value={filteredEmployees.length}
                subtitle="Matching the selected filters"
                tone="neutral"
              />

              <SummaryCard
                title="Total earnings"
                value={currencyFormatter.format(totalEarnings)}
                subtitle={`Across ${earningsData.length} departments`}
                tone="primary"
              />

              <SummaryCard
                title="Vacation days"
                value={`${totalVacationDays} days`}
                subtitle="Consumed this year"
                tone="accent"
              />

              <SummaryCard
                title="Benefits plans"
                value={totalBenefitPlans}
                subtitle="Average contribution per shareholder status"
                tone="neutral"
              />

              <SummaryCard
                title="Active alerts"
                value={alertsData.count}
                subtitle="Require manager attention"
                tone={alertsData.count > 0 ? 'warning' : 'neutral'}
              />
            </section>

            <section className="charts-grid">
              <EarningsChart data={earnings.data} />
              <VacationsChart data={vacations.data} filters={filters} onGroupingChange={handleGroupingChange} />
            </section>

            <section className="panels-grid">
              <BenefitsTable data={benefits.data} />
              <AlertsPanel data={alerts.data} isLoading={alerts.isFetching} onRefresh={alerts.refetch} />
            </section>

            <EmployeeTable data={filteredEmployees} onSelect={setSelectedEmployee} />
          </>
        )}
      </main>

      <EmployeeDetailDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  );
}

