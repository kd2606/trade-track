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

  // Fetch products for this user
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch transactions for stock calculations
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  if (transactionsError) {
    console.error("Error fetching transactions:", transactionsError);
  }

  return <ProductsClient products={products || []} transactions={transactions || []} />;
}
