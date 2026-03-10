import React, { useState, useEffect } from 'react';
import {
  Plus,
  MoreVertical,
  Tag,
  ShoppingBag,
  Home,
  Zap,
  Heart,
  Coffee,
  Car,
  Settings,
  X,
  Layout,
  Palette,
  Type as TypeIcon,
  Loader2
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { categoryTemplateService } from '../services/categoryTemplateService';
import { Category, CategoryTemplate } from '../types';
import { toast } from 'sonner';

const ICON_MAP: Record<string, any> = {
  Tag,
  ShoppingBag,
  Home,
  Zap,
  Heart,
  Coffee,
  Car,
  Settings,
  Layout
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<CategoryTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    templateId: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    icon: 'Tag',
    color: 'bg-blue-50 text-blue-600'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, tmpls] = await Promise.all([
        categoryService.getCategories(),
        categoryTemplateService.getTemplates()
      ]);
      setCategories(cats);
      setTemplates(tmpls);
    } catch (error) {
      console.error('Error loading categories data', error);
      toast.error('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        templateId,
        name: template.name,
        type: template.type || 'EXPENSE',
        icon: template.icon || 'Tag',
        color: template.color || 'bg-blue-50 text-blue-600'
      });
    } else {
      setFormData({
        ...formData,
        templateId: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        color: formData.color,
        icon: formData.icon,
        templateId: formData.templateId || undefined,
        custom: !formData.templateId
      };
      await categoryService.createCategory(payload);
      toast.success('Categoria criada com sucesso!');
      await loadData();
      setIsModalOpen(false);
      setFormData({ name: '', templateId: '', type: 'EXPENSE', icon: 'Tag', color: 'bg-blue-50 text-blue-600' });
    } catch (error) {
      toast.error('Erro ao criar categoria');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await categoryService.deleteCategory(id);
        toast.success('Categoria excluída com sucesso!');
        await loadData();
      } catch (error) {
        toast.error('Erro ao excluir categoria');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 text-sm">Organize suas transações por categorias personalizadas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-500">Crie sua primeira categoria para começar a organizar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon || 'Tag'] || Tag;
            return (
              <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-xl", cat.color || 'bg-gray-50 text-gray-600')}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 hover:bg-red-50 rounded-lg text-red-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                {cat.templateId && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    Template Associado
                  </span>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{cat.count || 0} transações</span>
                  <span className="text-sm font-bold text-gray-900">R$ {(cat.total || 0).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Nova Categoria</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Template (Opcional)</label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  value={formData.templateId}
                  onChange={e => handleTemplateChange(e.target.value)}
                >
                  <option value="">Personalizada (Sem Template)</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-gray-400 italic">Selecionar um template preenche automaticamente os campos abaixo.</p>
              </div>

              {!formData.templateId && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipo da Categoria</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 mb-4"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                  >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Categoria</label>
                <div className="relative">
                  <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: Manutenção"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ícone</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {Object.keys(ICON_MAP).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cor</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                  >
                    <option value="bg-blue-50 text-blue-600">Azul</option>
                    <option value="bg-emerald-50 text-emerald-600">Verde</option>
                    <option value="bg-orange-50 text-orange-600">Laranja</option>
                    <option value="bg-purple-50 text-purple-600">Roxo</option>
                    <option value="bg-pink-50 text-pink-600">Rosa</option>
                    <option value="bg-indigo-50 text-indigo-600">Índigo</option>
                    <option value="bg-amber-50 text-amber-600">Âmbar</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

