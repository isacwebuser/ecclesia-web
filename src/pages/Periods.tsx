import React, { useEffect, useState } from 'react';
import { Calendar, Lock, Unlock, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { periodsService, AccountingPeriod } from '../services/periods.service';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Periods() {
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const data = await periodsService.getPeriods();
      setPeriods(data);
    } catch (error) {
      toast.error('Erro ao carregar períodos contábeis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleClosePeriod = async (id: string, month: number, year: number) => {
    try {
      setActionLoading(id);
      await periodsService.closePeriod(id);
      toast.success(`Período ${MONTH_NAMES[month - 1]}/${year} fechado com sucesso!`);
      fetchPeriods();
    } catch (error) {
      toast.error('Erro ao fechar período');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReopenPeriod = async (id: string, month: number, year: number) => {
    try {
      setActionLoading(id);
      await periodsService.reopenPeriod(id);
      toast.success(`Período ${MONTH_NAMES[month - 1]}/${year} reaberto com sucesso!`);
      fetchPeriods();
    } catch (error) {
      toast.error('Erro ao reabrir período');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Períodos Contábeis</h1>
          <p className="text-sm text-gray-500">Gerencie o fechamento mensal e a segurança dos dados financeiros.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
          <AlertCircle className="w-4 h-4" />
          <span>Períodos fechados não permitem novas transações.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-bottom border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fechado em</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fechado por</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {periods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <History className="w-12 h-12 text-gray-300 mb-4" />
                      <p>Nenhum período contábil encontrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                periods.map((period) => (
                  <tr key={period.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">
                          {MONTH_NAMES[period.month - 1]} / {period.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={period.status === 'OPEN' ? 'success' : 'danger'}>
                        {period.status === 'OPEN' ? (
                          <span className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Aberto
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Fechado
                          </span>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {period.closedAt ? new Date(period.closedAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {period.closedBy || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {period.status === 'OPEN' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={actionLoading === period.id}
                          onClick={() => handleClosePeriod(period.id, period.month, period.year)}
                          className="gap-2"
                        >
                          <Lock className="w-4 h-4" /> Fechar Mês
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={actionLoading === period.id}
                          onClick={() => handleReopenPeriod(period.id, period.month, period.year)}
                          className="gap-2"
                        >
                          <Unlock className="w-4 h-4" /> Reabrir Mês
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-900">Por que fechar o mês?</h3>
          </div>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li>• Garante a integridade dos relatórios financeiros históricos.</li>
            <li>• Evita alterações acidentais em lançamentos de meses anteriores.</li>
            <li>• Facilita a conciliação bancária e auditorias.</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-blue-900">Histórico de Fechamentos</h3>
          </div>
          <p className="text-sm text-blue-800">
            Todos os fechamentos e reaberturas são registrados no log de auditoria do sistema para garantir total transparência.
          </p>
        </div>
      </div>
    </div>
  );
}
