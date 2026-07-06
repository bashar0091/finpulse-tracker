"use client";

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const handleLogout = () => {
    // Clear secure credentials from session memory
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    
    // Hard redirect to clear runtime execution context safely
    window.location.replace("/login");
  };

  return (
    <div className="w-full border-4 border-black bg-white p-4 mb-8 flex items-center justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-xl font-black uppercase tracking-wider">
        FinPulse / Dashboard
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-wide">
          User: {username}
        </div>
        
        {/* Sharp Neo-Brutalist Logout Action Trigger */}
        <button
          onClick={handleLogout}
          className="border-2 border-black bg-rose-500 text-white px-3 py-1 text-xs font-black uppercase tracking-wide hover:bg-rose-600 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
}