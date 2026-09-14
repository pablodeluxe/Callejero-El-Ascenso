import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HeartCrack, RotateCcw, Skull, DollarSign, Award, Briefcase, Biohazard, Crown, Trash2, HeartPulse } from 'lucide-react';

interface DeathDetails {
  badge: string;
  title: string;
  story: string;
  statLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  borderStyle: string;
  shadowStyle: string;
  badgeStyle: string;
  iconBoxStyle: string;
  btnStyle: string;
}

const DEATH_CONFIGS: Record<'health' | 'hygiene' | 'mood' | 'reputation', DeathDetails> = {
  health: {
    badge: 'Colapso Físico Total',
    title: '¡Te Desplomaste como un Saco de Papas!',
    story: 'Tu Salud llegó a 0%. Alimentarte de misteriosas sobras de empanada fría y dormir sobre un palé chueco te pasó factura. Una paloma te aleteó en la cara, te dio un mareo de película muda y caíste desmayado en la acera. Los transeúntes te aplaudieron creyendo que era una performance de arte contemporáneo antes de que la ambulancia se llevara tu dignidad.',
    statLabel: 'Salud: 0% (Agotamiento Extremo)',
    Icon: HeartCrack,
    borderStyle: 'border-red-500/60',
    shadowStyle: 'shadow-red-950/60',
    badgeStyle: 'bg-red-950/80 border-red-800 text-red-400',
    iconBoxStyle: 'bg-red-500/15 border-red-500/40 text-red-500 shadow-red-500/20',
    btnStyle: 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
  },
  hygiene: {
    badge: 'Alerta Bioquímica Municipal',
    title: '¡Evacuación por Arma Biológica Callejera!',
    story: 'Tu Higiene llegó a 0%. Tu persistente fragancia a calcetín milenario, fritura rancia y humedad de alcantarilla rompió el récord municipal de toxicidad. La brigada de emergencias con trajes NBQ acordonó tres cuadras y te roció con espuma desinfectante a presión. Saliste rodando limpio como una patena hacia los suburbios, pero perdiste todas tus pertenencias.',
    statLabel: 'Higiene: 0% (Aroma Radiactivo)',
    Icon: Biohazard,
    borderStyle: 'border-amber-500/60',
    shadowStyle: 'shadow-amber-950/60',
    badgeStyle: 'bg-amber-950/80 border-amber-800 text-amber-400',
    iconBoxStyle: 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-amber-500/20',
    btnStyle: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
  },
  mood: {
    badge: 'Delirio Místico Urbano',
    title: '¡Te Proclamaste el Rey de las Palomas!',
    story: 'Tu Ánimo llegó a 0%. La melancolía callejera y la lluvia gris terminaron de freír tu cordura. Te quitaste los zapatos, te encajaste una caja de pizza vacía como corona real y te fuiste descalzo cantando ópera con una bandada de palomas para fundar un imperio aviar en la fuente de la plaza. Tus negocios quedaron totalmente desiertos.',
    statLabel: 'Ánimo: 0% (Locura y Fuga)',
    Icon: Crown,
    borderStyle: 'border-blue-500/60',
    shadowStyle: 'shadow-blue-950/60',
    badgeStyle: 'bg-blue-950/80 border-blue-800 text-blue-400',
    iconBoxStyle: 'bg-blue-500/15 border-blue-500/40 text-blue-400 shadow-blue-500/20',
    btnStyle: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
  },
  reputation: {
    badge: 'Cancelación Masiva de Barrio',
    title: '¡Desterrado en Contenedor con Ruedas!',
    story: 'Tu Reputación llegó a 0%. Tu fama cayó tan hondo que hasta los perros callejeros cruzaban de vereda para no saludarte. Hartos de tus bochornos públicos, los comerciantes y vecinos se organizaron para meterte amistosamente dentro de un contenedor de basura con ruedas y lanzarte colina abajo hacia la autopista. ¡A empezar de cero en otra ciudad!',
    statLabel: 'Reputación: 0% (Dignidad Bajo Cero)',
    Icon: Trash2,
    borderStyle: 'border-purple-500/60',
    shadowStyle: 'shadow-purple-950/60',
    badgeStyle: 'bg-purple-950/80 border-purple-800 text-purple-400',
    iconBoxStyle: 'bg-purple-500/15 border-purple-500/40 text-purple-400 shadow-purple-500/20',
    btnStyle: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
  }
};

export function GameOverModal() {
  const isGameOver = useGameStore((state) => state.isGameOver);
  const deathReason = useGameStore((state) => state.deathReason);
  const health = useGameStore((state) => state.health);
  const hygiene = useGameStore((state) => state.hygiene);
  const mood = useGameStore((state) => state.mood);
  const reputation = useGameStore((state) => state.reputation);
  const money = useGameStore((state) => state.money);
  const businessLevels = useGameStore((state) => state.businessLevels);
  const resetGame = useGameStore((state) => state.resetGame);
  const reviveCharacter = useGameStore((state) => state.reviveCharacter);

  const isDead = isGameOver || health <= 0 || hygiene <= 0 || mood <= 0 || reputation <= 0;

  if (!isDead) return null;

  // Determine which funny death to display
  const effectiveReason: 'health' | 'hygiene' | 'mood' | 'reputation' =
    deathReason ||
    (health <= 0
      ? 'health'
      : hygiene <= 0
      ? 'hygiene'
      : mood <= 0
      ? 'mood'
      : reputation <= 0
      ? 'reputation'
      : 'health');

  const config = DEATH_CONFIGS[effectiveReason];
  const { Icon } = config;
  const totalBusinessesCount = Object.values(businessLevels).reduce((acc, lvl) => acc + lvl, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-2xl bg-slate-900 border-2 ${config.borderStyle} p-6 shadow-2xl ${config.shadowStyle} text-center relative overflow-hidden`}>
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Comic Icon Badge */}
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 shadow-lg animate-bounce ${config.iconBoxStyle}`}>
            <Icon className="w-8 h-8" />
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2 ${config.badgeStyle}`}>
            <Skull className="w-3.5 h-3.5" />
            {config.badge}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight mb-2">
            {config.title}
          </h2>

          <div className="mb-3 px-3 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-semibold text-slate-300">
            Causa mortal: <span className="font-bold text-red-400">{config.statLabel}</span>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed text-left bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            {config.story}
          </p>

          {/* Stats summary of current attempt */}
          <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-6 space-y-2 text-left">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Legado de tu intento
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

          {/* Action Buttons: Reanimación Callejera vs Reiniciar */}
          <div className="w-full space-y-2.5">
            <button
              onClick={() => reviveCharacter()}
              className="w-full py-3 px-4 rounded-xl text-white font-extrabold text-sm shadow-xl transition active:scale-98 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 cursor-pointer shadow-emerald-950/60"
            >
              <HeartPulse className="w-5 h-5 text-emerald-200 animate-pulse" />
              <span>
                🚑 Reanimación Callejera (Coste: ${Math.floor(money).toLocaleString()})
              </span>
            </button>

            <p className="text-[11px] text-emerald-400/90 leading-tight text-center px-1">
              Entregas todo tu dinero actual a los paramédicos del hospital. Revives con <strong>Salud, Higiene y Ánimo al 25%</strong>, conservando tus negocios, reputación y nivel de Aura intactos (las <em>changas y rituales en curso se cancelan y se pierde su progreso</em>).
            </p>

            <button
              onClick={() => resetGame()}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-bold text-xs bg-slate-950/90 hover:bg-slate-800 border border-slate-800 transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Aceptar el Destino y Reiniciar Partida de Cero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
