"use client";

import React, { useState, useMemo } from "react";
import { Calculator, Download, Calendar, FileText, TrendingUp, PieChart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/types";

interface TaxClientProps {
  transactions: Transaction[];
}

export default function TaxClient({ transactions }: TaxClientProps) {
  const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());
  const [gstRate, setGstRate] = useState("18"); // Default GST rate in India
  const [incomeTaxRate, setIncomeTaxRate] = useState("30"); // Default income tax rate

  // Filter transactions by tax year
  const yearTransactions = useMemo(() => {
    const year = parseInt(taxYear);
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === year;
    });
  }, [transactions, taxYear]);

  // Calculate tax metrics
  const taxMetrics = useMemo(() => {
    const sales = yearTransactions.filter(tx => tx.type === 'sale');
    const expenses = yearTransactions.filter(tx => tx.type === 'expense');

    const totalRevenue = sales.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    const grossProfit = totalRevenue - totalExpenses;

    // GST calculations (assuming all sales are taxable)
    const gstRateDecimal = parseFloat(gstRate) / 100;
    const gstCollected = totalRevenue * gstRateDecimal;
    const gstPaid = 0; // Would need to track GST on expenses
    const netGstPayable = gstCollected - gstPaid;

    // Income tax calculations
    const incomeTaxRateDecimal = parseFloat(incomeTaxRate) / 100;
    const incomeTaxPayable = Math.max(0, grossProfit * incomeTaxRateDecimal);

    // Category-wise expense breakdown
    const expenseByCategory = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    // Monthly breakdown
    const monthlyData = new Map<string, { revenue: number; expenses: number; profit: number }>();
    yearTransactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' });
      const existing = monthlyData.get(month) || { revenue: 0, expenses: 0, profit: 0 };
      
      if (tx.type === 'sale') {
        existing.revenue += tx.amount;
        existing.profit += tx.amount;
      } else {
        existing.expenses += tx.amount;
        existing.profit -= tx.amount;
      }
      
      monthlyData.set(month, existing);
    });

    return {
      totalRevenue,
      totalExpenses,
      grossProfit,
      gstCollected,
      gstPaid,
      netGstPayable,
      incomeTaxPayable,
      totalTaxLiability: netGstPayable + incomeTaxPayable,
      netProfitAfterTax: grossProfit - incomeTaxPayable,
      expenseByCategory,
      monthlyData: Array.from(monthlyData.entries()).map(([month, data]) => ({ month, ...data }))
    };
  }, [yearTransactions, gstRate, incomeTaxRate]);

  // Generate tax report
  const generateTaxReport = () => {
    const report = {
      taxYear,
      gstRate: `${gstRate}%`,
      incomeTaxRate: `${incomeTaxRate}%`,
      metrics: taxMetrics,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${taxYear}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate CSV report
  const generateCSVReport = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'GST Amount', 'Taxable Amount'];
    const csvData = yearTransactions.map(tx => {
      const gstAmount = tx.type === 'sale' ? tx.amount * (parseFloat(gstRate) / 100) : 0;
      return [
        new Date(tx.date).toLocaleDateString('en-IN'),
        tx.type,
        tx.category,
        tx.description || '',
        tx.amount.toString(),
        gstAmount.toString(),
        (tx.amount - gstAmount).toString()
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-transactions-${taxYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categoryChartData = Object.entries(taxMetrics.expenseByCategory).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Reporting</h1>
          <p className="text-gray-600 mt-1">Calculate and track your tax obligations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateCSVReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={generateTaxReport}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Tax Settings
          </CardTitle>
          <CardDescription>
            Configure tax rates and reporting period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="taxYear">Tax Year</Label>
              <select
                id="taxYear"
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                placeholder="18"
              />
            </div>
            <div>
              <Label htmlFor="incomeTaxRate">Income Tax Rate (%)</Label>
              <Input
                id="incomeTaxRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={incomeTaxRate}
                onChange={(e) => setIncomeTaxRate(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{taxMetrics.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{taxMetrics.totalExpenses.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gross Profit</p>
                <p className={`text-2xl font-bold ${taxMetrics.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{taxMetrics.grossProfit.toLocaleString('en-IN')}
                </p>
              </div>
              <Calculator className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tax Liability</p>
                <p className="text-2xl font-bold text-red-600">₹{taxMetrics.totalTaxLiability.toLocaleString('en-IN')}</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST Calculation */}
        <Card>
          <CardHeader>
            <CardTitle>GST Calculation</CardTitle>
            <CardDescription>
              Goods and Services Tax calculations for {taxYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">GST Collected</span>
                <span className="text-sm font-bold text-green-600">₹{taxMetrics.gstCollected.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">GST Paid</span>
                <span className="text-sm font-bold text-blue-600">₹{taxMetrics.gstPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Net GST Payable</span>
                <span className={`text-sm font-bold ${taxMetrics.netGstPayable >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{taxMetrics.netGstPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Tax Calculation */}
        <Card>
          <CardHeader>
            <CardTitle>Income Tax Calculation</CardTitle>
            <CardDescription>
              Income tax calculations for {taxYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Gross Profit</span>
                <span className="text-sm font-bold text-gray-900">₹{taxMetrics.grossProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Income Tax Rate</span>
                <span className="text-sm font-bold text-gray-900">{incomeTaxRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Income Tax Payable</span>
                <span className="text-sm font-bold text-red-600">₹{taxMetrics.incomeTaxPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Net Profit After Tax</span>
                <span className={`text-sm font-bold ${taxMetrics.netProfitAfterTax >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{taxMetrics.netProfitAfterTax.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Expense Category Breakdown
          </CardTitle>
          <CardDescription>
            Tax-deductible expenses by category for {taxYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(taxMetrics.expenseByCategory).map(([category, amount]) => (
              <div key={category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{category}</span>
                  <span className="text-sm font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(amount / taxMetrics.totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Tax Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Tax Summary
          </CardTitle>
          <CardDescription>
            Monthly revenue, expenses, and profit for {taxYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taxMetrics.monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{month.month}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-500">Revenue:</span>
                    <span className="ml-2 font-medium text-green-600">₹{month.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Expenses:</span>
                    <span className="ml-2 font-medium text-red-600">₹{month.expenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Profit:</span>
                    <span className={`ml-2 font-bold ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{month.profit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
