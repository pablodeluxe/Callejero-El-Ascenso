import React, { useState, useEffect } from 'react';
import { useGameStore, ActiveTimedTask } from '../store/gameStore';
import {
  PRIMARY_TIMED_ACTIONS,
  SECONDARY_TIMED_ACTIONS,
  TimedAction,
  TimedActionTier
} from '../data/timedActions';
import {
  Magnet,
  UtensilsCrossed,
  Mic2,
  Car,
  Ticket,
  Trash2,
  Sparkles,
  Coins,
  Droplet,
  Radio,
  Shield,
  Flame,
  Smile,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Gift,
  Zap,
  TrendingUp,
  Heart,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';

const ACTION_ICONS: Record<string, React.ElementType> = {
  Magnet,
  UtensilsCrossed,
  Mic2,
  Car,
  Ticket,
  Trash2,
  Sparkles,
  Coins,
  Droplet,
  Radio,
  Shield,
  Flame,
  Smile
};

interface ClaimResult {
  actionName: string;
  wonGamble: boolean;
  gainedMoney: number;
  gainedAura: number;
  healthDelta: number;
  hygieneDelta: number;
  moodDelta: number;
  repDelta: number;
  message: string;
}

export function TimedActionsScreen() {
  const money = useGameStore((state) => state.money);
  const activeTimedTasks = useGameStore((state) => state.activeTimedTasks || {});
  const startTimedTask = useGameStore((state) => state.startTimedTask);
  const cancelTimedTask = useGameStore((state) => state.cancelTimedTask);
  const claimTimedTask = useGameStore((state) => state.claimTimedTask);

  // Selected tiers per action { [actionId]: tierIndex }
  const [selectedTiers, setSelectedTiers] = useState<Record<string, number>>({});
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'primary' | 'secondary'>('all');

  // Local ticker for live timers
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const taskList = Object.values(activeTimedTasks);
  const primaryTask = taskList.find((t) => t.category === 'primary');
  const secondaryTasks = taskList.filter((t) => t.category === 'secondary');

  const getTierIndex = (actionId: string) => selectedTiers[actionId] ?? 0;

  const handleSelectTier = (actionId: string, index: number) => {
    setSelectedTiers((prev) => ({ ...prev, [actionId]: index }));
  };

  const handleStartTask = (action: TimedAction) => {
    const tierIdx = getTierIndex(action.id);
    const res = startTimedTask(action.id, tierIdx);
    if (!res.success) {
      setActionMessage({ type: 'error', text: res.message });
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ type: 'success', text: res.message });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleClaim = (taskId: string) => {
    const res = claimTimedTask(taskId);
    if (res.success && res.details) {
      setClaimResult({
        ...res.details,
        message: res.message
      });
    } else {
      setActionMessage({ type: 'error', text: res.message });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const formatRemainingTime = (startTime: number, durationSeconds: number) => {
    const elapsed = (now - startTime) / 1000;
    const remaining = Math.max(0, Math.ceil(durationSeconds - elapsed));
    if (remaining === 0) return '00:00';
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTaskProgress = (startTime: number, durationSeconds: number) => {
    const elapsed = (now - startTime) / 1000;
    return Math.min(100, Math.max(0, (elapsed / durationSeconds) * 100));
  };

  return (
    <div id="timed-actions-screen" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 p-5 sm:p-6 border border-indigo-800/40 shadow-xl">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              Expediciones & Rituales de Calle
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Changas por Tiempo & Rituales
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Ejecuta una <strong className="text-amber-300">Changa Principal</strong> para ganar dinero u objetos, y acompáñala con hasta <strong className="text-cyan-300">2 Rituales en Paralelo</strong> para proteger tus atributos y potenciar tus ganancias.
            </p>
          </div>

          {/* Active Slots Summary Pill */}
          <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <div className="text-center px-2 border-r border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Principal</div>
              <div className={`text-xs font-extrabold ${primaryTask ? 'text-amber-400' : 'text-emerald-400'}`}>
                {primaryTask ? '1/1 Ocupado' : '1 Libre'}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Rituales</div>
              <div className={`text-xs font-extrabold ${secondaryTasks.length >= 2 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {secondaryTasks.length}/2 Activos
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Message Banner */}
        {actionMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 border transition-all animate-fadeIn ${
              actionMessage.type === 'error'
                ? 'bg-rose-950/80 text-rose-200 border-rose-800/80'
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-800/80'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Active Tasks In Progress Section */}
      {taskList.length > 0 && (
        <section id="active-tasks-tray" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Actividades en Curso ({taskList.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Corren en tiempo real incluso con el juego cerrado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {taskList.map((task) => {
              const allActions = [...PRIMARY_TIMED_ACTIONS, ...SECONDARY_TIMED_ACTIONS];
              const action = allActions.find((a) => a.id === task.actionId);
              if (!action) return null;
              const tier = action.tiers[task.tierIndex];
              const progress = getTaskProgress(task.startTime, task.durationSeconds);
              const isReady = progress >= 100;
              const IconComp = ACTION_ICONS[action.icon] || Clock;
              const isPrimary = task.category === 'primary';

              return (
                <div
                  key={task.id}
                  className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                    isReady
                      ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/70 shadow-emerald-950/50'
                      : isPrimary
                      ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-950/20'
                      : 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/40 shadow-cyan-950/20'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPrimary
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isPrimary ? '🛠️ Changa Principal' : '🧪 Ritual Paralelo'}
                      </span>

                      {!isReady && (
                        <button
                          onClick={() => cancelTimedTask(task.id)}
                          title="Cancelar actividad"
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Action Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isPrimary
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">{action.name}</h4>
                        <p className="text-[11px] text-slate-400">{tier.label}</p>
                      </div>
                    </div>

                    {/* Progress Bar & Timer */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={isReady ? 'text-emerald-300' : 'text-slate-300'}>
                          {isReady ? '¡Completado!' : 'Tiempo restante:'}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isReady ? 'text-emerald-400 animate-pulse' : 'text-slate-200'
                          }`}
                        >
                          {isReady ? '00:00' : formatRemainingTime(task.startTime, task.durationSeconds)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isReady
                              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                              : isPrimary
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  {isReady ? (
                    <button
                      onClick={() => handleClaim(task.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/60 border border-emerald-400/50 flex items-center justify-center gap-1.5 active:scale-98 transition cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-emerald-200 animate-bounce" />
                      <span>¡Reclamar Recompensa!</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-500 text-center py-1 font-medium italic">
                      En progreso... puedes seguir jugando o cerrar la app
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Todas las Actividades
        </button>
        <button
          onClick={() => setActiveTab('primary')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'primary'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
          }`}
        >
          <span>🛠️ Changas Principales</span>
          {primaryTask && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
        </button>
        <button
          onClick={() => setActiveTab('secondary')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'secondary'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
          }`}
        >
          <span>🧪 Rituales en Paralelo</span>
          {secondaryTasks.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* SECTION 1: PRIMARY TIMED ACTIONS */}
      {(activeTab === 'all' || activeTab === 'primary') && (
        <section id="primary-actions-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Magnet className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-white">Changas Principales</h3>
                <p className="text-xs text-slate-400">
                  Requieren tu presencia física completa. <strong>Solo puedes ejecutar 1 a la vez</strong>.
                </p>
              </div>
            </div>

            {primaryTask && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                ⚠️ Slot Ocupado (1/1)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRIMARY_TIMED_ACTIONS.map((action) => {
              const IconComp = ACTION_ICONS[action.icon] || Clock;
              const selectedIdx = getTierIndex(action.id);
              const tier = action.tiers[selectedIdx] || action.tiers[0];
              const isCurrentlyRunning = taskList.some((t) => t.actionId === action.id);
              const hasOtherPrimaryRunning = primaryTask && !isCurrentlyRunning;
              const cantAfford = tier.cost && money < tier.cost;

              const isButtonDisabled = isCurrentlyRunning || !!hasOtherPrimaryRunning || !!cantAfford;

              return (
                <div
                  key={action.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isCurrentlyRunning
                      ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                          {action.name}
                        </h4>
                        <p className="text-xs text-amber-300/90 italic line-clamp-1">
                          {action.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
                      {action.description}
                    </p>

                    {/* Tier Selector Buttons */}
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Elegir Duración:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {action.tiers.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectTier(action.id, idx)}
                            disabled={isCurrentlyRunning}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                              selectedIdx === idx
                                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                            } ${isCurrentlyRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {t.label.split(' ')[0]} {t.label.split(' ')[1] || ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Tier Preview Card */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 mb-4">
                      <div className="text-xs text-slate-300 font-medium">
                        "{tier.description}"
                      </div>

                      {tier.cost && (
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <span>Coste / Apuesta requerida:</span>
                          <span className="font-mono text-white">${tier.cost}</span>
                          {money < tier.cost && (
                            <span className="text-[10px] text-rose-400 font-normal">
                              (Faltan ${tier.cost - money})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                        {tier.rewards.moneyMin !== undefined && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/20">
                            💰 ${tier.rewards.moneyMin}
                            {tier.rewards.moneyMax ? ` - $${tier.rewards.moneyMax}` : ''}
                          </span>
                        )}
                        {tier.rewards.health !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold border ${
                              tier.rewards.health > 0
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/20'
                                : 'bg-rose-950 text-rose-400 border-rose-800'
                            }`}
                          >
                            ❤️ {tier.rewards.health > 0 ? `+${tier.rewards.health}%` : `${tier.rewards.health}%`} Salud
                          </span>
                        )}
                        {tier.rewards.hygiene !== undefined && (
                          <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 font-bold border border-sky-800">
                            🧼 {tier.rewards.hygiene > 0 ? `+${tier.rewards.hygiene}%` : `${tier.rewards.hygiene}%`} Higiene
                          </span>
                        )}
                        {tier.rewards.mood !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold border ${
                              tier.rewards.mood > 0
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                            }`}
                          >
                            🎭 {tier.rewards.mood > 0 ? `+${tier.rewards.mood}%` : `${tier.rewards.mood}%`} Ánimo
                          </span>
                        )}
                        {tier.rewards.reputation !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold border ${
                              tier.rewards.reputation > 0
                                ? 'bg-teal-500/15 text-teal-300 border-teal-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            ⭐ {tier.rewards.reputation > 0 ? `+${tier.rewards.reputation}` : `${tier.rewards.reputation}`} Reputación
                          </span>
                        )}
                        {tier.rewards.aura !== undefined && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold border border-purple-500/20">
                            ✨ +{tier.rewards.aura} Aura
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartTask(action)}
                    disabled={isButtonDisabled}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md ${
                      isCurrentlyRunning
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : hasOtherPrimaryRunning
                        ? 'bg-slate-800/80 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : cantAfford
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold border border-amber-400 active:scale-98 cursor-pointer'
                    }`}
                  >
                    {isCurrentlyRunning ? (
                      <span>⏳ Changa en Curso...</span>
                    ) : hasOtherPrimaryRunning ? (
                      <span>⚠️ Ya tienes otra changa principal activa</span>
                    ) : cantAfford ? (
                      <span>❌ Fondos insuficientes (${tier.cost})</span>
                    ) : (
                      <>
                        <span>Comenzar Changa ({tier.label})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: SECONDARY PARALLEL RITUALS */}
      {(activeTab === 'all' || activeTab === 'secondary') && (
        <section id="secondary-actions-section" className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Droplet className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-white">Rituales y Acompañamientos</h3>
                <p className="text-xs text-slate-400">
                  Otorgan bendiciones y protecciones continuas. <strong>Puedes activar hasta 2 en paralelo</strong> con tus changas.
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border self-start sm:self-auto ${
                secondaryTasks.length >= 2
                  ? 'text-rose-300 bg-rose-950/60 border-rose-800'
                  : 'text-cyan-300 bg-cyan-950/60 border-cyan-800'
              }`}
            >
              Slots de Rituales: {secondaryTasks.length}/2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECONDARY_TIMED_ACTIONS.map((action) => {
              const IconComp = ACTION_ICONS[action.icon] || Clock;
              const selectedIdx = getTierIndex(action.id);
              const tier = action.tiers[selectedIdx] || action.tiers[0];
              const isCurrentlyRunning = taskList.some((t) => t.actionId === action.id);
              const maxSecondaryReached = secondaryTasks.length >= 2 && !isCurrentlyRunning;

              const isButtonDisabled = isCurrentlyRunning || maxSecondaryReached;

              return (
                <div
                  key={action.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isCurrentlyRunning
                      ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                          {action.name}
                        </h4>
                        <p className="text-xs text-cyan-300/90 italic line-clamp-1">
                          {action.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
                      {action.description}
                    </p>

                    {/* Tier Selector Buttons */}
                    <div className="mb-3">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Elegir Duración del Efecto:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {action.tiers.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectTier(action.id, idx)}
                            disabled={isCurrentlyRunning}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                              selectedIdx === idx
                                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                            } ${isCurrentlyRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {t.label.split(' ')[0]} {t.label.split(' ')[1] || ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Tier Preview Card */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 mb-4">
                      <div className="text-xs text-slate-300 font-medium">
                        "{tier.description}"
                      </div>

                      {/* Buff Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                        {tier.buffs?.preventHealthDecay && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/20 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Inmune al desgaste de Salud
                          </span>
                        )}
                        {tier.buffs?.preventMoodDecay && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Ánimo 100% Congelado
                          </span>
                        )}
                        {tier.buffs?.moneyMultiplier && (
                          <span className="px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-300 font-bold border border-yellow-500/20 flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            +{Math.round((tier.buffs.moneyMultiplier - 1) * 100)}% Dinero en Changas
                          </span>
                        )}
                        {tier.buffs?.auraMultiplier && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold border border-purple-500/20 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            +{Math.round((tier.buffs.auraMultiplier - 1) * 100)}% Ganancia de Aura
                          </span>
                        )}
                        {tier.buffs?.negativeEventImmunity && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/20 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Inmunidad a Eventos Malos
                          </span>
                        )}
                        {tier.rewards.aura !== undefined && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold border border-purple-500/20">
                            ✨ +{tier.rewards.aura} Aura al finalizar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartTask(action)}
                    disabled={isButtonDisabled}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md ${
                      isCurrentlyRunning
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : maxSecondaryReached
                        ? 'bg-slate-800/80 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold border border-cyan-400 active:scale-98 cursor-pointer'
                    }`}
                  >
                    {isCurrentlyRunning ? (
                      <span>🧪 Ritual en Curso...</span>
                    ) : maxSecondaryReached ? (
                      <span>⚠️ Límite de 2 rituales alcanzado</span>
                    ) : (
                      <>
                        <span>Activar Ritual ({tier.label})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Claim Rewards Modal Dialog */}
      {claimResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 border border-emerald-500/60 shadow-2xl shadow-emerald-950/80">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-950/60">
                <Gift className="h-8 w-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {claimResult.wonGamble ? '¡Recompensa Reclamada!' : '¡Resultado de la Actividad!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{claimResult.message}</p>
              </div>

              {/* Rewards Summary Grid */}
              <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 space-y-2.5 text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Resumen de lo obtenido:
                </div>

                {claimResult.gainedMoney > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-400" /> Dinero Ganado:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      +${claimResult.gainedMoney.toLocaleString()}
                    </span>
                  </div>
                )}

                {claimResult.gainedAura > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" /> Aura Acumulada:
                    </span>
                    <span className="font-mono font-bold text-purple-400">
                      +{claimResult.gainedAura}
                    </span>
                  </div>
                )}

                {claimResult.healthDelta !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" /> Salud:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        claimResult.healthDelta > 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {claimResult.healthDelta > 0
                        ? `+${claimResult.healthDelta}%`
                        : `${claimResult.healthDelta}%`}
                    </span>
                  </div>
                )}

                {claimResult.hygieneDelta !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-sky-400" /> Higiene:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        claimResult.hygieneDelta > 0 ? 'text-sky-400' : 'text-slate-400'
                      }`}
                    >
                      {claimResult.hygieneDelta > 0
                        ? `+${claimResult.hygieneDelta}%`
                        : `${claimResult.hygieneDelta}%`}
                    </span>
                  </div>
                )}

                {claimResult.moodDelta !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-amber-400" /> Ánimo:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        claimResult.moodDelta > 0 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {claimResult.moodDelta > 0
                        ? `+${claimResult.moodDelta}%`
                        : `${claimResult.moodDelta}%`}
                    </span>
                  </div>
                )}

                {claimResult.repDelta !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-400" /> Reputación:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        claimResult.repDelta > 0 ? 'text-teal-400' : 'text-slate-400'
                      }`}
                    >
                      {claimResult.repDelta > 0
                        ? `+${claimResult.repDelta}`
                        : `${claimResult.repDelta}`}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setClaimResult(null)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/60 border border-emerald-400/50 active:scale-98 transition cursor-pointer"
              >
                Continuar Jugando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
