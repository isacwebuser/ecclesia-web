import api from './api';
import { CategoryTemplate } from '../types';

export const categoryTemplateService = {
  getTemplates: async (): Promise<CategoryTemplate[]> => {
    const response = await api.get<CategoryTemplate[]>('/finance/category-templates');
    return response.data;
  },

  createTemplate: async (template: Omit<CategoryTemplate, 'id'>): Promise<CategoryTemplate> => {
    const response = await api.post<CategoryTemplate>('/finance/category-templates', template);
    return response.data;
  },

  updateTemplate: async (id: string, template: Partial<CategoryTemplate>): Promise<CategoryTemplate> => {
    const response = await api.put<CategoryTemplate>(`/finance/category-templates/${id}`, template);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/finance/category-templates/${id}`);
  }
};
