import React from 'react';
import { useGameStore, BUSINESSES } from '../store/gameStore';
import { HeartCrack, RotateCcw, Skull, DollarSign, Award, Briefcase } from 'lucide-react';

export function GameOverModal() {
  const isGameOver = useGameStore((state) => state.isGameOver);
  const health = useGameStore((state) => state.health);
  const money = useGameStore((state) => state.money);
  const reputation = useGameStore((state) => state.reputation);
  const businessLevels = useGameStore((state) => state.businessLevels);
  const resetGame = useGameStore((state) => state.resetGame);

  if (!isGameOver && health > 0) return null;

  const totalBusinessesCount = Object.values(businessLevels).reduce((acc, lvl) => acc + lvl, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-red-500/60 p-6 shadow-2xl shadow-red-950/60 text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/20 animate-bounce">
            <HeartCrack className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Skull className="w-3.5 h-3.5" />
            Fin de la Partida
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            ¡Has Colapsado en la Calle!
          </h2>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Tu <strong className="text-red-400">Salud llegó a 0%</strong>. La dureza de la intemperie y el agotamiento extremo te sobrepasaron. Fuiste llevado de urgencia al hospital y has perdido tus negocios y efectivo. Todo recomienza desde cero.
          </p>

          {/* Stats summary */}
          <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-6 space-y-2 text-left">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Resumen de tu intento
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Dinero alcanzado
              </span>
              <span className="font-bold text-slate-100">${Math.floor(money).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Reputación final
              </span>
              <span className="font-bold text-slate-100">{Math.floor(reputation)}%</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Negocios construidos
              </span>
              <span className="font-bold text-slate-100">{totalBusinessesCount} niveles</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => resetGame()}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg shadow-red-600/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            Empezar Nuevamente
          </button>
        </div>
      </div>
    </div>
  );
}
