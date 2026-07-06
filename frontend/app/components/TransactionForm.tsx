"use client";

import { useState } from "react";

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  
  // State to handle client-side success and error notification banners
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const backendHost = window.location.hostname || "localhost";
      const response = await fetch(`http://${backendHost}:5000/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          description,
        }),
      });

      if (response.ok) {
        // Show non-blocking custom success message feedback
        setSuccessMessage("Transaction recorded securely in ledger!");
        setAmount("");
        setCategory("");
        setDescription("");
        
        onTransactionAdded();

        // Automatically auto-dismiss notification banner after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.error || "Failed to commit transaction registry");
      }
    } catch (error) {
      console.error("[transaction-form-error]:", error);
      setErrorMessage("Network error. Execution pool is unreachable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
      <h3 className="text-lg font-black uppercase tracking-wide">Log New Transaction</h3>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => setType("INCOME")}
          className={`border-2 border-black p-2 font-black uppercase text-xs transition-all cursor-pointer ${
            type === "INCOME" ? "bg-black text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Income
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => setType("EXPENSE")}
          className={`border-2 border-black p-2 font-black uppercase text-xs transition-all cursor-pointer ${
            type === "EXPENSE" ? "bg-black text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Expense
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider">Amount ($) *</label>
        <input
          type="number"
          step="0.01"
          required
          disabled={submitting}
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-2 border-black p-2 font-medium bg-white outline-none disabled:bg-zinc-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider">Category *</label>
        <input
          type="text"
          required
          disabled={submitting}
          placeholder="e.g., Salary, Food, Utilities"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-black p-2 font-medium bg-white outline-none disabled:bg-zinc-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider">Description (Optional)</label>
        <input
          type="text"
          disabled={submitting}
          placeholder="Add short note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 border-black p-2 font-medium bg-white outline-none disabled:bg-zinc-100 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full border-2 border-black p-3 text-xs font-black uppercase tracking-widest transition-all ${
          submitting
            ? "bg-zinc-400 text-black cursor-not-allowed shadow-none translate-x-0.5 translate-y-0.5 animate-pulse"
            : "bg-black text-white hover:bg-zinc-800 cursor-pointer shadow-[4px_4px_0px_0px_rgba(110,110,110,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        }`}
      >
        {submitting ? "Processing Registry..." : "Submit Transaction"}
      </button>

      {/* Neo-Brutalist Inline Success Feedback Banner */}
      {successMessage && (
        <div className="border-2 border-black bg-emerald-400 text-black p-2 text-xs font-bold uppercase tracking-wide text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {successMessage}
        </div>
      )}

      {/* Neo-Brutalist Inline Error Feedback Banner */}
      {errorMessage && (
        <div className="border-2 border-black bg-rose-500 text-white p-2 text-xs font-bold uppercase tracking-wide text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {errorMessage}
        </div>
      )}
    </form>
  );
}