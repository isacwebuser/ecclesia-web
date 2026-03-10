import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Loader2
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
import { dashboardService, ReportSummaryDto } from '../services/dashboard.service';
import { transactionsService } from '../services/transactions.service';
import { Transaction } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<ReportSummaryDto | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [sumData, txData] = await Promise.all([
          dashboardService.getSummary(),
          transactionsService.getTransactions()
        ]);
        setSummary(sumData);
        // show last 5 transactions
        setRecentTransactions(txData.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Default empty state protection if summary fails
  const safeData = summary?.monthlyData || [];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Saldo Atual</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">R$ {(summary?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Receitas (Mês)</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">R$ {(summary?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Despesas (Mês)</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">R$ {(summary?.totalExpense || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Caixa</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={0}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Transações Recentes</h4>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center">
                  <div className={cn(
                    "p-2 rounded-lg mr-4",
                    tx.type === 'INCOME' ? "bg-emerald-50" : "bg-red-50"
                  )}>
                    {tx.type === 'INCOME' ? (
                      <ArrowUpRight className={cn("w-5 h-5", "text-emerald-600")} />
                    ) : (
                      <ArrowDownLeft className={cn("w-5 h-5", "text-red-600")} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.categoryName || 'Sem Categoria'} • {new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  tx.type === 'INCOME' ? "text-emerald-600" : "text-red-600"
                )}>
                  {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            Ver todas as transações
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
