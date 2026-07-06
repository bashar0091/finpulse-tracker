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
  
  // State layers for client-side filtering and sorting pipelines
  const [filterType, setFilterType] = useState("ALL");
  const [searchCategory, setSearchCategory] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  
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

  // 3. Destructive Deletion Handlers Bound via Prisma ID Tokens
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you absolute sure you want to purge this transaction log?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const backendHost = window.location.hostname || "localhost";
      const res = await fetch(`http://${backendHost}:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Transaction removed successfully!");
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to execute delete action");
      }
    } catch (error) {
      console.error("[delete-error]:", error);
      alert("Network error. Could not reach execution pool.");
    }
  };

  // 4. Centralized Loading UI Block
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans text-black">
        <h2 className="text-xl font-black uppercase tracking-widest animate-pulse">
          Decrypting Ledger...
        </h2>
      </div>
    );
  }

  // 5. Global Financial Metric Evaluators (Always calculated from raw state data)
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // 6. Execution Pipeline for Client-side Filters and Sorting
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesType = filterType === "ALL" || t.type === filterType;
      const matchesCategory = t.category.toLowerCase().includes(searchCategory.toLowerCase());
      return matchesType && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "NEWEST") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "OLDEST") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "AMOUNT_HIGH") return b.amount - a.amount;
      if (sortBy === "AMOUNT_LOW") return a.amount - b.amount;
      return 0;
    });

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
          
          {/* Neo-Brutalist Filter Control Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-4 border-black p-4 bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Type Filtering Component */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider">Filter Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border-2 border-black p-2 font-bold bg-white outline-none cursor-pointer"
              >
                <option value="ALL">ALL RECORDS</option>
                <option value="INCOME">INCOME ONLY</option>
                <option value="EXPENSE">EXPENSE ONLY</option>
              </select>
            </div>

            {/* Substring Category Search Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider">Search Category</label>
              <input
                type="text"
                placeholder="e.g., Food, Salary..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="border-2 border-black p-2 font-medium bg-white outline-none"
              />
            </div>

            {/* Chronological and Numeric Sorting Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider">Sort Orders</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-black p-2 font-bold bg-white outline-none cursor-pointer"
              >
                <option value="NEWEST">NEWEST FIRST</option>
                <option value="OLDEST">OLDEST FIRST</option>
                <option value="AMOUNT_HIGH">AMOUNT: HIGH TO LOW</option>
                <option value="AMOUNT_LOW">AMOUNT: LOW TO HIGH</option>
              </select>
            </div>

          </div>
          
          {filteredTransactions.length === 0 ? (
            <p className="text-zinc-500 font-medium italic">
              No secure records matching filters bound to this account identity found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-black bg-zinc-50 font-bold uppercase text-xs tracking-wider">
                    <th className="p-3 border-r-2 border-black">Category</th>
                    <th className="p-3 border-r-2 border-black">Type</th>
                    <th className="p-3 border-r-2 border-black">Description</th>
                    <th className="p-3 border-r-2 border-black">Amount</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="font-medium text-sm border-b-2 border-black last:border-b-0">
                      <td className="p-3 border-r-2 border-black font-bold uppercase text-xs">{t.category}</td>
                      <td className={`p-3 border-r-2 border-black font-black text-xs ${t.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type}
                      </td>
                      <td className="p-3 border-r-2 border-black text-zinc-600">{t.description || "N/A"}</td>
                      <td className={`p-3 border-r-2 border-black font-bold ${t.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "INCOME" ? "+" : "-"}${t.amount.toFixed(2)}
                      </td>
                      
                      {/* Actions Cell Integration */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="border-2 border-black bg-rose-500 text-white px-2 py-0.5 text-xs font-black uppercase hover:bg-rose-600 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          DEL
                        </button>
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