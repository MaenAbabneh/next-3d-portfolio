import { IoConstructOutline } from "react-icons/io5";

export default function Example({
  children,
  title = "Scenario Builder",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-8 relative">
      {/* العنوان كأنه ملصق */}
      <div className="absolute -top-4 left-4 bg-base-blue text-white px-3 py-1 font-mono font-black text-xs uppercase tracking-widest rounded-md border-2 border-base-blue-dark shadow-sm z-10">
        {title}
      </div>
      {/* البطاقة الرئيسية بستايل الـ Room / Cargo */}
      <div className="rounded-xl border-4 border-dashed border-base-blue/40 bg-white/50 dark:bg-base-blue-light/5 p-6 pt-10">
        <div className="flex items-center gap-3 mb-4 text-base-blue-dark">
          <IoConstructOutline size={26} />
          <p className="font-sans font-black text-lg">Building the Scenario</p>
        </div>
        <div className="text-base-brwan font-medium space-y-3 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
