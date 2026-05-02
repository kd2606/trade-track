"use server";

import { createClient } from "@/utils/supabase/server";
import { InvoiceGenerator, generateInvoiceFromTransaction } from "@/utils/invoiceGenerator";
import { redirect } from "next/navigation";

export async function generateInvoice(transactionId: string) {
  const supabase = await createClient();
  
  // Get user and transaction
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  // Fetch transaction details
  const { data: transaction, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .single();

  if (error || !transaction) {
    throw new Error("Transaction not found");
  }

  // Get business info (for now, use default - can be made configurable later)
  const businessInfo = {
    name: "TradeTrack Business",
    address: "Your Business Address",
    phone: "+91 98765 43210",
    email: "business@tradetrack.com"
  };

  // Generate invoice
  const invoiceGenerator = new InvoiceGenerator();
  const invoiceData = generateInvoiceFromTransaction(transaction, businessInfo);
  invoiceGenerator.generateInvoice(invoiceData);
  
  return {
    success: true,
    invoiceNumber: invoiceData.invoiceNumber,
    dataUrl: invoiceGenerator.getInvoiceDataUrl()
  };
}

export async function getBusinessInfo(userId: string) {
  const supabase = await createClient();
  
  // For now, return default business info
  // In a real app, this would come from a business_settings table
  return {
    name: "TradeTrack Business",
    address: "Your Business Address",
    phone: "+91 98765 43210",
    email: "business@tradetrack.com"
  };
}
