import React from 'react';
import {
  useGameStore,
  BUSINESSES,
  BUSINESS_LICENSE_COSTS,
  getBusinessUpgradeCost,
  getBusinessRestockCost
} from '../store/gameStore';
import { Briefcase, ChevronUp, PackageCheck, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export function BusinessList() {
  const money = useGameStore((state) => state.money);
  const health = useGameStore((state) => state.health);
  const auraTier = useGameStore((state) => state.auraTier || 0);
  const levels = useGameStore((state) => state.businessLevels || {});
  const supplies = useGameStore((state) => state.businessSupplies || {});
  const licenses = useGameStore((state) => state.businessLicenses || {});
  const buyBusiness = useGameStore((state) => state.buyBusiness);
  const buyBusinessLicense = useGameStore((state) => state.buyBusinessLicense);
  const restockBusiness = useGameStore((state) => state.restockBusiness);
  const restockAllBusinesses = useGameStore((state) => state.restockAllBusinesses);
  const prestigeUpgrades = useGameStore((state) => state.prestigeUpgrades);

  const isPaused = health < 10;

  // Calculate total restock cost for header button
  let totalRestockNeededCost = 0;
  let businessesNeedingRestockCount = 0;
  Object.entries(levels).forEach(([id, level]) => {
    if (level > 0 && (supplies[id] ?? 100) < 95) {
      totalRestockNeededCost += getBusinessRestockCost(id, level);
      businessesNeedingRestockCount++;
    }
  });

  const canAffordAllRestock = money >= totalRestockNeededCost && businessesNeedingRestockCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Negocios Pasivos y Puestos
          </h2>
          {isPaused ? (
            <span className="text-xs font-bold text-red-400 bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded inline-block mt-1">
              ⛔ Ganancias detenidas (Salud &lt; 10%)
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Requieren suministros para no perder rendimiento
            </span>
          )}
        </div>

        {businessesNeedingRestockCount > 0 && (
          <button
            onClick={() => restockAllBusinesses()}
            disabled={!canAffordAllRestock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              canAffordAllRestock
                ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 cursor-pointer shadow-sm shadow-amber-900/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reabastecer Todos (${totalRestockNeededCost.toLocaleString()})
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(BUSINESSES).map((biz) => {
          const currentLevel = levels[biz.id] || 0;
          const currentSupplies = supplies[biz.id] !== undefined ? supplies[biz.id] : 100;
          const currentLicenseTier = licenses[biz.id] || 0;
          const maxLevelAllowed = (currentLicenseTier + 1) * 25;
          const isAtLicenseCap = currentLevel >= maxLevelAllowed;

          const nextLicenseCost = (BUSINESS_LICENSE_COSTS[biz.id] || [])[currentLicenseTier];
          const canAffordLicense = nextLicenseCost !== undefined && money >= nextLicenseCost;

          const upgradeCost = getBusinessUpgradeCost(biz.id, currentLevel, prestigeUpgrades.entrepreneur);
          const canAffordUpgrade = money >= upgradeCost;

          const restockCost = getBusinessRestockCost(biz.id, currentLevel);
          const canAffordRestock = money >= restockCost;

          const auraMod = (prestigeUpgrades.aura ? 1.5 : 1.0) * ([1.0, 1.05, 1.12, 1.20, 1.35][auraTier] || 1.0);
          const suppliesMod = currentSupplies <= 0 ? 0.3 : 1.0;
          const currentIncomePerMin = (biz.baseIncome * currentLevel * suppliesMod) * auraMod;
          const currentIncomePerSec = currentIncomePerMin / 60;
          
          return (
            <div key={biz.id} className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 flex flex-col justify-between group relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-base flex items-center gap-1.5">
                      {biz.name}
                      {currentLevel > 25 && (
                        <span className="text-[10px] bg-purple-950/70 text-purple-300 border border-purple-800/80 px-1.5 py-0.2 rounded">
                          Escala Difícil
                        </span>
                      )}
                    </h3>

                    {currentLevel > 0 ? (
                      <div className="mt-1">
                        {isPaused ? (
                          <div className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                            <span>$0.00 / min</span>
                            <span className="text-xs font-normal text-red-400/80">(Detenido: Salud &lt; 10%)</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-sm font-bold ${currentSupplies <= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              +${currentIncomePerMin.toFixed(2)} / min
                            </span>
                            <span className="text-xs text-slate-400">
                              (+${currentIncomePerSec.toFixed(2)}/s)
                            </span>
                            {currentSupplies <= 0 && (
                              <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 border border-amber-800/80 px-1 rounded">
                                -70% Por desabastecimiento
                              </span>
                            )}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Nivel {currentLevel}/{maxLevelAllowed} · ${biz.baseIncome.toFixed(1)}/min base c/u
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 mt-1">
                        Inactivo · Producirá +${biz.baseIncome.toFixed(1)}/min al comprar
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-slate-900 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-inner">
                      Lv. {currentLevel}
                    </div>
                    {currentLicenseTier > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Hab. T{currentLicenseTier}
                      </span>
                    )}
                  </div>
                </div>

                {/* Supplies and Maintenance Section */}
                {currentLevel > 0 && (
                  <div className="my-3 bg-slate-900/70 p-2.5 rounded-lg border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1 font-medium">
                        <PackageCheck className="w-3.5 h-3.5 text-blue-400" />
                        {biz.suppliesName}
                      </span>
                      <span className={`font-mono font-bold text-xs ${
                        currentSupplies > 50 ? 'text-emerald-400' : currentSupplies > 20 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {Math.round(currentSupplies)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentSupplies > 50 
                            ? 'bg-emerald-500' 
                            : currentSupplies > 20 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, currentSupplies))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">
                        {currentSupplies <= 0 ? (
                          <span className="text-rose-400 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> ¡Agotado! Ingresos caen al 30%
                          </span>
                        ) : currentSupplies < 30 ? (
                          <span className="text-amber-300">⚠️ Insumos bajos</span>
                        ) : (
                          'Abastecido y operando al 100%'
                        )}
                      </span>

                      {currentSupplies < 100 && (
                        <button
                          onClick={() => restockBusiness(biz.id)}
                          disabled={!canAffordRestock}
                          className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                            canAffordRestock
                              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reponer (${restockCost.toLocaleString()})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Button: Upgrade or License Milestone */}
              {isAtLicenseCap && nextLicenseCost !== undefined ? (
                <div className="space-y-1.5 mt-2">
                  <div className="bg-amber-950/60 border border-amber-800/80 p-2 rounded-lg text-xs text-amber-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Límite de nivel ({maxLevelAllowed}) alcanzado. Requiere Habilitación Municipal.</span>
                  </div>
                  <button
                    onClick={() => buyBusinessLicense(biz.id)}
                    disabled={!canAffordLicense}
                    className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                      canAffordLicense
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/30 active:scale-98 cursor-pointer'
                        : 'bg-slate-700/60 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    Tramitar Habilitación T{currentLicenseTier + 1} (${nextLicenseCost.toLocaleString()})
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => buyBusiness(biz.id)}
                  disabled={!canAffordUpgrade}
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-semibold transition mt-2 ${
                    canAffordUpgrade 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer' 
                      : 'bg-slate-700/60 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <ChevronUp className="w-4 h-4" />
                  {currentLevel === 0 ? `Comprar por $${upgradeCost.toLocaleString()}` : `Subir a Lv. ${currentLevel + 1} por $${upgradeCost.toLocaleString()}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

