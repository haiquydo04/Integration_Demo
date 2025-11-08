import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { IntegrationApi } from '../api/client.js';

function selectFilters(filters) {
  const base = {
    year: filters.year,
    department: filters.department,
    gender: filters.gender,
    ethnicity: filters.ethnicity,
    shareholder: filters.shareholder,
    employment_type: filters.employmentType
  };

  return Object.fromEntries(
    Object.entries(base).filter(([, value]) => value !== undefined && value !== '' && value !== null)
  );
}

export function useDashboardData(filters) {
  const commonFilters = useMemo(() => selectFilters(filters), [filters]);
  const alertFilters = useMemo(
    () => ({
      type: filters.alertType,
      month: filters.month
    }),
    [filters.alertType, filters.month]
  );

  const results = useQueries({
    queries: [
      {
        queryKey: ['earnings', commonFilters],
        queryFn: () => IntegrationApi.fetchEarnings(commonFilters)
      },
      {
        queryKey: ['vacation-days', commonFilters],
        queryFn: () => IntegrationApi.fetchVacationDays(commonFilters)
      },
      {
        queryKey: ['benefits', commonFilters],
        queryFn: () => IntegrationApi.fetchBenefits(commonFilters)
      },
      {
        queryKey: ['alerts', alertFilters],
        queryFn: () => IntegrationApi.fetchAlerts(alertFilters)
      },
      {
        queryKey: ['employees'],
        queryFn: () => IntegrationApi.fetchEmployees()
      }
    ]
  });

  const [earnings, vacations, benefits, alerts, employees] = results;

  return {
    earnings,
    vacations,
    benefits,
    alerts,
    employees,
    isLoading: results.some((result) => result.isPending),
    isError: results.some((result) => result.isError),
    refetchAll: () => results.forEach((result) => result.refetch?.())
  };
}

