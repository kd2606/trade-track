"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Material Icons will be used directly in JSX
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
    <div className="flex h-screen w-full bg-surface font-body-md text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 py-6 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-xl shadow-gray-900/5 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-blue-600">TradeTrack</div>
              <div className="text-[10px] text-outline uppercase tracking-widest">Enterprise</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/add"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span className="text-sm">Add Entry</span>
          </Link>
          <Link
            href="/dashboard/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/products"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            <span className="text-sm">Products</span>
          </Link>
          <Link
            href="/dashboard/budget"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/budget"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">target</span>
            <span className="text-sm">Budget</span>
          </Link>
          <Link
            href="/dashboard/tax"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/tax"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">calculate</span>
            <span className="text-sm">Tax</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/reports"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">trending_up</span>
            <span className="text-sm">Reports</span>
          </Link>
          <Link
            href="/dashboard/history"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/dashboard/history"
                ? "bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">history</span>
            <span className="text-sm">History</span>
          </Link>
          <div className="px-6 mt-auto">
            <div className="p-4 bg-primary-container rounded-xl text-on-primary-container mb-8">
              <div className="text-xs font-bold mb-1 opacity-90">UPGRADE PLAN</div>
              <div className="text-sm mb-3">Get 20% off Enterprise features.</div>
              <button className="w-full py-2 bg-white text-primary text-xs font-bold rounded-lg shadow-sm">Upgrade Now</button>
            </div>
            <div className="space-y-1">
              <a className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">help</span>
                <span className="text-sm">Help</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-error transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="text-sm">Logout</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm shadow-gray-900/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="Search transactions..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-gray-100/50 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-gray-100/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant ml-2">
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-sm">K</div>
            </div>
          </div>
        </header>
        
        {/* Page Title Section */}
        <div className="pt-20 px-gutter pb-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2">{pageTitle}</h1>
              <p className="text-on-surface-variant">Monitor, audit, and categorize all enterprise sales operations in real-time.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setModal("expense")}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface rounded-lg font-label-md hover:bg-surface-variant transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">payments</span>
                Add Expense
              </button>
              <button 
                onClick={() => setModal("sale")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-label-md hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Sale
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto bg-surface px-gutter pb-gutter">
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
                      <span className="material-symbols-outlined text-lg">close</span>
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
                          <span className="material-symbols-outlined text-base absolute right-3 top-2.5 text-slate-400 pointer-events-none">event</span>
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
                      <span className="material-symbols-outlined text-lg">close</span>
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
                        <span className="material-symbols-outlined text-base">expand_more</span>
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
                          <span className="material-symbols-outlined text-base absolute right-3 top-2.5 text-slate-400 pointer-events-none">event</span>
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
