interface AnalyticsCardProps {
  title: string;
  amount: string;
  valueColor?: string; // Optional prop for conditional text coloring
}

export default function AnalyticsCard({ title, amount, valueColor = "text-black" }: AnalyticsCardProps) {
  return (
    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
        {title}
      </p>
      <p className={`text-3xl font-black ${valueColor}`}>
        {amount}
      </p>
    </div>
  );
}