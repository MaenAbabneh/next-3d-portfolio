import { IoBulb } from "react-icons/io5";

export default function Tip({
  children,
  title = "Quick tip",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-6 rounded-2xl border-4 border-emerald-500/30 bg-emerald-500/10 p-5 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]">
      <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
        <IoBulb size={24} className="animate-pulse" />
        <span className="font-black font-serif text-lg">{title}</span>
      </div>
      <div className="text-base-brwan leading-relaxed text-sm font-medium">
        {children}
      </div>
    </div>
  );
}
