import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // if no specific login page is found
  }

  // Fetch transactions pointing to this user
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const txs = transactions || [];

  // Metrics
  let revenueToday = 0;
  let expensesToday = 0;
  let totalRevenue = 0;
  let totalExpenses = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // For charts
  const expenseBreakdown: Record<string, number> = {};
  const dailyData: Record<string, { revenue: number; expense: number; profit: number }> = {};

  txs.forEach((tx) => {
    const txDate = new Date(tx.date);
    const amount = Number(tx.amount);

    // Grouping by Date for charts
    const dateStr = txDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { revenue: 0, expense: 0, profit: 0 };
    }

    if (tx.type === "sale") {
      totalRevenue += amount;
      dailyData[dateStr].revenue += amount;
      dailyData[dateStr].profit += amount;

      if (txDate >= today) {
        revenueToday += amount;
      }
    } else if (tx.type === "expense") {
      totalExpenses += amount;
      dailyData[dateStr].expense += amount;
      dailyData[dateStr].profit -= amount;

      expenseBreakdown[tx.category] = (expenseBreakdown[tx.category] || 0) + amount;

      if (txDate >= today) {
        expensesToday += amount;
      }
    }
  });

  const profitToday = revenueToday - expensesToday;
  const netProfit = totalRevenue - totalExpenses;

  const metrics = {
    revenueToday,
    expensesToday,
    profitToday,
    netProfit,
  };

  // Convert maps to array for Recharts
  const expenseData = Object.entries(expenseBreakdown).map(([name, value]) => ({ name, value }));

  // Reverse dailyData keys to get ascending chronological order (since we ordered by date desc)
  const sortedDates = Object.keys(dailyData).reverse();

  const profitData = sortedDates.map((date) => ({
    name: date,
    profit: dailyData[date].profit,
  }));

  const revVsExpData = sortedDates.map((date) => ({
    name: date,
    revenue: dailyData[date].revenue,
    expense: dailyData[date].expense,
  }));

  const recentTransactions = txs.slice(0, 5);

  return (
    <DashboardClient
      metrics={metrics}
      profitData={profitData}
      expenseData={expenseData}
      revVsExpData={revVsExpData}
      recentTransactions={recentTransactions}
    />
  );
}
