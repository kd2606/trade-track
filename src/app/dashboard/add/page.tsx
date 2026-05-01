import Link from "next/link";
import { ShoppingBag, Banknote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddEntryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Add New Entry</h1>
        <p className="text-slate-500 mt-2">Choose the type of transaction you want to record.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Sale Card */}
        <Card className="relative overflow-hidden group hover:border-emerald-500 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <ShoppingBag className="w-48 h-48 text-emerald-600" />
          </div>
          <CardHeader>
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl">Record a Sale</CardTitle>
            <CardDescription className="text-base">
              Log a new revenue generating transaction. Track products sold, customer details, and payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/dashboard/add/sale" className="block w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg">
                Add Sale Record
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Add Expense Card */}
        <Card className="relative overflow-hidden group hover:border-pink-500 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Banknote className="w-48 h-48 text-pink-600" />
          </div>
          <CardHeader>
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/50 rounded-2xl flex items-center justify-center mb-4">
              <Banknote className="h-7 w-7 text-pink-600 dark:text-pink-400" />
            </div>
            <CardTitle className="text-2xl">Log an Expense</CardTitle>
            <CardDescription className="text-base">
              Record business expenses, overhead costs, and purchases. Categorize for accurate profit tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/dashboard/add/expense" className="block w-full">
              <Button variant="outline" className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 hover:text-pink-700 h-12 text-lg">
                Add Expense Record
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
