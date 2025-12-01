import TradingDeck from './TradingDeck';

export default function Section2() {
  return (
    <section
      id="section-trading"
      className="section-two relative z-0 w-full px-4 sm:px-8 pt-16 pb-24 sm:pt-32 sm:pb-48 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 mx-auto max-w-[1400px] mt-8 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-sky-900/20"
    >
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <div className="section-two-overlay" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 sm:px-8 relative z-10">
        <div className="flex flex-col gap-4 text-center text-slate-900 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 drop-shadow-sm">
            Campaign Management, <span className="text-blue-400">Reimagined.</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-50 sm:text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
            A simple scroll shows how Sire Media organizes every deliverable, approval, timeline, and report.
          </p>
        </div>
        <TradingDeck />
      </div>
    </section>
  );
}
