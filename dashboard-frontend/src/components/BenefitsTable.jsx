import { buildBenefitsSummary, normalizeBenefits } from '../utils/dataTransforms.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export default function BenefitsTable({ data }) {
  const normalized = normalizeBenefits(data);
  const summary = buildBenefitsSummary(normalized);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Average Benefits by Plan</h2>
          <p>Comparing average monthly contributions for shareholders versus non-shareholders.</p>
        </div>
      </header>

      <div className="panel__content panel__content--table">
        {summary.length === 0 ? (
          <p>No benefit plan data available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Benefits plan</th>
                <th scope="col">Shareholder status</th>
                <th scope="col">Average monthly contribution</th>
                <th scope="col">Sample size</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={`${row.planName}-${row.shareholder}`}>
                  <td>{row.planName}</td>
                  <td>{row.shareholder}</td>
                  <td>{currencyFormatter.format(row.averageContribution)}</td>
                  <td>{row.sampleCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

