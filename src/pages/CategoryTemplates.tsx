import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Layout, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X,
  Palette,
  Type
} from 'lucide-react';
import { categoryTemplateService } from '../services/categoryTemplateService';
import { CategoryTemplate } from '../types';
import { toast } from 'sonner';

export default function CategoryTemplates() {
  const [templates, setTemplates] = useState<CategoryTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<CategoryTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Tag',
    color: 'bg-blue-50 text-blue-600'
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(categoryTemplateService.getTemplates());
  };

  const handleOpenModal = (template?: CategoryTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description,
        icon: template.icon,
        color: template.color
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        icon: 'Tag',
        color: 'bg-blue-50 text-blue-600'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        categoryTemplateService.updateTemplate(editingTemplate.id, formData);
        toast.success('Template atualizado com sucesso!');
      } else {
        categoryTemplateService.createTemplate(formData);
        toast.success('Template criado com sucesso!');
      }
      loadTemplates();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar template');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      categoryTemplateService.deleteTemplate(id);
      loadTemplates();
      toast.success('Template excluído com sucesso!');
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Categorias</h1>
          <p className="text-gray-500 text-sm">Gerencie padrões de categorias para sua plataforma SaaS</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar templates..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${template.color}`}>
                <Layout className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(template)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{template.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ícone: {template.icon}</span>
              <div className={`w-4 h-4 rounded-full ${template.color.split(' ')[0]}`} />
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Template</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Alimentação"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="Descreva o propósito deste template..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ícone</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                  >
                    <option value="Tag">Tag</option>
                    <option value="Coffee">Café</option>
                    <option value="Car">Carro</option>
                    <option value="Zap">Energia</option>
                    <option value="Heart">Coração</option>
                    <option value="Home">Casa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cor</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
                  >
                    <option value="bg-blue-50 text-blue-600">Azul</option>
                    <option value="bg-emerald-50 text-emerald-600">Verde</option>
                    <option value="bg-orange-50 text-orange-600">Laranja</option>
                    <option value="bg-purple-50 text-purple-600">Roxo</option>
                    <option value="bg-pink-50 text-pink-600">Rosa</option>
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
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  {editingTemplate ? 'Salvar Alterações' : 'Criar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
