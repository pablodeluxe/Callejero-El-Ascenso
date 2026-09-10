import { useGameStore } from '../store/gameStore';

export function EventModal() {
  const activeEvent = useGameStore((state) => state.activeEvent);
  const resolveEvent = useGameStore((state) => state.resolveEvent);
  const money = useGameStore((state) => state.money);

  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">{activeEvent.title}</h3>
        </div>
        
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          {activeEvent.description}
        </p>

        <div className="space-y-3">
          {activeEvent.options.map((opt: any, i: number) => {
            const cost = typeof opt.cost === 'number'
              ? opt.cost
              : (() => {
                  const match = opt.label.match(/\$(\d+)/);
                  if (match && (
                    opt.label.toLowerCase().includes('pagar') ||
                    opt.label.toLowerCase().includes('gastar') ||
                    opt.label.toLowerCase().includes('apostar') ||
                    opt.label.toLowerCase().includes('soborno')
                  )) {
                    return parseInt(match[1], 10);
                  }
                  return 0;
                })();

            const canAfford = cost === 0 || money >= cost;

            return (
              <button
                key={i}
                disabled={!canAfford}
                onClick={() => {
                  if (canAfford) {
                    resolveEvent(opt.action);
                  }
                }}
                className={`w-full text-left rounded-lg p-4 transition border ${
                  canAfford
                    ? 'bg-slate-900/50 hover:bg-slate-700/80 border-slate-700 hover:border-slate-500 cursor-pointer group'
                    : 'bg-slate-900/20 border-slate-800/70 opacity-45 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className={`font-semibold transition-colors ${canAfford ? 'text-white group-hover:text-blue-400' : 'text-slate-400'}`}>
                    {opt.label}
                  </div>
                  {!canAfford && (
                    <span className="text-[11px] font-semibold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50 shrink-0">
                      Dinero insuficiente (${cost.toLocaleString()})
                    </span>
                  )}
                </div>
                <div className={`text-xs ${canAfford ? 'text-slate-400' : 'text-slate-500'}`}>
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
