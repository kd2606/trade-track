"use client";

import React, { useState, useMemo } from "react";
import { Calendar, TrendingUp, TrendingDown, Package, Download, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface Transaction {
  id: string;
  type: "sale" | "expense";
  amount: number;
  category: string;
  product_name?: string;
  description?: string;
  date: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
}

interface ReportsClientProps {
  transactions: Transaction[];
  products: Product[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsClient({ transactions, products }: ReportsClientProps) {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days" | "1year" | "all">("30days");
  const [reportType, setReportType] = useState<"overview" | "products" | "categories" | "trends">("overview");

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (dateRange) {
      case "7days":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return transactions;
    }

    return transactions.filter(tx => new Date(tx.date) >= cutoffDate);
  }, [transactions, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const sales = filteredTransactions.filter(tx => tx.type === "sale");
    const expenses = filteredTransactions.filter(tx => tx.type === "expense");

    const totalRevenue = sales.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      totalTransactions: filteredTransactions.length,
      totalSales: sales.length,
      totalExpensesCount: expenses.length,
    };
  }, [filteredTransactions]);

  // Product performance data
  const productPerformance = useMemo(() => {
    const productMap = new Map<string, { revenue: number; quantity: number; profit: number }>();

    filteredTransactions.forEach(tx => {
      if (tx.type === "sale" && tx.product_name) {
        const existing = productMap.get(tx.product_name) || { revenue: 0, quantity: 0, profit: 0 };
        const profit = (tx.selling_price - tx.cost_price) * tx.quantity;
        
        productMap.set(tx.product_name, {
          revenue: existing.revenue + tx.amount,
          quantity: existing.quantity + tx.quantity,
          profit: existing.profit + profit,
        });
      }
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products
  }, [filteredTransactions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, { sales: number; expenses: number }>();

    filteredTransactions.forEach(tx => {
      const existing = categoryMap.get(tx.category) || { sales: 0, expenses: 0 };
      
      if (tx.type === "sale") {
        existing.sales += tx.amount;
      } else {
        existing.expenses += tx.amount;
      }
      
      categoryMap.set(tx.category, existing);
    });

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      sales: data.sales,
      expenses: data.expenses,
      total: data.sales + data.expenses,
    }));
  }, [filteredTransactions]);

  // Daily trend data
  const dailyTrends = useMemo(() => {
    const dailyMap = new Map<string, { revenue: number; expenses: number; profit: number }>();

    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const existing = dailyMap.get(date) || { revenue: 0, expenses: 0, profit: 0 };
      
      if (tx.type === "sale") {
        existing.revenue += tx.amount;
        existing.profit += tx.amount;
      } else {
        existing.expenses += tx.amount;
        existing.profit -= tx.amount;
      }
      
      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions]);

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = ["Date", "Type", "Product", "Category", "Amount", "Quantity", "Description"];
    const csvData = filteredTransactions.map(tx => [
      new Date(tx.date).toLocaleDateString("en-IN"),
      tx.type,
      tx.product_name || "",
      tx.category,
      tx.amount.toString(),
      tx.quantity.toString(),
      tx.description || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradetrack-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-600 mt-1">Detailed analytics and insights for your business</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overview">Overview</option>
            <option value="products">Products</option>
            <option value="categories">Categories</option>
            <option value="trends">Trends</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString("en-IN")}</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{metrics.totalExpenses.toLocaleString("en-IN")}</p>
            </div>
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${metrics.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{metrics.netProfit.toLocaleString("en-IN")}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${metrics.netProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              <TrendingUp className={metrics.netProfit >= 0 ? "text-green-600" : "text-red-600"} size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.profitMargin.toFixed(1)}%</p>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {reportType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Expenses Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {reportType === "products" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={productPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportType === "categories" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#10b981" name="Sales" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportType === "trends" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Profit" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
