"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addExpense } from "@/app/actions";

export default function AddExpensePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('product_name', formData.productName);
      submitData.append('category', formData.category);
      submitData.append('amount', formData.amount);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);

      await addExpense(submitData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/add">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Record Expense</h1>
          <p className="text-slate-500 mt-1">Add a new business expense transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Expense Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={20} />
              Expense Details
            </CardTitle>
            <CardDescription>
              Enter details about the business expense
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Expense Item *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="e.g., Office Rent, Software Subscription"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Expense Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
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
                placeholder="Additional details about this expense..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Expense Summary */}
        {formData.amount && parseFloat(formData.amount) > 0 && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Expense Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Expense Amount</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Category</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formData.category || "Not selected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link href="/dashboard/add">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="flex-1 bg-pink-600 hover:bg-pink-700"
            disabled={isSubmitting || !formData.productName || !formData.category || !formData.amount}
          >
            {isSubmitting ? 'Recording Expense...' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
}
