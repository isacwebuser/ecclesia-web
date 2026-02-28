import api from './api';
import { DashboardSummary } from '../types';

export const DashboardService = {
    getSummary: async () => {
        const response = await api.get<DashboardSummary>('/finance/reports/summary');
        return response.data;
    }
};
