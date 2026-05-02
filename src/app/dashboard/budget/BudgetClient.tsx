"use client";

import React, { useState, useMemo } from "react";
import { Plus, Target, TrendingUp, TrendingDown, AlertCircle, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/types";

interface Budget {
  id: string;
  category: string;
  budget_amount: number;
  period_type: "monthly" | "quarterly" | "yearly";
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface BudgetClientProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function BudgetClient({ transactions, budgets }: BudgetClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    budget_amount: "",
    period_type: "monthly" as "monthly" | "quarterly" | "yearly",
    start_date: "",
    end_date: "",
    description: ""
  });

  const categories = [
    "Rent",
    "Utilities",
    "Salaries",
    "Marketing",
    "Office Supplies",
    "Inventory",
    "Equipment",
    "Maintenance",
    "Insurance",
    "Taxes",
    "Bank Fees",
    "Software",
    "Travel",
    "Meals",
    "Training",
    "Legal",
    "Accounting",
    "Other"
  ];

  // Calculate budget vs actual for each budget
  const budgetAnalysis = useMemo(() => {
    return budgets.map(budget => {
      // Filter transactions within budget period and category
      const relevantTransactions = transactions.filter(tx => 
        tx.category === budget.category &&
        tx.type === 'expense' &&
        new Date(tx.date) >= new Date(budget.start_date) &&
        new Date(tx.date) <= new Date(budget.end_date)
      );

      const actualSpent = relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const remaining = budget.budget_amount - actualSpent;
      const percentageUsed = (actualSpent / budget.budget_amount) * 100;
      const status = percentageUsed >= 100 ? "over" : percentageUsed >= 80 ? "warning" : "good";

      return {
        ...budget,
        actualSpent,
        remaining,
        percentageUsed,
        status,
        transactionCount: relevantTransactions.length
      };
    });
  }, [budgets, transactions]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget_amount, 0);
    const totalSpent = budgetAnalysis.reduce((sum, b) => sum + b.actualSpent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overallPercentage
    };
  }, [budgets, budgetAnalysis]);

  // Cash flow projections
  const cashFlowData = useMemo(() => {
    const monthlyData = new Map<string, { income: number; expenses: number; net: number }>();
    
    transactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'short' });
      const existing = monthlyData.get(month) || { income: 0, expenses: 0, net: 0 };
      
      if (tx.type === 'sale') {
        existing.income += tx.amount;
        existing.net += tx.amount;
      } else {
        existing.expenses += tx.amount;
        existing.net -= tx.amount;
      }
      
      monthlyData.set(month, existing);
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-12); // Last 12 months
  }, [transactions]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/budgets', {
        method: editingBudget ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget_amount: parseFloat(formData.budget_amount),
          id: editingBudget?.id
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingBudget(null);
        setFormData({
          category: "",
          budget_amount: "",
          period_type: "monthly",
          start_date: "",
          end_date: "",
          description: ""
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      budget_amount: budget.budget_amount.toString(),
      period_type: budget.period_type,
      start_date: budget.start_date,
      end_date: budget.end_date,
      description: budget.description || ""
    });
    setShowAddModal(true);
  };

  const handleDelete = async (budgetId: string) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Failed to delete budget. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "over": return "text-red-600 bg-red-50 border-red-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "good": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "over": return <AlertCircle className="w-4 h-4" />;
      case "warning": return <TrendingDown className="w-4 h-4" />;
      case "good": return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget & Cash Flow</h1>
          <p className="text-gray-600 mt-1">Track budget vs actual spending and cash flow projections</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">₹{overallMetrics.totalBudget.toLocaleString('en-IN')}</p>
              </div>
              <Target className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{overallMetrics.totalSpent.toLocaleString('en-IN')}</p>
              </div>
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${overallMetrics.totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{overallMetrics.totalRemaining.toLocaleString('en-IN')}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Used</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.overallPercentage.toFixed(1)}%</p>
              </div>
              <div className={`p-2 rounded-lg ${overallMetrics.overallPercentage >= 100 ? 'bg-red-100' : overallMetrics.overallPercentage >= 80 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {getStatusIcon(overallMetrics.overallPercentage >= 100 ? 'over' : overallMetrics.overallPercentage >= 80 ? 'warning' : 'good')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>
            Compare your budgeted amounts with actual spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-900">Category</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Budget</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Spent</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Remaining</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Usage</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {budgetAnalysis.map((budget) => (
                  <tr key={budget.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">{budget.category}</div>
                        <div className="text-sm text-gray-500">{budget.period_type}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">₹{budget.budget_amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-sm text-gray-900">₹{budget.actualSpent.toLocaleString('en-IN')}</td>
                    <td className="py-4">
                      <span className={`text-sm font-medium ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{budget.remaining.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              budget.percentageUsed >= 100 ? 'bg-red-500' : 
                              budget.percentageUsed >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{budget.percentageUsed.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(budget.status)}`}>
                        {getStatusIcon(budget.status)}
                        {budget.status}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(budget)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(budget.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {budgetAnalysis.length === 0 && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No budgets found</p>
                <p className="text-sm text-gray-400 mt-1">Create your first budget to start tracking</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
          <CardDescription>
            Monthly income, expenses, and net cash flow over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cashFlowData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{month.month}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-500">Income:</span>
                    <span className="ml-2 font-medium text-green-600">₹{month.income.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Expenses:</span>
                    <span className="ml-2 font-medium text-red-600">₹{month.expenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Net:</span>
                    <span className={`ml-2 font-bold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{month.net.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</CardTitle>
              <CardDescription>
                {editingBudget ? 'Update budget information' : 'Create a new budget for expense tracking'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="budget_amount">Budget Amount (₹) *</Label>
                    <Input
                      id="budget_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.budget_amount}
                      onChange={(e) => handleInputChange('budget_amount', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="period_type">Period Type *</Label>
                    <select
                      id="period_type"
                      value={formData.period_type}
                      onChange={(e) => handleInputChange('period_type', e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Budget description..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingBudget(null);
                      setFormData({
                        category: "",
                        budget_amount: "",
                        period_type: "monthly",
                        start_date: "",
                        end_date: "",
                        description: ""
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingBudget ? 'Update Budget' : 'Add Budget'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
