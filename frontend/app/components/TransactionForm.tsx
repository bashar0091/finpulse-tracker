"use client";

import { useState } from "react";

export default function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("INCOME");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return alert("Please fill in required fields");

    setLoading(true);
    try {
      // Temporary hardcoded userId from our database test user
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          description,
          userId: "a1144b30-2b0e-4acb-83b8-f8ab09b6711d", // Your real database user UUID
        }),
      });

      if (response.ok) {
        alert("Transaction added successfully!");
        // Clear form fields
        setAmount("");
        setCategory("");
        setDescription("");
        // Refresh the page server-side to show new live data
        window.location.reload();
      } else {
        alert("Failed to save transaction");
      }
    } catch (error) {
      console.error("[form-submit-error]:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        Log New Transaction
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Transaction Type Selector */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 py-2 font-bold border-2 border-black tracking-wider transition-all ${
              type === "INCOME" ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black"
            }`}
          >
            INCOME
          </button>
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 py-2 font-bold border-2 border-black tracking-wider transition-all ${
              type === "EXPENSE" ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black"
            }`}
          >
            EXPENSE
          </button>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Amount ($) *</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-black p-3 font-medium outline-none focus:bg-zinc-50"
            required
          />
        </div>

        {/* Category Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Category *</label>
          <input
            type="text"
            placeholder="e.g., Salary, Food, Utilities"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-black p-3 font-medium outline-none focus:bg-zinc-50"
            required
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Description (Optional)</label>
          <input
            type="text"
            placeholder="Add short note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-black p-3 font-medium outline-none focus:bg-zinc-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-black bg-black py-3 font-black text-white uppercase tracking-widest transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(63,63,70,1)] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving Logs..." : "Submit Transaction"}
        </button>
      </form>
    </div>
  );
}