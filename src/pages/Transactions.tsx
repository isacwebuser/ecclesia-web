import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, MoreVertical, Download, Lock, Edit2, Trash2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { TransactionsService, CreateTransactionRequest } from '../services/transactions.service';
import { CategoriesService } from '../services/categories.service';
import { Transaction, Category } from '../types';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and Form Statess
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    categoryId: '',
    amount: 0,
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [txs, cats] = await Promise.all([
        TransactionsService.getAll(),
        CategoriesService.getAll()
      ]);
      setTransactions(txs);
      setCategories(cats);
    } catch (error) {
      toast.error('Erro ao carregar os dados das transações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setTypeFilter(transaction.type);
      setFormData({
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date.substring(0, 10) // assuming YYYY-MM-DD format
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        categoryId: '',
        amount: 0,
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.description || formData.amount <= 0) {
      toast.error('Preencha os campos corretamente com valores válidos');
      return;
    }

    try {
      setIsSaving(true);
      if (selectedTransaction) {
        await TransactionsService.update(selectedTransaction.id, formData);
        toast.success('Transação atualizada com sucesso!');
      } else {
        await TransactionsService.create(formData);
        toast.success('Transação criada com sucesso!');
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar transação');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await TransactionsService.delete(id);
      toast.success('Transação excluída com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir transação');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((c: any) => c.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-500 text-sm">Gerencie todas as entradas e saídas da organização</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Exportar</span>
            <span className="xs:hidden">Exp.</span>
          </button>
          <button
            onClick={() => openModal()}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria / Escopo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Valor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-lg mr-3",
                          tx.type === 'INCOME' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-gray-900">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {tx.categoryName || 'Sem Categoria'}
                        </span>
                        {tx.tenantName && tx.tenantName !== 'Sede' && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100" title="Informação de Templo Filho">
                            <Lock className="w-3 h-3" />
                            <span className="hidden sm:inline-block font-medium truncate max-w-[100px]">{tx.tenantName}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(parseISO(tx.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold",
                        tx.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {tx.status === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-sm font-bold text-right whitespace-nowrap",
                      tx.type === 'INCOME' ? "text-emerald-600" : "text-red-600"
                    )}>
                      {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(tx)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                              handleDelete(tx.id);
                            }
                          }}
                          disabled={isDeleting === tx.id}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">Mostrando {filteredTransactions.length} de {transactions.length} transações</p>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedTransaction ? "Editar Transação" : "Nova Transação"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Descrição"
            placeholder="Ex: Compra de materiais..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            autoFocus
          />

          <div className="space-y-1.5 w-full">
            <label className="block text-sm font-medium text-gray-700">Tipo de Transação</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors flex justify-center items-center",
                  typeFilter === 'INCOME'
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
                onClick={() => setTypeFilter('INCOME')}
              >
                <ArrowUpRight className="w-4 h-4 mr-1.5" /> Receita
              </button>
              <button
                type="button"
                className={cn(
                  "py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors flex justify-center items-center",
                  typeFilter === 'EXPENSE'
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
                onClick={() => setTypeFilter('EXPENSE')}
              >
                <ArrowDownLeft className="w-4 h-4 mr-1.5" /> Despesa
              </button>
            </div>
          </div>

          <Select
            label="Categoria"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={[
              ...filteredCategories.map(c => ({ value: c.id, label: c.name }))
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Data"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              label="Valor (R$)"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving} variant={typeFilter === 'INCOME' ? 'primary' : 'danger'}>
              {selectedTransaction ? 'Salvar Alterações' : 'Registrar Transação'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
