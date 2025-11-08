const API_BASE = '/api/integration';

function createQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

async function apiGet(endpoint, params) {
  const query = createQueryString(params);
  const response = await fetch(`${API_BASE}${endpoint}${query}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Request failed [${response.status}]: ${message}`);
  }

  return response.json();
}

export const IntegrationApi = {
  fetchEarnings: (filters) => apiGet('/earnings', filters),
  fetchVacationDays: (filters) => apiGet('/vacations', filters),
  fetchBenefits: (filters) => apiGet('/benefits', filters),
  fetchAlerts: (filters) => apiGet('/alerts', filters),
  fetchEmployees: (filters) => apiGet('/employees/details', filters)
};

export const AlertTypeOptions = [
  { label: 'All alerts', value: '' },
  { label: 'Birthdays', value: 'Birthday' },
  { label: 'Anniversaries', value: 'Anniversary' },
  { label: 'Vacation limit exceeded', value: 'Vacation Exceeded' },
  { label: 'Benefit changes', value: 'Benefit Change' },
  { label: 'Payroll adjustments', value: 'Payroll Adjustment' }
];

export const EmploymentTypeOptions = [
  { label: 'All types', value: '' },
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Part-time', value: 'Part-time' }
];

export const ShareholderOptions = [
  { label: 'All employees', value: '' },
  { label: 'Shareholders', value: 'Shareholder' },
  { label: 'Non-shareholders', value: 'Non-Shareholder' }
];

