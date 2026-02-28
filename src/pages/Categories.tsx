import React, { useState, useEffect } from 'react';
import {
  Plus, MoreVertical, Tag, ShoppingBag, Home, Zap, Heart, Coffee, Car, Settings, Edit2, Trash2, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { CategoriesService, CreateCategoryRequest } from '../services/categories.service';
import { Category } from '../types';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

// Icon mapper
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name?: string, className?: string }) => {
  if (!name) return <Tag className={className} />;
  const IconComponent = Icons[name as keyof typeof Icons] as React.ElementType;
  if (!IconComponent) return <Tag className={className} />;
  return <IconComponent className={className} />;
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const CATEGORY_ICONS = [
  'Heart', 'Tag', 'Zap', 'Home', 'Settings', 'ShoppingBag', 'Coffee', 'Car', 'Briefcase', 'Book', 'Gift', 'Monitor'
];

const CATEGORY_COLORS = [
  { value: 'bg-emerald-50 text-emerald-600', label: 'Verde (Emerald)' },
  { value: 'bg-blue-50 text-blue-600', label: 'Azul (Blue)' },
  { value: 'bg-amber-50 text-amber-600', label: 'Amarelo (Amber)' },
  { value: 'bg-purple-50 text-purple-600', label: 'Roxo (Purple)' },
  { value: 'bg-pink-50 text-pink-600', label: 'Rosa (Pink)' },
  { value: 'bg-orange-50 text-orange-600', label: 'Laranja (Orange)' },
  { value: 'bg-indigo-50 text-indigo-600', label: 'Anil (Indigo)' },
  { value: 'bg-gray-50 text-gray-600', label: 'Cinza (Gray)' },
  { value: 'bg-red-50 text-red-600', label: 'Vermelho (Red)' },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    type: 'EXPENSE',
    color: CATEGORY_COLORS[0].value,
    icon: 'Tag',
    custom: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await CategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        type: (category as any).type || 'EXPENSE',
        color: category.color || CATEGORY_COLORS[0].value,
        icon: category.icon || 'Tag',
        custom: true
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        type: 'EXPENSE',
        color: CATEGORY_COLORS[0].value,
        icon: 'Tag',
        custom: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('O nome é obrigatório');
      return;
    }

    try {
      setIsSaving(true);
      if (selectedCategory) {
        await CategoriesService.update(selectedCategory.id, formData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await CategoriesService.create(formData);
        toast.success('Categoria criada com sucesso!');
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      toast.error('Erro ao salvar categoria');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await CategoriesService.delete(id);
      toast.success('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (error) {
      toast.error('Erro ao excluir categoria');
    } finally {
      setIsDeleting(null);
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
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-36"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-xl", cat.color || "bg-gray-50 text-gray-600")}>
                  <DynamicIcon name={cat.icon} className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
                        handleDelete(cat.id);
                      }
                    }}
                    disabled={isDeleting === cat.id}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 flex items-center gap-1">
                  {(cat as any).type === 'INCOME' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownLeft className="w-3 h-3 text-red-500" />}
                  {(cat as any).type === 'INCOME' ? 'Receita' : 'Despesa'}
                </span>
                {cat.id.length > 5 && <span className="text-[10px] text-gray-400 font-mono" title="ID do banco">{(cat as any).tenantName || 'Sede'}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Categoria"
            placeholder="Ex: Dízimos, Aluguel..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
          />

          <Select
            label="Tipo"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'INCOME', label: 'Receita (Entrada)' },
              { value: 'EXPENSE', label: 'Despesa (Saída)' }
            ]}
          />

          <Select
            label="Cor"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            options={CATEGORY_COLORS}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-6 gap-2">
              {CATEGORY_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: iconName })}
                  className={cn(
                    "p-2.5 rounded-xl border flex items-center justify-center transition-all",
                    formData.icon === iconName
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-gray-200 hover:bg-gray-50 text-gray-500"
                  )}
                >
                  <DynamicIcon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {selectedCategory ? 'Salvar Alterações' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
