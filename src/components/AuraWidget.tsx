import React, { useState, useEffect } from 'react';
import { useGameStore, AURA_TIERS } from '../store/gameStore';
import { Sparkles, Flame, Glasses, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { AuraShopModal } from './AuraShopModal';

export function AuraWidget() {
  const aura = useGameStore((state) => state.aura || 0);
  const auraStreak = useGameStore((state) => state.auraStreak || 0);
  const auraFrenzyUntil = useGameStore((state) => state.auraFrenzyUntil || 0);
  const auraCooldownUntil = useGameStore((state) => state.auraCooldownUntil || 0);
  const auraTier = useGameStore((state) => state.auraTier || 0);
  const mood = useGameStore((state) => state.mood);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const poseForAura = useGameStore((state) => state.poseForAura);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [poseFeedback, setPoseFeedback] = useState<{ message: string; isFail?: boolean } | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update timer tick every second for frenzy/cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isFrenzy = now < auraFrenzyUntil;
  const isCooldown = !isFrenzy && now < auraCooldownUntil;
  const frenzySecondsLeft = Math.max(0, Math.ceil((auraFrenzyUntil - now) / 1000));
  const cooldownSecondsLeft = Math.max(0, Math.ceil((auraCooldownUntil - now) / 1000));

  const currentTierInfo = AURA_TIERS[auraTier] || AURA_TIERS[0];

  const handlePose = () => {
    const res = poseForAura();
    setPoseFeedback({ message: res.message, isFail: res.isFail });
    setTimeout(() => {
      setPoseFeedback((prev) => (prev?.message === res.message ? null : prev));
    }, 2800);
  };

  const isPoseDisabled = isGameOver || isCooldown || isFrenzy || mood <= 3;

  return (
    <div className={clsx(
      "rounded-2xl p-5 mb-6 border transition-all duration-300 relative overflow-hidden",
      isFrenzy
        ? "bg-gradient-to-br from-amber-950/70 via-slate-900 to-rose-950/70 border-amber-500/80 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400"
        : "bg-slate-900/90 border-slate-800 shadow-md",
      currentTierInfo.glowClass
    )}>
      {/* Background ambient glow */}
      {isFrenzy && (
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Header bar: Aura counter + Tier button */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className={clsx(
            "w-9 h-9 rounded-xl flex items-center justify-center border",
            isFrenzy 
              ? "bg-amber-500 text-slate-950 border-amber-400 animate-bounce" 
              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
          )}>
            {isFrenzy ? <Flame className="w-5 h-5" /> : <Glasses className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Aura Urbana
              </span>
              <span className={clsx(
                "text-[10px] font-black px-2 py-0.5 rounded-full border",
                currentTierInfo.badgeClass
              )}>
                {currentTierInfo.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={clsx(
                "text-2xl font-black tracking-tight tabular-nums",
                aura >= 0 ? "text-amber-300" : "text-rose-400"
              )}>
                {aura >= 0 ? `+${aura.toLocaleString('es-ES')}` : aura.toLocaleString('es-ES')}
              </span>
              <span className="text-xs text-slate-400 font-medium">pts</span>
            </div>
          </div>
        </div>

        {/* Button to open Aura Shop */}
        <button
          onClick={() => setIsShopOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tienda de Auras</span>
        </button>
      </div>

      {/* Frenzy Alert Banner */}
      {isFrenzy && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-between text-amber-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-black">
              ¡MODO AURA MÁXIMA ACTIVO! x3 Dinero en Recolección
            </span>
          </div>
          <span className="text-xs font-extrabold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
            {frenzySecondsLeft}s
          </span>
        </div>
      )}

      {/* Farming / Flexing Pose Action */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>🕺 Farmear Aura (Tirar Pose)</span>
              <span className="text-[10px] text-slate-500 font-normal">(-1% Ánimo)</span>
            </span>
            <span className="text-[11px] font-bold text-amber-400">
              {isFrenzy ? "Frenesí Activo" : `Racha: ${auraStreak}/10`}
            </span>
          </div>

          {/* Streak Dots / Progress */}
          <div className="grid grid-cols-10 gap-1 h-2 w-full">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={clsx(
                  "rounded-full transition-all duration-300",
                  isFrenzy
                    ? "bg-amber-400 shadow-sm shadow-amber-400 animate-pulse"
                    : idx < auraStreak
                      ? "bg-amber-500"
                      : "bg-slate-800"
                )}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center sm:items-end">
          <button
            onClick={handlePose}
            disabled={isPoseDisabled}
            className={clsx(
              "w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md",
              isFrenzy
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default"
                : isCooldown
                  ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  : mood <= 3
                    ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black cursor-pointer shadow-amber-500/20"
            )}
          >
            {isFrenzy ? (
              <>
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>¡Modo Frenesí ({frenzySecondsLeft}s)!</span>
              </>
            ) : isCooldown ? (
              <>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Descansando ({cooldownSecondsLeft}s)</span>
              </>
            ) : mood <= 3 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Sin Ánimo para Posar</span>
              </>
            ) : (
              <>
                <Glasses className="w-4 h-4" />
                <span>Tirar Pose (+Aura)</span>
              </>
            )}
          </button>

          {/* Feedback Toast */}
          {poseFeedback && (
            <p className={clsx(
              "text-[11px] mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150 text-center max-w-[280px]",
              poseFeedback.isFail
                ? "text-rose-400 font-extrabold bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-500/30"
                : "text-amber-300 font-bold"
            )}>
              {poseFeedback.message}
            </p>
          )}
        </div>
      </div>

      {/* Aura Shop Modal */}
      <AuraShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
