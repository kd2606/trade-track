import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TransactionTable from "./TransactionTable";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const revenue = transactions
    ?.filter((t) => t.type === "sale")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  
  const expenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const netProfit = revenue - expenses;

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filters Row */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xl flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items, category, note..." 
              className="w-full pl-9 pr-4 py-[9px] bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow outline-none placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-auto shrink-0">
            <div className="relative w-40">
              <select className="appearance-none w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-[9px] text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow cursor-pointer outline-none">
                <option>All months</option>
                <option>This month</option>
                <option>Last month</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0 h-[40px]">
              <button className="px-4 h-full bg-white shadow-sm rounded-md text-sm font-semibold text-slate-900">
                All
              </button>
              <button className="px-4 h-full text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Sales
              </button>
              <button className="px-4 h-full text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Expenses
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200">
          <div className="bg-[#f0f9ff]/50 rounded-lg border border-[#bfdbfe]/50 p-4 pt-3 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] font-medium text-[#2563eb] mb-1">Revenue</span>
            <span className="text-[19px] font-bold text-[#1e3a8a]">₹{revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-[#fefce8]/50 rounded-lg border border-[#fef08a]/70 p-4 pt-3 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] font-medium text-[#d97706] mb-1">Expenses</span>
            <span className="text-[19px] font-bold text-[#92400e]">₹{expenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-[#ecfdf5]/50 rounded-lg border border-[#a7f3d0]/60 p-4 pt-3 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] font-medium text-[#059669] mb-1">Net Profit</span>
            <span className="text-[19px] font-bold text-[#064e3b]">₹{netProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Table Area */}
        <div className="px-4 py-4 min-h-[400px]">
          <div className="border border-slate-200 rounded-[10px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-[13px] font-medium bg-slate-50/50">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TransactionTable transactions={transactions || []} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
