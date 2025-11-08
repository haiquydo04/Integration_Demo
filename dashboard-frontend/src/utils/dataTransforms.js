export function normalizeEarnings(raw) {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      department: item.department ?? item.name ?? 'Unknown',
      total: Number(item.total ?? item.value ?? 0)
    }));
  }

  if (typeof raw === 'object') {
    return Object.entries(raw).map(([department, total]) => ({
      department,
      total: Number(total ?? 0)
    }));
  }

  return [];
}

export function sumEarnings(earnings = []) {
  return earnings.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
}

export function normalizeVacations(raw) {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => ({
    year: item.year ?? 'Unknown',
    gender: item.gender ?? 'Unspecified',
    ethnicity: item.ethnicity ?? 'Unspecified',
    shareholder: normaliseShareholder(item.shareholder),
    employmentType: normaliseEmploymentType(item.employment_type ?? item.employmentType),
    totalDays: Number(item.total_vacation_days ?? item.totalDays ?? 0)
  }));
}

function normaliseShareholder(value) {
  if (value === true || value === 'Shareholder') return 'Shareholder';
  if (value === false || value === 'Non-Shareholder' || value === 'Non') return 'Non-Shareholder';
  return value ?? 'Unknown';
}

function normaliseEmploymentType(value) {
  if (!value) return 'Unknown';
  const normalised = String(value).toLowerCase();
  if (normalised.includes('full')) return 'Full-time';
  if (normalised.includes('part')) return 'Part-time';
  return value;
}

export function groupVacationBy(filters, vacations) {
  const groupingKey = filters.vacationGrouping ?? 'employmentType';
  const totals = new Map();

  vacations.forEach((record) => {
    const key = record[groupingKey] ?? 'Other';
    totals.set(key, (totals.get(key) ?? 0) + (record.totalDays ?? 0));
  });

  return Array.from(totals.entries()).map(([label, value]) => ({ label, value }));
}

export function normalizeBenefits(raw) {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => ({
    planId: item.plan_id ?? item.planId ?? 'N/A',
    planName: item.plan_name ?? item.planName ?? 'Unnamed Plan',
    shareholder: normaliseShareholder(item.shareholder),
    averageContribution: Number(item.average_monthly_contribution ?? item.averageContribution ?? 0),
    sampleCount: Number(item.sample_count ?? item.sampleCount ?? 0)
  }));
}

export function buildBenefitsSummary(benefits) {
  const summary = new Map();

  benefits.forEach((item) => {
    const key = `${item.planName}|${item.shareholder}`;
    if (!summary.has(key)) {
      summary.set(key, {
        planName: item.planName,
        shareholder: item.shareholder,
        averageContribution: 0,
        sampleCount: 0
      });
    }

    const current = summary.get(key);
    const totalContribution = current.averageContribution * current.sampleCount + item.averageContribution * item.sampleCount;
    const totalSamples = current.sampleCount + item.sampleCount;
    summary.set(key, {
      ...current,
      averageContribution: totalSamples === 0 ? 0 : totalContribution / totalSamples,
      sampleCount: totalSamples
    });
  });

  return Array.from(summary.values());
}

export function normalizeAlerts(raw) {
  if (!raw) return { count: 0, alerts: [] };

  if (Array.isArray(raw)) {
    return { count: raw.length, alerts: raw };
  }

  return {
    count: raw.count ?? raw.alerts?.length ?? 0,
    alerts: raw.alerts ?? []
  };
}

export function filterEmployees(employees = [], filters = {}) {
  return employees.filter((employee) => {
    if (filters.department && employee.department !== filters.department) {
      return false;
    }
    if (filters.gender && employee.gender !== filters.gender) {
      return false;
    }
    if (filters.employmentType && employee.employment_type !== filters.employmentType) {
      return false;
    }
    if (filters.shareholder && formatShareholderBoolean(employee.shareholder) !== filters.shareholder) {
      return false;
    }
    if (filters.ethnicity && employee.ethnicity !== filters.ethnicity) {
      return false;
    }
    return true;
  });
}

function formatShareholderBoolean(value) {
  return value ? 'Shareholder' : 'Non-Shareholder';
}

export function buildDepartmentOptions(earnings, employees) {
  const departments = new Set();
  earnings.forEach((item) => departments.add(item.department));
  employees.forEach((employee) => {
    if (employee.department) {
      departments.add(employee.department);
    }
  });

  return Array.from(departments).sort();
}

export function buildEthnicityOptions(employees) {
  const options = new Set();
  employees.forEach((employee) => {
    if (employee.ethnicity) {
      options.add(employee.ethnicity);
    }
  });
  return Array.from(options).sort();
}

export function buildGenderOptions(employees) {
  const options = new Set();
  employees.forEach((employee) => {
    if (employee.gender) {
      options.add(employee.gender);
    }
  });
  return Array.from(options).sort();
}

export function enrichEmployees(employees = []) {
  return employees.map((employee) => ({
    ...employee,
    full_name: employee.full_name ?? `${employee.first_name ?? ''} ${employee.last_name ?? ''}`.trim(),
    shareholder_label: formatShareholderBoolean(employee.shareholder)
  }));
}

