import api from './api';
import { Category } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/finance/categories');
    return response.data;
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post<Category>('/finance/categories', category);
    return response.data;
  },

  updateCategory: async (id: string, category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.put<Category>(`/finance/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/finance/categories/${id}`);
  }
};
