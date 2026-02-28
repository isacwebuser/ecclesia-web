import { Category } from '../types';

const STORAGE_KEY = 'categories';

export const categoryService = {
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial data from the hardcoded list in Categories.tsx
      const initial: Category[] = [
        { id: '1', name: 'Dízimos', icon: 'Heart', color: 'bg-emerald-50 text-emerald-600', count: 124, total: 15400 },
        { id: '2', name: 'Ofertas', icon: 'Tag', color: 'bg-blue-50 text-blue-600', count: 86, total: 8200 },
        { id: '3', name: 'Utilidades', icon: 'Zap', color: 'bg-amber-50 text-amber-600', count: 12, total: 1200 },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  createCategory: (category: Omit<Category, 'id'>): Category => {
    const categories = categoryService.getCategories();
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9), count: 0, total: 0 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...categories, newCategory]));
    return newCategory;
  },

  deleteCategory: (id: string): void => {
    const categories = categoryService.getCategories();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.filter(c => c.id !== id)));
  }
};
