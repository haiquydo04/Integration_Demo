import { format, parseISO } from 'date-fns';

export default function EmployeeDetailDrawer({ employee, onClose }) {
  if (!employee) return null;

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return format(parseISO(date), 'dd MMM yyyy');
    } catch (error) {
      return date;
    }
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="employee-detail-title">
      <div className="drawer__backdrop" onClick={onClose} />
      <div className="drawer__panel">
        <header className="drawer__header">
          <div>
            <h2 id="employee-detail-title">{employee.full_name}</h2>
            <p>{employee.department} • {employee.employment_type}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <section className="drawer__section">
          <h3>Profile</h3>
          <dl className="description-list">
            <DescriptionItem label="Employee ID" value={employee.employee_id} />
            <DescriptionItem label="Gender" value={employee.gender} />
            <DescriptionItem label="Ethnicity" value={employee.ethnicity} />
            <DescriptionItem label="Birth date" value={formatDate(employee.date_of_birth)} />
            <DescriptionItem label="Hire date" value={formatDate(employee.hire_date)} />
            <DescriptionItem label="Shareholder" value={employee.shareholder_label} />
          </dl>
        </section>

        <section className="drawer__section">
          <h3>Contact</h3>
          <dl className="description-list">
            <DescriptionItem label="Email" value={employee.email} />
            <DescriptionItem label="Phone" value={employee.phone} />
            <DescriptionItem
              label="Address"
              value={employee.address ? formatAddress(employee.address) : '—'}
            />
          </dl>
        </section>
      </div>
    </div>
  );
}

function DescriptionItem({ label, value }) {
  return (
    <div className="description-list__item">
      <dt>{label}</dt>
      <dd>{value ?? '—'}</dd>
    </div>
  );
}

function formatAddress(address) {
  const parts = [address.street, address.city, address.state, address.zip].filter(Boolean);
  return parts.join(', ');
}

