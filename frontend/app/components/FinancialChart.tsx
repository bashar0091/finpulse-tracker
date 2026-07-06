"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE" | string;
  amount: number;
  category: string;
  date: string;
}

interface FinancialChartProps {
  transactions: Transaction[];
}

export default function FinancialChart({ transactions }: FinancialChartProps) {
  // Process raw transaction state into aggregated category-based chart data
  const categoryDataMap: { [key: string]: { category: string; Income: number; Expense: number } } = {};

  transactions.forEach((t) => {
    const cat = t.category.toUpperCase();
    if (!categoryDataMap[cat]) {
      categoryDataMap[cat] = { category: cat, Income: 0, Expense: 0 };
    }
    
    if (t.type === "INCOME") {
      categoryDataMap[cat].Income += t.amount;
    } else if (t.type === "EXPENSE") {
      categoryDataMap[cat].Expense += t.amount;
    }
  });

  const chartData = Object.values(categoryDataMap);

  if (transactions.length === 0) {
    return (
      <div className="w-full h-[300px] border-4 border-black bg-zinc-50 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-zinc-500 font-bold uppercase tracking-wider text-xs">No analytics data available to chart</p>
      </div>
    );
  }

  return (
    <div className="w-full border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
      <h3 className="text-lg font-black uppercase tracking-wide mb-6">Financial Analytics Breakdown</h3>
      
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Neo-brutalist sharp grid style */}
            <CartesianGrid stroke="#000000" strokeDasharray="4 4" vertical={false} />
            
            <XAxis 
              dataKey="category" 
              stroke="#000000" 
              tick={{ fill: "#000000", fontWeight: "700", fontSize: 11 }}
            />
            <YAxis 
              stroke="#000000" 
              tick={{ fill: "#000000", fontWeight: "700", fontSize: 11 }}
            />
            
            {/* Custom sharp border tooltip box */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "3px solid #000000",
                borderRadius: "0px",
                fontWeight: "700",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)"
              }}
            />
            
            {/* Structural bar sets with high contrast color fills */}
            <Bar dataKey="Income" fill="#10b981" stroke="#000000" strokeWidth={2} maxBarSize={40} />
            <Bar dataKey="Expense" fill="#f43f5e" stroke="#000000" strokeWidth={2} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}