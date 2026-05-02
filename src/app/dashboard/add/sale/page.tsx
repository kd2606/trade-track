"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addSale } from "@/app/actions";

export default function AddSalePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "1",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Calculated values
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const quantity = parseInt(formData.quantity) || 1;
  const totalAmount = sellingPrice * quantity;
  const profitPerUnit = sellingPrice - costPrice;
  const totalProfit = profitPerUnit * quantity;

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games",
    "Health & Beauty",
    "Automotive",
    "Office Supplies",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('product_name', formData.productName);
      submitData.append('category', formData.category);
      submitData.append('cost_price', formData.costPrice);
      submitData.append('selling_price', formData.sellingPrice);
      submitData.append('quantity', formData.quantity);
      submitData.append('amount', totalAmount.toString());
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);

      await addSale(submitData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding sale:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Record Sale</h1>
          <p className="text-slate-500 mt-1">Add a new sales transaction with profit tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag size={20} />
              Product Information
            </CardTitle>
            <CardDescription>
              Enter details about the product sold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="e.g., Wireless Headphones"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Additional details about the sale..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Quantity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={20} />
              Pricing & Quantity
            </CardTitle>
            <CardDescription>
              Set pricing details and quantity sold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="costPrice">Cost Price per Unit (₹) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sellingPrice">Selling Price per Unit (₹) *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="date">Sale Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Profit Summary */}
        {(totalAmount > 0 || profitPerUnit !== 0) && (
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800">Profit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Profit per Unit</p>
                  <p className={`text-xl font-bold ${profitPerUnit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{profitPerUnit.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Profit</p>
                  <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{totalProfit.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Profit Margin</p>
                  <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {sellingPrice > 0 ? ((profitPerUnit / sellingPrice) * 100).toFixed(1) : '0'}%
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
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting || !formData.productName || !formData.category || !formData.costPrice || !formData.sellingPrice}
          >
            {isSubmitting ? 'Recording Sale...' : 'Record Sale'}
          </Button>
        </div>
      </form>
    </div>
  );
}
