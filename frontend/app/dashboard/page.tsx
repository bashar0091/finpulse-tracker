import Navbar from "../components/Navbar";
import AnalyticsCard from "../components/AnalyticsCard";
import TransactionForm from "../components/TransactionForm";

// Type definitions for transaction objects matching the database schema
interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE" | string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

// Server-side function to fetch real-time logs from the Node.js Express server
async function getTransactions(): Promise<Transaction[]> {
  try {
    // Explicitly fetching from backend server instance
    const res = await fetch("http://localhost:5000/api/transactions", {
      cache: "no-store", // Ensures fresh data validation on each server-side render pipeline
    });
    
    if (!res.ok) throw new Error("Failed to fetch analytics payload");
    
    const jsonWrapper = await res.json();
    return jsonWrapper.data || [];
  } catch (error) {
    console.error("[frontend-fetch-error]:", error);
    return [];
  }
}

export default async function Dashboard() {
  const transactions = await getTransactions();

  // Dynamic calculations processing data metrics smoothly
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#fafafa] text-black p-6 font-sans">
      
      {/* Top Navigation Component */}
      <Navbar username="Awal Bashar" />

      {/* Dynamic Analytics Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard 
          title="Total Balance" 
          amount={`$${netBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} 
        />
        <AnalyticsCard 
          title="Monthly Income" 
          amount={`+$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} 
          valueColor="text-emerald-600" 
        />
        <AnalyticsCard 
          title="Monthly Expenses" 
          amount={`-$${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} 
          valueColor="text-rose-600" 
        />
      </div>

      {/* 2-Column Responsive Layout Grid for Form and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Input Form Component */}
        <div className="lg:col-span-1">
          <TransactionForm />
        </div>

        {/* Right Side: Real Transactions Logs Table Interfaced directly with PostgreSQL */}
        <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase tracking-wide mb-4">
            Recent Transactions Logs
          </h3>
          
          {transactions.length === 0 ? (
            <p className="text-zinc-500 font-medium italic">No recent transactions logs fetched from the server pipeline.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-black bg-zinc-50 font-bold uppercase text-xs tracking-wider">
                    <th className="p-3 border-r-2 border-black">Category</th>
                    <th className="p-3 border-r-2 border-black">Type</th>
                    <th className="p-3 border-r-2 border-black">Description</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {transactions.map((t) => (
                    <tr key={t.id} className="font-medium text-sm border-b-2 border-black last:border-b-0">
                      <td className="p-3 border-r-2 border-black font-bold uppercase text-xs">{t.category}</td>
                      <td className={`p-3 border-r-2 border-black font-black text-xs ${t.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type}
                      </td>
                      <td className="p-3 border-r-2 border-black text-zinc-600">{t.description || "N/A"}</td>
                      <td className={`p-3 font-bold ${t.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "INCOME" ? "+" : "-"}${t.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}