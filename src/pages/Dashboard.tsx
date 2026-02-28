import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Lock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DashboardService } from '../services/dashboard.service';
import { TransactionsService } from '../services/transactions.service';
import { DashboardSummary, Transaction } from '../types';
import { toast } from 'sonner';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [dashData, txData] = await Promise.all([
          DashboardService.getSummary(),
          TransactionsService.getAll()
        ]);

        setSummary(dashData);
        // Gets at most 5 recent transactions
        setRecentTransactions(txData.slice(0, 5));
      } catch (error) {
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-96"></div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-96"></div>
        </div>
      </div>
    );
  }

  const chartData = summary?.monthlyData || [];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            {summary?.scopeType === 'CONSOLIDATED' && (
              <span className="text-[10px] md:text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">Visão Consolidada</span>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Saldo Atual ({summary?.tenantName})</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
            R$ {(summary?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Total Receitas</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 text-emerald-600">
            + R$ {(summary?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Total Despesas</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 text-red-600">
            - R$ {(summary?.totalExpense || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">Fluxo de Caixa Operacional</h4>
          <div className="flex-1 min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                    labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Receitas"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Despesas"
                    stroke="#EF4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <Calendar className="w-12 h-12 mb-2 opacity-50" />
                <p>Nenhum dado consolidado no período.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">Transações Recentes</h4>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-100/80 rounded-xl transition-colors">
                <div className="flex items-center overflow-hidden">
                  <div className={cn(
                    "p-2 rounded-lg mr-3 shadow-sm",
                    tx.type === 'INCOME' ? "bg-white border border-emerald-100" : "bg-white border border-red-100"
                  )}>
                    {tx.type === 'INCOME' ? (
                      <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{tx.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="truncate max-w-[120px]">{tx.categoryName || 'S/ Categoria'}</span>
                      <span>•</span>
                      <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-3 ml-2 flex-shrink-0">
                  <p className={cn(
                    "text-sm font-bold whitespace-nowrap",
                    tx.type === 'INCOME' ? "text-emerald-600" : "text-red-600"
                  )}>
                    {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {tx.tenantName && tx.tenantName !== 'Sede' && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-amber-600/80" title="Informação de Templo Filho">
                      <Lock className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[80px]">{tx.tenantName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {recentTransactions.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-400 py-10">
                <p>Nenhuma transação recente encontrada.</p>
              </div>
            )}
          </div>
          {recentTransactions.length > 0 && (
            <button className="w-full mt-4 py-2.5 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
              Explorar Histórico
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
