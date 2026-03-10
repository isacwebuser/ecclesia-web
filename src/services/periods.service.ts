import api from './api';

export interface AccountingPeriod {
  id: string;
  month: number;
  year: number;
  status: 'OPEN' | 'CLOSED';
  closedAt?: string;
  closedBy?: string;
}

export const periodsService = {
  getPeriods: async () => {
    const response = await api.get<AccountingPeriod[]>('/finance/periods');
    return response.data;
  },

  closePeriod: async (year: number, month: number) => {
    const response = await api.post(`/finance/periods/${year}/${month}/close`);
    return response.data;
  },

  reopenPeriod: async (year: number, month: number, reason: string = 'Reabertura manual') => {
    const response = await api.post(`/finance/periods/${year}/${month}/reopen`, null, {
      params: { reason }
    });
    return response.data;
  },
};
