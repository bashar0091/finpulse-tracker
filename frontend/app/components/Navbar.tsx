interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  return (
    <nav className="w-full border-4 border-black bg-white p-4 mb-8 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-2xl font-black uppercase tracking-tight">
        FinPulse / Dashboard
      </h1>
      <div className="border-2 border-black bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
        User: {username}
      </div>
    </nav>
  );
}