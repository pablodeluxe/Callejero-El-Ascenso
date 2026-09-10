import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Droplets, Smile, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

export function StatsBar() {
  const health = useGameStore((state) => state.health);
  const hygiene = useGameStore((state) => state.hygiene);
  const mood = useGameStore((state) => state.mood);
  const rep = useGameStore((state) => state.reputation);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatItem icon={<Heart />} label="Salud" value={health} color="bg-red-500" isWarning={health < 10} warningText="<10% Ganancias OFF" />
      <StatItem icon={<Droplets />} label="Higiene" value={hygiene} color="bg-amber-500" />
      <StatItem icon={<Smile />} label="Ánimo" value={mood} color="bg-blue-500" />
      <StatItem icon={<ShieldAlert />} label="Reputación" value={rep} color="bg-purple-500" />
    </div>
  );
}

function StatItem({ icon, label, value, color, isWarning, warningText }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
  isWarning?: boolean;
  warningText?: string;
}) {
  return (
    <div className={clsx(
      "rounded-xl p-3 border flex flex-col gap-2 transition-all",
      isWarning 
        ? "bg-red-950/40 border-red-500/80 shadow-lg shadow-red-950/50 animate-pulse" 
        : "bg-slate-800/80 border-slate-700/50"
    )}>
      <div className="flex items-center gap-2 text-slate-300">
        <div className={clsx("w-5 h-5", color.replace('bg-', 'text-'))}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          {isWarning && warningText && (
            <span className="text-[10px] font-bold text-red-400 -mt-0.5">{warningText}</span>
          )}
        </div>
        <span className={clsx("ml-auto text-sm font-bold", isWarning ? "text-red-400" : "text-white")}>
          {Math.floor(value)}%
        </span>
      </div>
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
        <div className={clsx("h-full transition-all duration-300 ease-out", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
