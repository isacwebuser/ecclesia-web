import api from './api';
import { Transaction } from '../types';

export interface CreateTransactionRequest {
    categoryId: string;
    amount: number;
    description: string;
    date: string;
}

export const TransactionsService = {
    getAll: async () => {
        const response = await api.get<Transaction[]>('/finance/transactions');
        return response.data;
    },

    create: async (data: CreateTransactionRequest) => {
        const response = await api.post<Transaction>('/finance/transactions', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateTransactionRequest>) => {
        const response = await api.put<Transaction>(`/finance/transactions/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/finance/transactions/${id}`);
    }
};
