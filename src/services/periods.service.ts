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
    const response = await api.get<AccountingPeriod[]>('/periods');
    return response.data;
  },

  closePeriod: async (id: string) => {
    const response = await api.post(`/periods/${id}/close`);
    return response.data;
  },

  reopenPeriod: async (id: string) => {
    const response = await api.post(`/periods/${id}/reopen`);
    return response.data;
  },
};
