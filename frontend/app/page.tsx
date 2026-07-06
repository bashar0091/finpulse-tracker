import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f5] p-6 text-black selection:bg-black selection:text-white">
      {/* Main Landing Container - Sharp Borders & Solid Neo-Brutalist Drop Shadow */}
      <div className="max-w-md w-full border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-1 ring-black/5">
        
        {/* Version Badge */}
        <span className="inline-block border-2 border-black bg-zinc-900 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white mb-4">
          v1.0 - MVP Base
        </span>

        {/* Application Header */}
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2 leading-none">
          FinPulse
        </h1>
        <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-500 mb-4">
          Smart Expense Tracker
        </h2>
        
        {/* Project Description */}
        <p className="text-zinc-700 font-medium leading-relaxed mb-8 border-l-4 border-zinc-300 pl-3">
          An intelligent, full-stack financial dashboard designed to optimize your tracks with future scalable ML capabilities.
        </p>

        {/* Interactive Action Button with Rigid Shadow Transitions */}
        <Link href="/dashboard" className="w-full">
          <button className="w-full border-2 border-black bg-black py-4 font-black text-white uppercase tracking-widest transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[8px_8px_0px_0px_rgba(39,39,42,1)] cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}