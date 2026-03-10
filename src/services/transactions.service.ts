import api from './api';
import { Transaction, Category, CreateTransactionRequest } from '../types';

export const transactionsService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>('/finance/transactions');
        return response.data;
    },

    createTransaction: async (request: CreateTransactionRequest): Promise<Transaction> => {
        const response = await api.post<Transaction>('/finance/transactions', request);
        return response.data;
    },

    deleteTransaction: async (id: string): Promise<void> => {
        await api.delete(`/finance/transactions/${id}`);
    }
};
