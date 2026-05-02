import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch transactions with product data
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const txs = transactions || [];

  // Fetch products for product performance analysis
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  const productList = products || [];

  return (
    <ReportsClient
      transactions={txs}
      products={productList}
    />
  );
}
