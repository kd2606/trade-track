import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TaxClient from "./TaxClient";

export default async function TaxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch transactions for tax analysis
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  return (
    <TaxClient
      transactions={transactions || []}
    />
  );
}
