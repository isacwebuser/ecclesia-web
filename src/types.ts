export type TransactionType = 'INCOME' | 'EXPENSE';

export interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultBudget?: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  templateId?: string;
  count?: number;
  total?: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  tenantId: string;
  cpf?: string;
  address?: string;
  cargo?: string;
}

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyData: {
    month: string;
    income: number;
    expense: number;
  }[];
}
