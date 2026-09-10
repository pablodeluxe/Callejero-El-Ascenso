import React from 'react';
import { useGameStore, BUSINESSES } from '../store/gameStore';
import { Briefcase, ChevronUp } from 'lucide-react';

export function BusinessList() {
  const money = useGameStore((state) => state.money);
  const health = useGameStore((state) => state.health);
  const levels = useGameStore((state) => state.businessLevels);
  const buyBusiness = useGameStore((state) => state.buyBusiness);
  const prestigeUpgrades = useGameStore((state) => state.prestigeUpgrades);

  const isPaused = health < 10;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          Negocios Pasivos
        </h2>
        {isPaused ? (
          <span className="text-xs font-bold text-red-400 bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded">
            ⛔ Ganancias detenidas (Salud &lt; 10%)
          </span>
        ) : (
          <span className="text-xs text-slate-400">Generan ingresos automáticamente</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(BUSINESSES).map((biz) => {
          const currentLevel = levels[biz.id] || 0;
          const baseCost = prestigeUpgrades.entrepreneur ? biz.baseCost * 0.75 : biz.baseCost;
          const cost = Math.floor(baseCost * Math.pow(biz.multiplier, currentLevel));
          const canAfford = money >= cost;

          const auraMod = prestigeUpgrades.aura ? 1.5 : 1.0;
          const currentIncomePerMin = (biz.baseIncome * currentLevel) * auraMod;
          const currentIncomePerSec = currentIncomePerMin / 60;
          
          return (
            <div key={biz.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white text-base">{biz.name}</h3>
                  {currentLevel > 0 ? (
                    <div className="mt-1">
                      {isPaused ? (
                        <div className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                          <span>$0.00 / min</span>
                          <span className="text-xs font-normal text-red-400/80">(Detenido: Salud &lt; 10%)</span>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                          <span>+${currentIncomePerMin.toFixed(2)} / min</span>
                          <span className="text-xs font-normal text-slate-400">(+${currentIncomePerSec.toFixed(2)}/s)</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Nivel {currentLevel} × ${biz.baseIncome.toFixed(1)}/min base
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 mt-1">
                      Inactivo · Producirá +${biz.baseIncome.toFixed(1)}/min al comprar
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-inner">
                  Lv. {currentLevel}
                </div>
              </div>
              
              <button
                onClick={() => buyBusiness(biz.id)}
                disabled={!canAfford}
                className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                  canAfford 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer' 
                    : 'bg-slate-700/60 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                {currentLevel === 0 ? `Comprar por $${cost.toLocaleString()}` : `Subir a Lv. ${currentLevel + 1} por $${cost.toLocaleString()}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
