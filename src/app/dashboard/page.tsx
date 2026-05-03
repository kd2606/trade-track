import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DemoWrapper from "./DemoWrapper";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Don't redirect immediately - let DemoWrapper handle demo mode check
    return <DemoWrapper />;
  }

  // Fetch real transactions pointing to this user
  const { data: txs, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  const transactions = txs || [];

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

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);

    // Grouping by Date for charts
    const dateStr = txDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { revenue: 0, expense: 0, profit: 0 };
    }

    if (tx.type === "sale") {
      // For sales: revenue = selling_price, expense = cost_price, profit = selling_price - cost_price
      const sellingPrice = Number(tx.selling_price || 0);
      const costPrice = Number(tx.cost_price || 0);
      const quantity = Number(tx.quantity || 1);
      
      const totalSellingPrice = sellingPrice * quantity;
      const totalCostPrice = costPrice * quantity;
      const profit = totalSellingPrice - totalCostPrice;

      totalRevenue += totalSellingPrice;
      totalExpenses += totalCostPrice;
      dailyData[dateStr].revenue += totalSellingPrice;
      dailyData[dateStr].expense += totalCostPrice;
      dailyData[dateStr].profit += profit;

      if (txDate >= today) {
        revenueToday += totalSellingPrice;
        expensesToday += totalCostPrice;
      }
    } else if (tx.type === "expense") {
      // For regular expenses: amount is the expense
      const amount = Number(tx.amount);
      
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

  const recentTransactions = transactions.slice(0, 5);

  return (
    <DemoWrapper 
      realData={
        <DashboardClient
          metrics={metrics}
          profitData={profitData}
          expenseData={expenseData}
          revVsExpData={revVsExpData}
          recentTransactions={recentTransactions}
        />
      }
    />
  );
}
