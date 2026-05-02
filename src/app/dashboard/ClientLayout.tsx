"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Banknote,
  ShoppingBag,
  Store,
  Calendar,
  X,
  ChevronDown,
  TrendingUp,
  Package,
  Target,
  Calculator
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { addSale, addExpense } from "@/app/actions";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [modal, setModal] = useState<"sale" | "expense" | null>(null);

  // Dynamic state for Sale Profit Calculation
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const estimatedProfit = (sellingPrice - costPrice) * quantity;
  
  // Date helpers
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Example "Friday, 1 May 2026"
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Action wrappers to close modal smoothly
  const handleSaleAction = async (formData: FormData) => {
    // Inject calculated amount (Selling Price * Quantity) to match schema expectations
    formData.set('amount', (sellingPrice * quantity).toString());
    await addSale(formData);
    setModal(null);
  };

  const handleExpenseAction = async (formData: FormData) => {
    await addExpense(formData);
    setModal(null);
  };

  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/add": "Add Entry",
    "/dashboard/products": "Products",
    "/dashboard/budget": "Budget",
    "/dashboard/tax": "Tax",
    "/dashboard/reports": "Reports",
    "/dashboard/history": "History"
  };
  const pageTitle = titleMap[pathname] || "Dashboard";

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-slate-200 bg-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Store size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-slate-900">TradeTrack</span>
              <span className="text-[11px] font-medium text-slate-500">Business dashboard</span>
            </div>
          </div>
        </div>
        
        <nav className="p-4 pt-6 flex-col gap-1 flex flex-grow">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/add"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <PlusCircle size={18} />
            <span className="text-sm">Add Entry</span>
          </Link>
          <Link
            href="/dashboard/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/products"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Package size={18} />
            <span className="text-sm">Products</span>
          </Link>
          <Link
            href="/dashboard/budget"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/budget"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Target size={18} />
            <span className="text-sm">Budget</span>
          </Link>
          <Link
            href="/dashboard/tax"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/tax"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calculator size={18} />
            <span className="text-sm">Tax</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/reports"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <TrendingUp size={18} />
            <span className="text-sm">Reports</span>
          </Link>
          <Link
            href="/dashboard/history"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/history"
                ? "bg-slate-900 text-white shadow-sm font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <History size={18} />
            <span className="text-sm">History</span>
          </Link>
          <div className="mt-auto pb-4 px-4 text-xs font-semibold text-slate-400">
            v1.0 · MVP
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 bg-white flex-shrink-0 z-10">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar size={14} />
              <span className="text-xs font-medium">{formattedDate}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setModal("expense")}
              className="flex items-center gap-2 px-4 py-2 border border-pink-200 text-pink-600 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors shadow-sm bg-white"
            >
              <Banknote size={16} />
              Add Expense
            </button>
            <button 
              onClick={() => setModal("sale")}
              className="flex items-center gap-2 px-4 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm border border-transparent"
            >
              <ShoppingBag size={16} />
              Add Sale
            </button>
            <div className="w-px h-8 bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                K
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-sm font-semibold text-slate-900">Krrish</span>
                <span className="text-xs text-slate-500">mamahajan7@gmail.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto bg-[#f8fafc]">
          {children}
        </div>

        {/* Modals Overlay */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            {modal === "sale" && (
              <form action={handleSaleAction} className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Add a Sale</h2>
                      <p className="text-sm text-slate-500 mt-1">Record a sold item with its cost and selling price.</p>
                    </div>
                    <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Item Name</label>
                      <input required name="description" type="text" placeholder="e.g. Notebook" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Quantity</label>
                        <input required name="quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Date</label>
                        <div className="relative">
                          <input required name="date" type="date" defaultValue={today} className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm [color-scheme:light]" />
                          <Calendar size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Cost Price (₹)</label>
                        <input required name="cost_price" type="number" min={0} step="0.01" value={costPrice || ""} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Selling Price (₹)</label>
                        <input required name="selling_price" type="number" min={0} step="0.01" value={sellingPrice || ""} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                      </div>
                    </div>

                    <div className="mt-6 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg p-4">
                      <p className="text-sm font-medium text-[#047857]">Estimated profit on this sale: ₹{estimatedProfit.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-slate-100">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#059669] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors border border-transparent">
                    Save Sale
                  </button>
                </div>
              </form>
            )}

            {modal === "expense" && (
              <form action={handleExpenseAction} className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Add an Expense</h2>
                      <p className="text-sm text-slate-500 mt-1">Log a business expense by category.</p>
                    </div>
                    <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Category</label>
                      <div className="relative">
                        <select name="category" required className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm">
                          <option value="Rent">Rent</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Inventory">Inventory</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Amount (₹)</label>
                        <input required name="amount" type="number" min={0} step="0.01" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Date</label>
                        <div className="relative">
                          <input required name="date" type="date" defaultValue={today} className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm [color-scheme:light]" />
                          <Calendar size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1.5">Note (optional)</label>
                      <textarea name="description" rows={3} placeholder="Short description" className="w-full resize-none border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm"></textarea>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-slate-100">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#e11d48] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-rose-700 transition-colors border border-transparent">
                    Save Expense
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
