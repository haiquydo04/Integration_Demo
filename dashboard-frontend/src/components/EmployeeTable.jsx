import { useMemo, useState } from 'react';
import { enrichEmployees } from '../utils/dataTransforms.js';

export default function EmployeeTable({ data, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const employees = useMemo(() => enrichEmployees(data ?? []), [data]);

  const filtered = useMemo(() => {
    if (!searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter((employee) =>
      [employee.full_name, employee.department, employee.employee_id, employee.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [employees, searchTerm]);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Employee Directory</h2>
          <p>Select a row to drill down into the full employee profile.</p>
        </div>

        <div className="table-actions">
          <label className="filter-field">
            <span className="visually-hidden">Search employees</span>
            <input
              type="search"
              placeholder="Search by name, department, ID…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </div>
      </header>

      <div className="panel__content panel__content--table">
        {filtered.length === 0 ? (
          <p>No employees match the current filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Department</th>
                <th scope="col">Employment type</th>
                <th scope="col">Shareholder</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.employee_id} tabIndex={0} onClick={() => onSelect(employee)} onKeyDown={(event) => handleRowKeyDown(event, employee, onSelect)}>
                  <td>
                    <div className="employee-cell">
                      <span className="employee-cell__avatar" aria-hidden>
                        {employee.full_name?.[0] ?? employee.first_name?.[0] ?? '?'}
                      </span>
                      <div>
                        <div className="employee-cell__name">{employee.full_name || 'Unknown'}</div>
                        <div className="employee-cell__id">{employee.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.department ?? '—'}</td>
                  <td>{employee.employment_type ?? employee.employmentType ?? '—'}</td>
                  <td>{employee.shareholder_label ?? '—'}</td>
                  <td>{employee.email ?? '—'}</td>
                  <td>{employee.phone ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function handleRowKeyDown(event, employee, onSelect) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect(employee);
  }
}

