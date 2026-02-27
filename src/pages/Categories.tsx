import React from 'react';
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
  Settings
} from 'lucide-react';

const categories = [
  { id: '1', name: 'Dízimos', icon: Heart, color: 'bg-emerald-50 text-emerald-600', count: 124, total: 15400 },
  { id: '2', name: 'Ofertas', icon: Tag, color: 'bg-blue-50 text-blue-600', count: 86, total: 8200 },
  { id: '3', name: 'Utilidades', icon: Zap, color: 'bg-amber-50 text-amber-600', count: 12, total: 1200 },
  { id: '4', name: 'Aluguel', icon: Home, color: 'bg-purple-50 text-purple-600', count: 1, total: 1500 },
  { id: '5', name: 'Manutenção', icon: Settings, color: 'bg-gray-50 text-gray-600', count: 5, total: 850 },
  { id: '6', name: 'Eventos', icon: ShoppingBag, color: 'bg-pink-50 text-pink-600', count: 8, total: 3200 },
  { id: '7', name: 'Alimentação', icon: Coffee, color: 'bg-orange-50 text-orange-600', count: 15, total: 640 },
  { id: '8', name: 'Transporte', icon: Car, color: 'bg-indigo-50 text-indigo-600', count: 4, total: 320 },
];

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 text-sm">Organize suas transações por categorias personalizadas</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-xl", cat.color)}>
                <cat.icon className="w-6 h-6" />
              </div>
              <button className="p-1 hover:bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{cat.count} transações</span>
              <span className="text-sm font-bold text-gray-900">R$ {cat.total.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

