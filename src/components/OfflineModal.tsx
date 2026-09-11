import { useGameStore } from '../store/gameStore';

export function OfflineModal() {
  const report = useGameStore((state) => state.offlineReport);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const setOfflineReport = useGameStore((state) => state.setOfflineReport);

  if (!report || isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-slate-800 p-6 shadow-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 text-center">¡Mientras estabas fuera...!</h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
            <span className="text-slate-300">Ganancias Pasivas</span>
            <span className="text-emerald-400 font-bold">+${report.earnings.toFixed(2)}</span>
          </div>
          
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Desgaste</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex justify-between">
                <span>Salud</span>
                <span className="text-red-400">-{report.healthDecay.toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Higiene</span>
                <span className="text-amber-400">-{report.hygieneDecay.toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Ánimo</span>
                <span className="text-blue-400">-{report.moodDecay.toFixed(0)}%</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setOfflineReport(null)}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          Recoger Ganancias
        </button>
      </div>
    </div>
  );
}
