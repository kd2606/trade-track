import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch products for the user
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Fetch transactions to calculate current stock levels
  const { data: transactions, error: transactionError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (transactionError) {
    console.error("Error fetching transactions:", transactionError);
  }

  return (
    <ProductsClient
      products={products || []}
      transactions={transactions || []}
    />
  );
}
