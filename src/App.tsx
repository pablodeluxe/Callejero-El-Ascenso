import React, { useMemo } from 'react';
import { useGameStore, BUSINESSES } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { StatsBar } from './components/StatsBar';
import { BusinessList } from './components/BusinessList';
import { PrestigeShop } from './components/PrestigeShop';
import { PWAInstallButton } from './components/PWAInstallButton';
import { EventModal } from './components/EventModal';
import { OfflineModal } from './components/OfflineModal';
import { GameOverModal } from './components/GameOverModal';
import { Wallet, Activity, Droplets, Gamepad2, TrendingUp, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function App() {
  useGameLoop(); // Initialize the game loop
  
  const money = useGameStore((state) => state.money);
  const health = useGameStore((state) => state.health);
  const mood = useGameStore((state) => state.mood);
  const businessLevels = useGameStore((state) => state.businessLevels);
  const prestigeUpgrades = useGameStore((state) => state.prestigeUpgrades);
  const recoverStat = useGameStore((state) => state.recoverStat);

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
  }, [businessLevels, prestigeUpgrades, health, mood]);

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Money Display */}
        <div className="bg-slate-900 rounded-3xl p-8 mb-8 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 font-semibold tracking-widest uppercase text-xs">
              <Wallet className="w-4 h-4" />
              Efectivo Actual
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter mb-3">
              ${formattedMoney}
            </h1>

            {/* Income Rate Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
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
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
              Buscar Monedas (+$1)
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Quick Actions */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-3">
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
