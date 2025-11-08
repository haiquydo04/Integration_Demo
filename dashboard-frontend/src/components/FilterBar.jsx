import { AlertTypeOptions, EmploymentTypeOptions, ShareholderOptions } from '../api/client.js';

export default function FilterBar({
  filters,
  onChange,
  onReset,
  departmentOptions = [],
  genderOptions = [],
  ethnicityOptions = [],
  yearOptions = [],
  monthOptions = []
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      <div className="filter-bar__inputs">
        <SelectField
          label="Year"
          name="year"
          value={filters.year}
          onChange={handleChange}
          options={yearOptions}
        />

        <SelectField
          label="Department"
          name="department"
          value={filters.department}
          onChange={handleChange}
          options={[{ label: 'All departments', value: '' }, ...departmentOptions.map((dep) => ({ label: dep, value: dep }))]}
        />

        <SelectField
          label="Gender"
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          options={[{ label: 'All genders', value: '' }, ...genderOptions.map((item) => ({ label: item, value: item }))]}
        />

        <SelectField
          label="Ethnicity"
          name="ethnicity"
          value={filters.ethnicity}
          onChange={handleChange}
          options={[{ label: 'All groups', value: '' }, ...ethnicityOptions.map((item) => ({ label: item, value: item }))]}
        />

        <SelectField
          label="Employment"
          name="employmentType"
          value={filters.employmentType}
          onChange={handleChange}
          options={EmploymentTypeOptions}
        />

        <SelectField
          label="Shareholder"
          name="shareholder"
          value={filters.shareholder}
          onChange={handleChange}
          options={ShareholderOptions}
        />

        <SelectField
          label="Alert type"
          name="alertType"
          value={filters.alertType}
          onChange={handleChange}
          options={AlertTypeOptions}
        />

        <SelectField
          label="Alerts month"
          name="month"
          value={filters.month}
          onChange={handleChange}
          options={monthOptions}
        />
      </div>

      <button type="button" className="secondary-button" onClick={onReset}>
        Reset filters
      </button>
    </section>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={`${name}-${option.value || 'all'}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

