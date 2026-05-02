"use client";

import React, { useState, useMemo } from "react";
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, Transaction } from "@/types";

interface ProductsClientProps {
  products: Product[];
  transactions: Transaction[];
}

export default function ProductsClient({ products, transactions }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    cost_price: "",
    selling_price: "",
    stock_quantity: "",
    min_stock_level: ""
  });

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

  // Calculate stock levels and metrics for each product
  const productsWithMetrics = useMemo(() => {
    return products.map(product => {
      // Calculate stock from transactions
      const productTransactions = transactions.filter(tx => 
        tx.product_name === product.name && tx.type === 'sale'
      );
      
      const totalSold = productTransactions.reduce((sum, tx) => sum + (tx.quantity || 1), 0);
      const currentStock = Math.max(0, product.stock_quantity - totalSold);
      const stockStatus = currentStock <= product.min_stock_level ? "low" : 
                         currentStock <= product.min_stock_level * 2 ? "medium" : "good";
      
      // Calculate sales metrics
      const salesRevenue = productTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const salesCount = productTransactions.length;
      const avgSalePrice = salesCount > 0 ? salesRevenue / salesCount : 0;
      
      return {
        ...product,
        currentStock,
        stockStatus,
        totalSold,
        salesRevenue,
        salesCount,
        avgSalePrice
      };
    });
  }, [products, transactions]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return productsWithMetrics.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productsWithMetrics, searchTerm]);

  // Calculate overall metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = productsWithMetrics.filter(p => p.stockStatus === "low").length;
    const totalStockValue = productsWithMetrics.reduce((sum, p) => 
      sum + (p.currentStock * p.cost_price), 0
    );
    const totalRevenue = productsWithMetrics.reduce((sum, p) => sum + p.salesRevenue, 0);

    return {
      totalProducts,
      lowStockProducts,
      totalStockValue,
      totalRevenue
    };
  }, [productsWithMetrics]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingProduct?.id
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingProduct(null);
        setFormData({
          name: "",
          category: "",
          description: "",
          cost_price: "",
          selling_price: "",
          stock_quantity: "",
          min_stock_level: ""
        });
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      cost_price: product.cost_price.toString(),
      selling_price: product.selling_price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      min_stock_level: product.min_stock_level.toString()
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "low": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "good": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "low": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <TrendingDown className="w-4 h-4" />;
      case "good": return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and track stock levels</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
              </div>
              <Package className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{metrics.lowStockProducts}</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{metrics.totalStockValue.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Your complete product catalog with stock levels and sales metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-900">Product</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Category</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Stock Level</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Cost Price</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Selling Price</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Sales</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900">Revenue</th>
                  <th className="pb-3 text-sm font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${getStockStatusColor(product.stockStatus)}`}>
                        {getStockStatusIcon(product.stockStatus)}
                        {product.currentStock} units
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">₹{product.cost_price.toFixed(2)}</td>
                    <td className="py-4 text-sm text-gray-900">₹{product.selling_price.toFixed(2)}</td>
                    <td className="py-4 text-sm text-gray-600">{product.salesCount}</td>
                    <td className="py-4 text-sm text-gray-900">₹{product.salesRevenue.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try adjusting your search" : "Add your first product to get started"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Wireless Headphones"
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost_price">Cost Price (₹) *</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost_price}
                      onChange={(e) => handleInputChange('cost_price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="selling_price">Selling Price (₹) *</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.selling_price}
                      onChange={(e) => handleInputChange('selling_price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Initial Stock *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_stock_level">Min Stock Level *</Label>
                    <Input
                      id="min_stock_level"
                      type="number"
                      min="0"
                      value={formData.min_stock_level}
                      onChange={(e) => handleInputChange('min_stock_level', e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      setFormData({
                        name: "",
                        category: "",
                        description: "",
                        cost_price: "",
                        selling_price: "",
                        stock_quantity: "",
                        min_stock_level: ""
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingProduct ? 'Update Product' : 'Add Product'}
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
