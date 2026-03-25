import { IoInformationCircle } from "react-icons/io5";

export default function Note({
  children,
  title = "Note",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-6 relative">
      {/* الحبال أو الدبابيس Retro */}
      <div className="absolute -top-3 -left-3 size-6 rounded-full border-4 border-dashed border-purple-500 bg-white/70 dark:bg-base-blue-dark/70"></div>
      <div className="rounded-xl border-4 border-purple-500/40 bg-purple-500/10 p-5 pt-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
          <IoInformationCircle size={22} />
          <span className="font-bold font-serif text-md">{title}</span>
        </div>
        <div className="text-base-brwan leading-relaxed font-mono text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}
