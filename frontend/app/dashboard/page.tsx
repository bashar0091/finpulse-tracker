export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black p-6 font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="w-full border-4 border-black bg-white p-4 mb-8 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-black uppercase tracking-tight">
          FinPulse / Dashboard
        </h1>
        <div className="border-2 border-black bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
          User: Awal Bashar
        </div>
      </nav>

      {/* Main Grid Layout for Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Balance Card */}
        <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Total Balance
          </p>
          <p className="text-3xl font-black">$12,450.00</p>
        </div>

        {/* Income Card */}
        <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Monthly Income
          </p>
          <p className="text-3xl font-black text-emerald-600">+$4,200.00</p>
        </div>

        {/* Expenses Card */}
        <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Monthly Expenses
          </p>
          <p className="text-3xl font-black text-rose-600">-$1,850.00</p>
        </div>

      </div>

      {/* Placeholder for Transactions Table / Future ML Charts */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase tracking-wide mb-4">
          Recent Transactions Logs
        </h3>
        <p className="text-zinc-600 font-medium">
          Database connection interface pipeline pending. Express.js REST APIs integration target in Phase 1.
        </p>
      </div>

    </div>
  );
}