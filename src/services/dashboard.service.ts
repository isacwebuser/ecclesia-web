import api from './api';

export interface MonthlyChartDataDTO {
    month: string;
    income: number;
    expense: number;
}

export interface ReportSummaryDto {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    monthlyData: MonthlyChartDataDTO[];
}

export const dashboardService = {
    getSummary: async (): Promise<ReportSummaryDto> => {
        const response = await api.get<ReportSummaryDto>('/finance/reports/summary');
        return response.data;
    }
};
