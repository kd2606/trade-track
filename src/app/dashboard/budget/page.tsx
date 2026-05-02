import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BudgetClient from "./BudgetClient";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch transactions for budget analysis
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  // Fetch budgets for the user
  const { data: budgets, error: budgetError } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (budgetError) {
    console.error("Error fetching budgets:", budgetError);
  }

  return (
    <BudgetClient
      transactions={transactions || []}
      budgets={budgets || []}
    />
  );
}
