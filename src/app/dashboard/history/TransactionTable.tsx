'use client';

import React, { useState } from "react";
import { Pen, Trash2, X, Check, FileText, Download } from "lucide-react";
import { deleteTransaction, updateTransaction } from "@/app/actions";
import { generateInvoice } from "@/app/actions/invoice";

type Transaction = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number | string;
  cost_price?: number | string;
  selling_price?: number | string;
  date: string;
  created_at: string;
};

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    setIsDeleting(id);
    await deleteTransaction(id);
    setIsDeleting(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateTransaction(id, formData);
    setEditingId(null);
  };

  const handleGenerateInvoice = async (id: string) => {
    setIsGeneratingInvoice(id);
    try {
      const result = await generateInvoice(id);
      if (result.success) {
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = result.dataUrl;
        link.download = `invoice-${result.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsGeneratingInvoice(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-6 py-16 text-center text-sm font-medium text-[#94a3b8]">
          No transactions found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {transactions.map((t) => {
        const isEditing = editingId === t.id;

        if (isEditing) {
          return (
            <tr key={t.id} className="bg-slate-50 border-y border-slate-200">
              <td colSpan={6} className="px-6 py-4">
                <form
                  onSubmit={(e) => handleEditSubmit(e, t.id)}
                  className="flex flex-wrap md:flex-nowrap gap-4 items-center"
                >
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date(t.date || t.created_at).toISOString().split('T')[0]}
                    className="flex-1 min-w-[120px] px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    defaultValue={t.category}
                    className="flex-1 min-w-[120px] px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    defaultValue={t.description || ""}
                    className="flex-1 min-w-[150px] px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    defaultValue={t.amount}
                    className="flex-1 min-w-[100px] px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                    required
                  />
                  {t.type === 'sale' && (
                    <>
                      <input type="hidden" name="cost_price" defaultValue={t.cost_price || ""} />
                      <input type="hidden" name="selling_price" defaultValue={t.selling_price || ""} />
                    </>
                  )}
                  <div className="flex items-center gap-2 min-w-max ml-auto">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className="p-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-semibold pr-1">Save</span>
                    </button>
                  </div>
                </form>
              </td>
            </tr>
          );
        }

        return (
          <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
              {new Date(t.date || t.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold capitalize ${
                  t.type === "sale"
                    ? "bg-[#ecfdf5] text-[#059669]"
                    : "bg-[#fefce8] text-[#d97706]"
                }`}
              >
                {t.type}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-800 font-medium">
              {t.category}
            </td>
            <td
              className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate"
              title={t.description || ""}
            >
              {t.description || "-"}
            </td>
            <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
              ₹{Number(t.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-end gap-2">
                {t.type === 'sale' && (
                  <button
                    onClick={() => handleGenerateInvoice(t.id)}
                    disabled={isGeneratingInvoice === t.id}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-50"
                    aria-label="Generate Invoice"
                    title="Generate Invoice"
                  >
                    {isGeneratingInvoice === t.id ? (
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setEditingId(t.id)}
                  disabled={isDeleting === t.id || isGeneratingInvoice === t.id}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  aria-label="Edit"
                >
                  <Pen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={isDeleting === t.id || isGeneratingInvoice === t.id}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}
