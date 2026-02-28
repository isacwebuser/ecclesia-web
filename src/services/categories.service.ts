import api from './api';
import { Category } from '../types';

export interface CreateCategoryRequest {
    name: string;
    type: string;
    color: string;
    icon: string;
    templateId?: string;
    custom: boolean;
}

export const CategoriesService = {
    getAll: async () => {
        const response = await api.get<Category[]>('/finance/categories');
        return response.data;
    },

    create: async (data: CreateCategoryRequest) => {
        const response = await api.post<Category>('/finance/categories', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateCategoryRequest>) => {
        const response = await api.put<Category>(`/finance/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/finance/categories/${id}`);
    }
};
