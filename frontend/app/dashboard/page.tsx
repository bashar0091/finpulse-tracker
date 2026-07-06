"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import AnalyticsCard from "../components/AnalyticsCard";
import TransactionForm from "../components/TransactionForm";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE" | string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("User");
  const router = useRouter();

  useEffect(() => {
    // Access browser safe boundaries securely
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    // 1. Safe Route Guard Redirection via Next.js Router
    if (!token) {
      router.replace("/login");
      return;
    }

    if (email) {
      setUserEmail(email.split("@")[0]);
    }

    // 2. Fetch User Logs from Active Dynamic Wi-Fi Network Host
    const fetchTransactions = async () => {
      const backendHost = window.location.hostname || "localhost";
      const targetUrl = `http://${backendHost}:5000/api/transactions`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const jsonWrapper = await res.json();
          setTransactions(jsonWrapper.data || []);
        } else {
          localStorage.clear();
          router.replace("/login");
        }
      } catch (error) {
        console.error("[dashboard-fetch-error]:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [router]);

  // 3. Centralized Loading UI Block
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-black">
        <h2 className="text-xl font-black uppercase tracking-widest animate-pulse">
          Decrypting Ledger...
        </h2>
      </div>
    );
  }

  // 4. Financial Metric Evaluators
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#fafafa] text-black p-6 font-sans">
      <Navbar username={userEmail} />

      {/* Financial Analytics Grid Architecture */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Control Block */}
        <div className="lg:col-span-1">
          <TransactionForm />
        </div>

        {/* Data Records Rendering Template */}
        <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase tracking-wide mb-4">
            Recent Transactions Logs
          </h3>
          
          {transactions.length === 0 ? (
            <p className="text-zinc-500 font-medium italic">
              No secure records bound to this account identity found.
            </p>
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