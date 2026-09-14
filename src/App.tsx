import React, { useMemo, useState, useEffect } from 'react';
import { useGameStore, BUSINESSES } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { StatsBar } from './components/StatsBar';
import { AuraWidget } from './components/AuraWidget';
import { BusinessList } from './components/BusinessList';
import { PrestigeShop } from './components/PrestigeShop';
import { TimedActionsScreen } from './components/TimedActionsScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { EventModal } from './components/EventModal';
import { OfflineModal } from './components/OfflineModal';
import { GameOverModal } from './components/GameOverModal';
import { Wallet, Activity, Droplets, Gamepad2, TrendingUp, AlertTriangle, AlertOctagon, Flame, Github, ExternalLink, Clock, Store, Sparkles } from 'lucide-react';

export default function App() {
  useGameLoop(); // Initialize the game loop
  
  const money = useGameStore((state) => state.money);
  const health = useGameStore((state) => state.health);
  const mood = useGameStore((state) => state.mood);
  const auraTier = useGameStore((state) => state.auraTier || 0);
  const auraFrenzyUntil = useGameStore((state) => state.auraFrenzyUntil || 0);
  const businessLevels = useGameStore((state) => state.businessLevels);
  const prestigeUpgrades = useGameStore((state) => state.prestigeUpgrades);
  const recoverStat = useGameStore((state) => state.recoverStat);
  const activeTimedTasks = useGameStore((state) => state.activeTimedTasks || {});

  const [currentScreen, setCurrentScreen] = useState<'hub' | 'timed_actions'>('hub');

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const activeTasksList = Object.values(activeTimedTasks);
  const activeTasksCount = activeTasksList.length;
  const hasReadyTasks = activeTasksList.some(
    (t) => now >= t.startTime + t.durationSeconds * 1000
  );

  const isFrenzy = now < auraFrenzyUntil;
  let baseClickGain = 1;
  if (auraTier >= 3) baseClickGain = 3;
  else if (auraTier >= 2) baseClickGain = 2;
  const clickGain = isFrenzy ? baseClickGain * 3 : baseClickGain;

  // Compute total passive income per minute and per second
  const { totalIncomePerMin, totalIncomePerSec, isDebuffed, isHealthCritical } = useMemo(() => {
    let incomePerMin = 0;
    Object.entries(businessLevels).forEach(([id, level]) => {
      const config = BUSINESSES[id];
      if (config && level > 0) {
        incomePerMin += config.baseIncome * level;
      }
    });

    if (prestigeUpgrades.aura) incomePerMin *= 1.5;

    // Apply Aura Tier Bonus
    const AURA_TIER_MULT = [1.0, 1.05, 1.12, 1.20, 1.35];
    incomePerMin *= (AURA_TIER_MULT[auraTier] || 1.0);

    let modifier = 1;
    let debuffed = false;
    if (health < 20) {
      modifier *= 0.5;
      debuffed = true;
    }
    if (mood < 20) {
      modifier *= 0.5;
      debuffed = true;
    }

    incomePerMin *= modifier;

    const critical = health < 10;
    if (critical) {
      incomePerMin = 0;
    }

    return {
      totalIncomePerMin: incomePerMin,
      totalIncomePerSec: incomePerMin / 60,
      isDebuffed: debuffed && !critical,
      isHealthCritical: critical
    };
  }, [businessLevels, prestigeUpgrades, auraTier, health, mood]);

  // Format money: show decimals when under $1,000 so real-time ticks are immediately visible
  const formattedMoney = money < 1000
    ? money.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.floor(money).toLocaleString('en-US');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20 selection:bg-blue-500/30">
      {/* Modals */}
      <EventModal />
      <OfflineModal />
      <GameOverModal />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/app-icon.png"
              alt="Callejero Icon"
              className="w-10 h-10 rounded-xl shadow-md border border-amber-500/40 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-white leading-tight">
                <span className="text-amber-400">Callejero:</span> El Ascenso
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                De la acera a la cima: sobrevive, progresa y forja tu imperio
              </p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Screen Switcher Navigation Bar */}
        <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <button
            id="tab-hub"
            onClick={() => setCurrentScreen('hub')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              currentScreen === 'hub'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Mi Esquina</span>
          </button>

          <button
            id="tab-timed-actions"
            onClick={() => setCurrentScreen('timed_actions')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 relative cursor-pointer ${
              currentScreen === 'timed_actions'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Changas & Rituales</span>

            {activeTasksCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  hasReadyTasks
                    ? 'bg-emerald-400 text-slate-950 animate-bounce'
                    : currentScreen === 'timed_actions'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {hasReadyTasks ? '¡Listo!' : activeTasksCount}
              </span>
            )}
          </button>
        </div>

        {/* Top Common Area: Money Display & Vital Stats */}
        <div className={`rounded-3xl p-6 sm:p-8 mb-6 border transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden ${
          isFrenzy 
            ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500/70 shadow-2xl shadow-amber-950/50 ring-1 ring-amber-400' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 font-semibold tracking-widest uppercase text-xs">
              <Wallet className="w-4 h-4" />
              Efectivo Actual
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter mb-3">
              ${formattedMoney}
            </h1>

            {/* Income Rate Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              {isHealthCritical ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/60 text-red-400 text-xs font-bold animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>⛔ Ganancias detenidas: Salud por debajo del 10%</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Pasivo: +${totalIncomePerMin.toFixed(2)} / min
                    <span className="text-emerald-300/70 font-normal ml-1">(+${totalIncomePerSec.toFixed(2)}/s)</span>
                  </span>
                </div>
              )}

              {isDebuffed && !isHealthCritical && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>-50% por baja Salud o Ánimo</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => useGameStore.getState().scavenge()}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer ${
                isFrenzy
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/40 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
            >
              {isFrenzy ? <Flame className="w-5 h-5 text-slate-950 animate-bounce" /> : <Wallet className="w-5 h-5" />}
              <span>
                {isFrenzy ? `¡Buscar Monedas (+${clickGain} FRENESÍ x3)!` : `Buscar Monedas (+${clickGain})`}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* SCREEN 1: MI ESQUINA (HUB) */}
        {currentScreen === 'hub' && (
          <div id="screen-hub" className="space-y-6 animate-fadeIn">
            {/* Aura & Estilo Urbana Widget */}
            <AuraWidget />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ActionBtn 
                icon={<Activity className="w-4 h-4" />} 
                label="Comer (-$20)" 
                desc="Recupera 30 Salud"
                onClick={() => recoverStat('health', 30, 20)} 
                disabled={money < 20}
              />
              <ActionBtn 
                icon={<Droplets className="w-4 h-4" />} 
                label="Ducharse (-$15)" 
                desc="Recupera 40 Higiene"
                onClick={() => recoverStat('hygiene', 40, 15)} 
                disabled={money < 15}
              />
              <ActionBtn 
                icon={<Gamepad2 className="w-4 h-4" />} 
                label="Ocio (-$30)" 
                desc="Recupera 35 Ánimo"
                onClick={() => recoverStat('mood', 35, 30)} 
                disabled={money < 30}
              />
            </div>

            {/* Businesses */}
            <BusinessList />

            {/* Prestige System */}
            <PrestigeShop />
          </div>
        )}

        {/* SCREEN 2: CHANGAS & RITUALES */}
        {currentScreen === 'timed_actions' && (
          <div id="screen-timed-actions" className="animate-fadeIn">
            <TimedActionsScreen />
          </div>
        )}

        {/* Footer Credits */}
        <footer id="app-footer" className="mt-14 pt-6 pb-8 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Desarrollado por <strong className="text-slate-200 font-semibold">pablodeluxe</strong></span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <a
            id="github-repo-link"
            href="https://github.com/pablodeluxe/callejero-el-ascenso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium hover:underline underline-offset-4"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Ver repositorio en GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </footer>
        
      </main>
    </div>
  );
}

function ActionBtn({ icon, label, desc, onClick, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition group ${
        disabled 
          ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
          : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2 font-bold mb-1">
        {icon}
        {label}
      </div>
      <div className="text-xs text-slate-500">{desc}</div>
    </button>
  );
}
