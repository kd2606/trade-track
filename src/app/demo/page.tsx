"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardClient from "../dashboard/DashboardClient";

const demoData = [
  {
    id: 'demo-1',
    user_id: 'demo-user',
    type: 'sale',
    amount: 25800,
    category: 'Sale',
    description: 'Laptop Sale',
    product_name: 'Dell Laptop',
    cost_price: 23800,
    selling_price: 25800,
    quantity: 1,
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-2',
    user_id: 'demo-user',
    type: 'sale',
    amount: 4500,
    category: 'Sale',
    description: 'Office Chair Sale',
    product_name: 'Ergonomic Chair',
    cost_price: 3200,
    selling_price: 4500,
    quantity: 2,
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'demo-3',
    user_id: 'demo-user',
    type: 'expense',
    amount: 5000,
    category: 'Office Supplies',
    description: 'Stationery and printer paper',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'demo-4',
    user_id: 'demo-user',
    type: 'sale',
    amount: 12000,
    category: 'Sale',
    description: 'Monitor Sale',
    product_name: 'Samsung Monitor',
    cost_price: 8500,
    selling_price: 12000,
    quantity: 1,
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    created_at: new Date(Date.now() - 345600000).toISOString()
  }
];

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo mode
    localStorage.setItem('demoMode', 'true');
  }, []);

  // Calculate metrics for demo data
  const transactions = demoData;
  let revenueToday = 0;
  let expensesToday = 0;
  let totalRevenue = 0;
  let totalExpenses = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expenseBreakdown: Record<string, number> = {};
  const dailyData: Record<string, { revenue: number; expense: number; profit: number }> = {};

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const amount = Number(tx.amount);

    const dateStr = txDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { revenue: 0, expense: 0, profit: 0 };
    }

    if (tx.type === "sale") {
      const sellingPrice = Number(tx.selling_price || 0);
      const costPrice = Number(tx.cost_price || 0);
      const quantity = Number(tx.quantity || 1);
      
      const totalSellingPrice = sellingPrice * quantity;
      const totalCostPrice = costPrice * quantity;
      const profit = totalSellingPrice - totalCostPrice;

      totalRevenue += totalSellingPrice;
      totalExpenses += totalCostPrice;
      dailyData[dateStr].revenue += totalSellingPrice;
      dailyData[dateStr].expense += totalCostPrice;
      dailyData[dateStr].profit += profit;

      if (txDate >= today) {
        revenueToday += totalSellingPrice;
        expensesToday += totalCostPrice;
      }
    } else if (tx.type === "expense") {
      totalExpenses += amount;
      dailyData[dateStr].expense += amount;
      dailyData[dateStr].profit -= amount;

      expenseBreakdown[tx.category] = (expenseBreakdown[tx.category] || 0) + amount;

      if (txDate >= today) {
        expensesToday += amount;
      }
    }
  });

  const profitToday = revenueToday - expensesToday;
  const netProfit = totalRevenue - totalExpenses;

  const metrics = {
    revenueToday,
    expensesToday,
    profitToday,
    netProfit,
  };

  const expenseData = Object.entries(expenseBreakdown).map(([name, value]) => ({ name, value }));
  const sortedDates = Object.keys(dailyData).reverse();
  const profitData = sortedDates.map((date) => ({
    name: date,
    profit: dailyData[date].profit,
  }));

  const revVsExpData = sortedDates.map((date) => ({
    name: date,
    revenue: dailyData[date].revenue,
    expense: dailyData[date].expense,
  }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Demo Mode Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 m-6 flex items-center gap-3">
        <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <h3 className="text-amber-800 font-semibold">Demo Mode Active</h3>
          <p className="text-amber-700 text-sm">You're viewing sample data. Sign in with Google to use real data.</p>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <DashboardClient
          metrics={metrics}
          profitData={profitData}
          expenseData={expenseData}
          revVsExpData={revVsExpData}
          recentTransactions={recentTransactions}
        />
      </div>
    </div>
  );
}
