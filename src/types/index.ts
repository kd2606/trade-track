export interface Transaction {
  id: string;
  user_id: string;
  type: "sale" | "expense";
  amount: number;
  category: string;
  product_name?: string;
  description?: string;
  date: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  created_at: string;
}

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

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}
