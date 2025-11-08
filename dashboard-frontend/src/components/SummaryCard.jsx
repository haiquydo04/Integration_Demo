import clsx from 'clsx';

export default function SummaryCard({ title, value, subtitle, trend, tone = 'neutral', icon }) {
  return (
    <article className={clsx('summary-card', `summary-card--${tone}`)}>
      <div className="summary-card__content">
        <header>
          <p className="summary-card__title">{title}</p>
          {icon && <span className="summary-card__icon" aria-hidden>{icon}</span>}
        </header>

        <p className="summary-card__value">{value}</p>

        {subtitle && <p className="summary-card__subtitle">{subtitle}</p>}
      </div>

      {trend && (
        <footer className="summary-card__trend">
          <TrendPill direction={trend.direction} label={trend.label} />
        </footer>
      )}
    </article>
  );
}

function TrendPill({ direction, label }) {
  return <span className={clsx('trend-pill', `trend-pill--${direction ?? 'neutral'}`)}>{label}</span>;
}

