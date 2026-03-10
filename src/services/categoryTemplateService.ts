import { CategoryTemplate } from '../types';

const STORAGE_KEY = 'category_templates';

export const categoryTemplateService = {
  getTemplates: (): CategoryTemplate[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial data
      const initial: CategoryTemplate[] = [
        { id: '1', name: 'Alimentação', description: 'Gastos com restaurantes e supermercado', icon: 'Coffee', color: 'bg-orange-50 text-orange-600' },
        { id: '2', name: 'Transporte', description: 'Gastos com combustível e transporte público', icon: 'Car', color: 'bg-indigo-50 text-indigo-600' },
        { id: '3', name: 'Utilidades', description: 'Contas de luz, água e internet', icon: 'Zap', color: 'bg-amber-50 text-amber-600' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  createTemplate: (template: Omit<CategoryTemplate, 'id'>): CategoryTemplate => {
    const templates = categoryTemplateService.getTemplates();
    const newTemplate = { ...template, id: Math.random().toString(36).substr(2, 9) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...templates, newTemplate]));
    return newTemplate;
  },

  updateTemplate: (id: string, template: Partial<CategoryTemplate>): CategoryTemplate => {
    const templates = categoryTemplateService.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    const updated = { ...templates[index], ...template };
    templates[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return updated;
  },

  deleteTemplate: (id: string): void => {
    const templates = categoryTemplateService.getTemplates();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates.filter(t => t.id !== id)));
  }
};
