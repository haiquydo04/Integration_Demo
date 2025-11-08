import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import { normalizeAlerts } from '../utils/dataTransforms.js';

export default function AlertsPanel({ data, isLoading, onRefresh }) {
  const { alerts, count } = normalizeAlerts(data);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Real-time Alerts</h2>
          <p>{count} alerts triggered based on active monitoring rules.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onRefresh} disabled={isLoading}>
          Refresh
        </button>
      </header>

      <div className="alerts-list" role="list">
        {alerts.length === 0 && <p>No alerts triggered for the selected filters.</p>}

        {alerts.map((alert) => (
          <article key={`${alert.employee_id}-${alert.alert_type}-${alert.triggered_on}`} className="alert-card" role="listitem">
            <div className="alert-card__header">
              <AlertBadge type={alert.alert_type} />
              <span className="alert-card__timestamp">{formatAlertDate(alert.triggered_on)}</span>
            </div>

            <h3>{alert.employee_name}</h3>
            <p className="alert-card__meta">
              {alert.department} • {alert.employment_type}
            </p>
            <p className="alert-card__details">{alert.details}</p>

            <footer className="alert-card__footer">
              <span>Shareholder: {alert.shareholder}</span>
              <span>Source: {alert.source}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function AlertBadge({ type }) {
  const tone = (() => {
    switch (type) {
      case 'Vacation Exceeded':
        return 'danger';
      case 'Benefit Change':
      case 'Payroll Adjustment':
        return 'warning';
      case 'Birthday':
      case 'Anniversary':
        return 'info';
      default:
        return 'neutral';
    }
  })();

  return <span className={clsx('alert-badge', `alert-badge--${tone}`)}>{type}</span>;
}

function formatAlertDate(timestamp) {
  try {
    return format(parseISO(timestamp), 'dd MMM yyyy');
  } catch (error) {
    return 'Unknown date';
  }
}

