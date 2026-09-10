import React, { useState } from 'react';
import { useGameStore, BUSINESSES } from '../store/gameStore';
import { Crown, Sparkles, Shield, Building2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export function PrestigeShop() {
  const {
    prestigeTokens,
    prestigeUpgrades,
    money,
    businessLevels,
    prestigeReset,
    buyPrestigeUpgrade
  } = useGameStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [justDonatedMsg, setJustDonatedMsg] = useState<string | null>(null);

  // Calculate actual total invested value in businesses + current cash
  const investedInBusinesses = Object.entries(businessLevels).reduce((acc, [id, lvl]) => {
    const config = BUSINESSES[id];
    if (!config || lvl <= 0) return acc;
    let sum = 0;
    for (let i = 0; i < lvl; i++) {
      sum += Math.floor(config.baseCost * Math.pow(config.multiplier, i));
    }
    return acc + sum;
  }, 0);

  const totalValue = money + investedInBusinesses;
  
  // 1 Token per $500 in total accumulated value (fair and achievable progression)
  const TOKEN_RATE = 500;
  const potentialTokens = Math.floor(totalValue / TOKEN_RATE);
  const progressToNext = totalValue % TOKEN_RATE;
  const remainingForNext = TOKEN_RATE - progressToNext;
  const progressPercent = Math.min(100, Math.floor((progressToNext / TOKEN_RATE) * 100));

  const handleConfirmPrestige = () => {
    if (potentialTokens < 1) return;
    
    prestigeReset(potentialTokens);
    setShowConfirmModal(false);
    setJustDonatedMsg(`¡Donación exitosa! Has recibido +${potentialTokens} Tokens Dorados.`);
    setTimeout(() => {
      setJustDonatedMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 bg-slate-900 rounded-2xl p-6 border border-amber-500/30 mt-8">
      {justDonatedMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-sm">{justDonatedMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Fundación & Prestigio
          </h2>
          <p className="text-sm text-slate-400 mt-1">Dona tu imperio a la Ayuda Social para ganar Tokens Dorados permanentes.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-amber-500">{prestigeTokens}</div>
          <div className="text-xs font-semibold text-amber-500/70 uppercase tracking-widest">Tokens Disponibles</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UpgradeCard
          icon={<Sparkles className="w-5 h-5" />}
          title="Aura Magnética"
          desc="+50% global a todos los ingresos de dinero para siempre."
          cost={5}
          isOwned={prestigeUpgrades.aura}
          canAfford={prestigeTokens >= 5}
          onBuy={() => buyPrestigeUpgrade('aura', 5)}
        />
        <UpgradeCard
          icon={<Shield className="w-5 h-5" />}
          title="Genética de Acero"
          desc="La Salud, Higiene y Ánimo se degradan un 50% más lento."
          cost={10}
          isOwned={prestigeUpgrades.genetics}
          canAfford={prestigeTokens >= 10}
          onBuy={() => buyPrestigeUpgrade('genetics', 10)}
        />
        <UpgradeCard
          icon={<Building2 className="w-5 h-5" />}
          title="Empresario Nato"
          desc="Todos los negocios cuestan un 25% menos desde el inicio."
          cost={15}
          isOwned={prestigeUpgrades.entrepreneur}
          canAfford={prestigeTokens >= 15}
          onBuy={() => buyPrestigeUpgrade('entrepreneur', 15)}
        />
      </div>

      {/* Prestige Section */}
      <div className="mt-8 p-6 bg-amber-950/20 rounded-xl border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Fundar Ayuda Social (Donar Imperio)
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Patrimonio total calculado: <strong className="text-white">${Math.floor(totalValue).toLocaleString()}</strong> (Efectivo + Inversiones).
            </p>
          </div>
          
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={potentialTokens < 1}
            className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center justify-center gap-2 ${
              potentialTokens >= 1
                ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Crown className="w-4 h-4" />
            Donar Todo (+{potentialTokens} Tokens)
          </button>
        </div>

        {/* Progress towards next token */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Progreso al próximo token: ${Math.floor(progressToNext)} / ${TOKEN_RATE}</span>
            <span>{potentialTokens < 1 ? `Faltan $${Math.floor(remainingForNext)} para el 1er token` : `Faltan $${Math.floor(remainingForNext)} para +${potentialTokens + 1}`}</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-amber-500 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* In-App Confirmation Modal (no window.confirm, 100% iframe-safe) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl border border-amber-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Fundación de Ayuda Social</h3>
                <p className="text-xs text-amber-400 font-medium">Reinicio con Prestigio</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Patrimonio a donar:</span>
                <span className="font-bold text-white">${Math.floor(totalValue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Tokens Dorados a recibir:</span>
                <span className="font-bold text-amber-400 text-base">+{potentialTokens} Tokens</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="flex items-start gap-1.5 text-amber-200/80">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>Tu efectivo y negocios volverán al nivel 0.</span>
                </p>
                <p className="flex items-start gap-1.5 text-emerald-300/80">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>Tus mejoras permanentes y Tokens acumulados se conservan para siempre.</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-2.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPrestige}
                className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/20 transition text-sm cursor-pointer"
              >
                Confirmar Donación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UpgradeCard({ icon, title, desc, cost, isOwned, canAfford, onBuy }: any) {
  return (
    <div className={`p-4 rounded-xl border transition ${isOwned ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/80 border-slate-700'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-amber-400">
          {icon}
          <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
        </div>
        {isOwned && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            Activo
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-4 h-9 leading-relaxed">{desc}</p>
      
      <button
        onClick={onBuy}
        disabled={isOwned || !canAfford}
        className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
          isOwned
            ? 'bg-amber-500/20 text-amber-400 cursor-default border border-amber-500/30'
            : canAfford
            ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 cursor-pointer shadow-sm'
            : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
        }`}
      >
        {isOwned ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mejora Adquirida
          </>
        ) : (
          `${cost} Tokens Dorados`
        )}
      </button>
    </div>
  );
}
