export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'sale' | 'expense';
  amount: number;
  category: string;
  product_name?: string;
  description?: string;
  date: string;
  cost_price?: number;
  selling_price?: number;
  quantity?: number;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  budget_amount: number;
  period_type: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    business_name?: string;
    phone?: string;
  };
}

export interface DashboardMetrics {
  revenueToday: number;
  expensesToday: number;
  profitToday: number;
  netProfit: number;
}
