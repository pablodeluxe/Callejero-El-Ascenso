import React from 'react';
import { useGameStore, AURA_TIERS } from '../store/gameStore';
import { Sparkles, Check, Lock, X, Zap } from 'lucide-react';
import clsx from 'clsx';

interface AuraShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuraShopModal({ isOpen, onClose }: AuraShopModalProps) {
  const aura = useGameStore((state) => state.aura || 0);
  const auraTier = useGameStore((state) => state.auraTier || 0);
  const buyAuraTier = useGameStore((state) => state.buyAuraTier);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Tienda de Estilo & Auras
              </h2>
              <p className="text-xs text-slate-400">
                Gasta tus puntos de Aura en presencia, respeto y multiplicadores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Aura Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Tus Puntos de Aura:</span>
          <div className="flex items-center gap-1.5 font-black text-base">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className={aura >= 0 ? "text-amber-300" : "text-red-400"}>
              {aura >= 0 ? `+${aura.toLocaleString('es-ES')}` : aura.toLocaleString('es-ES')}
            </span>
          </div>
        </div>

        {/* Tiers List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-800/60">
          {AURA_TIERS.map((tierInfo) => {
            const isUnlocked = auraTier >= tierInfo.tier;
            const isCurrent = auraTier === tierInfo.tier;
            const isNextTier = tierInfo.tier === auraTier + 1;
            const canAfford = aura >= tierInfo.cost;

            return (
              <div
                key={tierInfo.tier}
                className={clsx(
                  "pt-3.5 first:pt-0 rounded-xl p-3 border transition-all",
                  isCurrent 
                    ? "bg-slate-800/90 border-amber-500/50 shadow-lg shadow-amber-950/20" 
                    : isUnlocked 
                      ? "bg-slate-800/40 border-slate-700/40 opacity-75"
                      : "bg-slate-900/60 border-slate-800"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx("px-2 py-0.5 rounded text-[11px] font-bold border", tierInfo.badgeClass)}>
                      Nivel {tierInfo.tier}
                    </span>
                    <h3 className="font-bold text-sm text-white">{tierInfo.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold">
                        ACTIVO
                      </span>
                    )}
                  </div>

                  {tierInfo.tier > 0 && (
                    <span className="text-xs font-bold text-amber-400 whitespace-nowrap">
                      {tierInfo.cost.toLocaleString('es-ES')} Aura
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {tierInfo.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>{tierInfo.perk}</span>
                  </div>

                  {tierInfo.tier > 0 && (
                    <div>
                      {isUnlocked ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-3 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          <span>Obtenido</span>
                        </div>
                      ) : (
                        <button
                          disabled={!isNextTier || !canAfford}
                          onClick={() => buyAuraTier(tierInfo.tier)}
                          className={clsx(
                            "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition",
                            isNextTier && canAfford
                              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
                              : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                          )}
                        >
                          {!isNextTier ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Bloqueado</span>
                            </>
                          ) : canAfford ? (
                            <>
                              <Sparkles className="w-3 h-3" />
                              <span>Desbloquear</span>
                            </>
                          ) : (
                            <span>Faltan {(tierInfo.cost - aura).toLocaleString('es-ES')}</span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
