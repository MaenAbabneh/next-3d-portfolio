export default function StatsTable({
  title,
  stats,
}: {
  title: string;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <div className="my-8 rounded-xl border-4 border-base-blue bg-black p-6 shadow-inner relative overflow-hidden">
      {/* تأثير خطوط الشاشة (Scanlines) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[100%_4px] pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-base-blue mb-6 border-b-2 border-dashed border-base-blue/30 pb-2">
          {title} :: DATA_LOG
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-mono text-[10px] text-base-cream/50 uppercase tracking-widest mb-1">
                {stat.label}
              </span>
              <span className="font-digital animate-flicker text-2xl lg:text-3xl text-base-blue drop-shadow-[0_0_5px_rgba(41,82,155,0.8)]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
