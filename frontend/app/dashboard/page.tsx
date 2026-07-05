import Navbar from "../components/Navbar";
import AnalyticsCard from "../components/AnalyticsCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black p-6 font-sans">
      
      {/* Top Navigation Component */}
      <Navbar username="Awal Bashar" />

      {/* Analytics Grid Section using Reusable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard 
          title="Total Balance" 
          amount="$12,450.00" 
        />
        <AnalyticsCard 
          title="Monthly Income" 
          amount="+$4,200.00" 
          valueColor="text-emerald-600" 
        />
        <AnalyticsCard 
          title="Monthly Expenses" 
          amount="-$1,850.00" 
          valueColor="text-rose-600" 
        />
      </div>

      {/* Placeholder Container for Database Transaction Integration */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase tracking-wide mb-4">
          Recent Transactions Logs
        </h3>
        <p className="text-zinc-600 font-medium">
          Database connection interface pipeline pending. Express.js REST APIs integration target in Phase 1[cite: 1].
        </p>
      </div>

    </div>
  );
}