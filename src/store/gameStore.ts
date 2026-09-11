import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCAVENGE_EVENTS } from '../data/events';

export interface BusinessConfig {
  id: string;
  name: string;
  baseCost: number;
  multiplier: number;
  baseIncome: number;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  statue: { id: 'statue', name: 'Estatua Humana', baseCost: 50, multiplier: 1.07, baseIncome: 1 },
  musician: { id: 'musician', name: 'Músico Subterráneo', baseCost: 300, multiplier: 1.10, baseIncome: 5 },
  books: { id: 'books', name: 'Puesto de Libros', baseCost: 1500, multiplier: 1.12, baseIncome: 30 },
  kiosks: { id: 'kiosks', name: 'Red de Quioscos', baseCost: 10000, multiplier: 1.15, baseIncome: 150 },
};

export interface AuraTierInfo {
  tier: number;
  name: string;
  cost: number;
  description: string;
  perk: string;
  badgeClass: string;
  glowClass: string;
}

export const POSE_FAILS = [
  { msg: '¡Tropezaste con una baldosa floja frente a todos!', loss: 40 },
  { msg: '¡Intentaste guiñar un ojo pero parpadeaste raro y se rieron!', loss: 30 },
  { msg: '¡Te crujió la espalda al posar y te doblaste de dolor!', loss: 45 },
  { msg: '¡Una paloma te pasó rozando y arruinó tu toma!', loss: 25 },
  { msg: '¡Se te trabó el talón y casi caes de boca en la acera!', loss: 50 },
  { msg: '¡Alguien te grabó en un ángulo fatal para un meme de TikTok!', loss: 60 },
  { msg: '¡Un perro te ladró de repente y diste un brinco del susto!', loss: 35 },
  { msg: '¡Se te cayeron monedas del bolsillo al agacharte con estilo!', loss: 40 }
];

export const AURA_TIERS: AuraTierInfo[] = [
  {
    tier: 0,
    name: 'Novato sin Aura',
    cost: 0,
    description: 'Nadie te presta atención en la calle, eres invisible entre la multitud.',
    perk: 'Sin bonificaciones activas',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    glowClass: ''
  },
  {
    tier: 1,
    name: 'Resplandor Callejero',
    cost: 1000,
    description: 'Caminas erguido y con paso firme. Los vecinos notan que tienes presencia.',
    perk: '+5% a todos los ingresos pasivos',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40'
  },
  {
    tier: 2,
    name: 'Estilo Neón Nocturno',
    cost: 3500,
    description: 'Emanas carisma urbano. Las luces de la ciudad parecen reflejarse solo en ti.',
    perk: '+12% ingresos pasivos y +$1 en recolección',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    glowClass: 'shadow-[0_0_25px_rgba(56,189,248,0.35)] ring-1 ring-sky-500/50'
  },
  {
    tier: 3,
    name: 'Aura de Magnate Callejero',
    cost: 8000,
    description: 'Gafas de sol, postura imponente y respeto absoluto. La gente se aparta a tu paso.',
    perk: '+20% ingresos pasivos y +$2 en recolección',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(168,85,247,0.4)] ring-1 ring-purple-500/60'
  },
  {
    tier: 4,
    name: 'Aura Divina Celestial',
    cost: 20000,
    description: 'Puro pico de aura urbana. Una leyenda viviente de la acera al rascacielos.',
    perk: '+35% ingresos pasivos y Frenesí dura 16s',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    glowClass: 'shadow-[0_0_40px_rgba(244,63,94,0.45)] ring-2 ring-rose-500/70'
  }
];

export interface GameState {
  money: number;
  reputation: number;
  health: number;
  hygiene: number;
  mood: number;
  aura: number;
  auraStreak: number;
  auraFrenzyUntil: number;
  auraCooldownUntil: number;
  auraTier: number;
  businessLevels: Record<string, number>;
  prestigeTokens: number;
  prestigeUpgrades: {
    aura: boolean; // +50% global income
    genetics: boolean; // 50% slower stat decay
    entrepreneur: boolean; // 25% cheaper businesses
  };
  lastSaved: number;
  offlineReport: {
    earnings: number;
    healthDecay: number;
    hygieneDecay: number;
    moodDecay: number;
  } | null;
  activeEvent: any | null; // Will define event type later
  isGameOver: boolean;
  deathReason: 'health' | 'hygiene' | 'mood' | 'reputation' | null;
  
  // Actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  buyBusiness: (id: string) => void;
  buyPrestigeUpgrade: (upgrade: 'aura' | 'genetics' | 'entrepreneur', cost: number) => void;
  prestigeReset: (tokensGained: number) => void;
  resetGame: () => void;
  updateStats: (healthDecay: number, hygieneDecay: number, moodDecay: number) => void;
  setOfflineReport: (report: GameState['offlineReport']) => void;
  triggerEvent: (event: any) => void;
  resolveEvent: (option: any) => void;
  tick: (deltaSeconds: number) => void;
  recoverStat: (stat: 'health' | 'hygiene' | 'mood', amount: number, cost: number) => void;
  scavenge: () => void;
  poseForAura: () => { success: boolean; message: string; isFrenzy: boolean; isFail?: boolean };
  buyAuraTier: (tier: number) => boolean;
  addAura: (amount: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 0,
      reputation: 50,
      health: 100,
      hygiene: 100,
      mood: 100,
      aura: 0,
      auraStreak: 0,
      auraFrenzyUntil: 0,
      auraCooldownUntil: 0,
      auraTier: 0,
      businessLevels: { statue: 0, musician: 0, books: 0, kiosks: 0 },
      prestigeTokens: 0,
      prestigeUpgrades: { aura: false, genetics: false, entrepreneur: false },
      lastSaved: Date.now(),
      offlineReport: null,
      activeEvent: null,
      isGameOver: false,
      deathReason: null,

      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
      
      spendMoney: (amount) => {
        const state = get();
        if (state.money >= amount) {
          set({ money: state.money - amount });
          return true;
        }
        return false;
      },

      buyBusiness: (id) => {
        const state = get();
        if (state.isGameOver) return;
        const config = BUSINESSES[id];
        const currentLevel = state.businessLevels[id] || 0;
        const baseCost = state.prestigeUpgrades.entrepreneur ? config.baseCost * 0.75 : config.baseCost;
        const cost = Math.floor(baseCost * Math.pow(config.multiplier, currentLevel));
        
        if (state.money >= cost) {
          set({
            money: state.money - cost,
            businessLevels: {
              ...state.businessLevels,
              [id]: currentLevel + 1
            }
          });
        }
      },

      buyPrestigeUpgrade: (upgrade, cost) => {
        const state = get();
        if (state.isGameOver) return;
        if (state.prestigeTokens >= cost && !state.prestigeUpgrades[upgrade]) {
          set({
            prestigeTokens: state.prestigeTokens - cost,
            prestigeUpgrades: {
              ...state.prestigeUpgrades,
              [upgrade]: true
            }
          });
        }
      },

      prestigeReset: (tokensGained) => set((state) => ({
        money: 0,
        reputation: 50,
        health: 100,
        hygiene: 100,
        mood: 100,
        businessLevels: { statue: 0, musician: 0, books: 0, kiosks: 0 },
        prestigeTokens: state.prestigeTokens + tokensGained,
        lastSaved: Date.now(),
        offlineReport: null,
        activeEvent: null,
        isGameOver: false,
        deathReason: null,
      })),

      resetGame: () => set({
        money: 0,
        reputation: 50,
        health: 100,
        hygiene: 100,
        mood: 100,
        aura: 0,
        auraStreak: 0,
        auraFrenzyUntil: 0,
        auraCooldownUntil: 0,
        auraTier: 0,
        businessLevels: { statue: 0, musician: 0, books: 0, kiosks: 0 },
        prestigeTokens: 0,
        prestigeUpgrades: { aura: false, genetics: false, entrepreneur: false },
        lastSaved: Date.now(),
        offlineReport: null,
        activeEvent: null,
        isGameOver: false,
        deathReason: null,
      }),

      updateStats: (h, hy, m) => set((state) => {
        if (state.isGameOver) return state;
        const genMod = state.prestigeUpgrades.genetics ? 0.5 : 1.0;
        const newHealth = Math.max(0, state.health - h * genMod);
        const newHygiene = Math.max(0, state.hygiene - hy * genMod);
        const newMood = Math.max(0, Math.min(100, state.mood - m * genMod));

        let reason: 'health' | 'hygiene' | 'mood' | 'reputation' | null = null;
        if (newHealth <= 0) reason = 'health';
        else if (newHygiene <= 0) reason = 'hygiene';
        else if (newMood <= 0) reason = 'mood';
        else if (state.reputation <= 0) reason = 'reputation';

        const isDead = reason !== null;

        return {
          health: newHealth,
          hygiene: newHygiene,
          mood: newMood,
          isGameOver: isDead || state.isGameOver,
          deathReason: isDead ? reason : state.deathReason
        };
      }),

      setOfflineReport: (report) => set({ offlineReport: report }),

      triggerEvent: (event) => set((state) => {
        if (state.isGameOver) return state;
        return { activeEvent: event };
      }),

      resolveEvent: (optionAction) => {
        if (typeof optionAction !== 'function') {
          set({ activeEvent: null });
          return;
        }
        set((state) => {
          const updates = optionAction(state);
          const nextHealth = updates.health !== undefined ? Math.max(0, updates.health) : state.health;
          const nextHygiene = updates.hygiene !== undefined ? Math.max(0, updates.hygiene) : state.hygiene;
          const nextMood = updates.mood !== undefined ? Math.max(0, Math.min(100, updates.mood)) : state.mood;
          const nextRep = updates.reputation !== undefined ? Math.max(0, Math.min(100, updates.reputation)) : state.reputation;

          let reason: 'health' | 'hygiene' | 'mood' | 'reputation' | null = null;
          if (nextHealth <= 0) reason = 'health';
          else if (nextHygiene <= 0) reason = 'hygiene';
          else if (nextMood <= 0) reason = 'mood';
          else if (nextRep <= 0) reason = 'reputation';

          const isDead = reason !== null;

          return {
            ...updates,
            health: nextHealth,
            hygiene: nextHygiene,
            mood: nextMood,
            reputation: nextRep,
            isGameOver: isDead || state.isGameOver,
            deathReason: isDead ? reason : state.deathReason,
            activeEvent: null
          };
        });
      },

      tick: (deltaSeconds) => {
        const state = get();
        if (state.isGameOver) return;

        // Las ganancias pasivas se detienen por completo cuando la salud está en menos de 10%
        if (state.health < 10) {
          set({ lastSaved: Date.now() });
          return;
        }

        let income = 0;
        
        // Calculate income
        Object.entries(state.businessLevels).forEach(([id, level]) => {
          if (level > 0) {
            // baseIncome is defined as per minute, so we divide by 60 to get per second value
            income += (BUSINESSES[id].baseIncome / 60) * level * deltaSeconds;
          }
        });

        // Apply Aura Magnética de prestigio (+50%)
        if (state.prestigeUpgrades.aura) income *= 1.5;

        // Apply Aura Tier Bonus
        const AURA_TIER_MULT = [1.0, 1.05, 1.12, 1.20, 1.35];
        const auraBonus = AURA_TIER_MULT[state.auraTier || 0] || 1.0;
        income *= auraBonus;

        // Apply mood/health modifiers
        let modifier = 1;
        if (state.health < 20) modifier *= 0.5;
        if (state.mood < 20) modifier *= 0.5;
        
        income *= modifier;

        set((state) => ({
          money: state.money + income,
          lastSaved: Date.now()
        }));
      },

      recoverStat: (stat, amount, cost) => {
        const state = get();
        if (state.isGameOver) return;
        if (state.money >= cost) {
          set({
            money: state.money - cost,
            [stat]: Math.min(100, state[stat] + amount)
          });
        }
      },
      
      scavenge: () => {
        const state = get();
        if (state.isGameOver) return;

        const now = Date.now();
        const isFrenzy = now < (state.auraFrenzyUntil || 0);

        let baseGain = 1;
        if (state.auraTier >= 3) baseGain = 3;
        else if (state.auraTier >= 2) baseGain = 2;

        const moneyGain = isFrenzy ? baseGain * 3 : baseGain;

        // 10% chance of random event, unless in frenzy
        if (!isFrenzy && Math.random() < 0.10 && !state.activeEvent) {
          const randomEvent = SCAVENGE_EVENTS[Math.floor(Math.random() * SCAVENGE_EVENTS.length)];
          set({ activeEvent: randomEvent });
        } else {
          set({ money: state.money + moneyGain });
        }
      },

      poseForAura: () => {
        const state = get();
        if (state.isGameOver) return { success: false, message: 'Game Over', isFrenzy: false };

        const now = Date.now();
        // Check cooldown if not currently in frenzy
        if (now < state.auraCooldownUntil && now > state.auraFrenzyUntil) {
          const remSec = Math.ceil((state.auraCooldownUntil - now) / 1000);
          return { success: false, message: `Descansando de la pose (${remSec}s)`, isFrenzy: false };
        }

        // Requires mood to pose
        if (state.mood <= 3) {
          return { success: false, message: 'Demasiado deprimido para posar. Recupera Ánimo.', isFrenzy: false };
        }

        const newMood = Math.max(0, state.mood - 1);

        // 14% chance of mishap / pose fail: loses aura and breaks streak!
        if (Math.random() < 0.14) {
          const fail = POSE_FAILS[Math.floor(Math.random() * POSE_FAILS.length)];
          set({
            aura: (state.aura || 0) - fail.loss,
            mood: newMood,
            auraStreak: 0
          });
          return {
            success: false,
            isFail: true,
            message: `${fail.msg} (-${fail.loss} Aura)`,
            isFrenzy: false
          };
        }

        // Random aura per pose: 8 to 15 (reduced to half)
        const gain = Math.floor(Math.random() * 8) + 8;
        const newStreak = (state.auraStreak || 0) + 1;

        if (newStreak >= 10) {
          const frenzyDuration = state.auraTier >= 4 ? 16000 : 12000;
          const frenzyUntil = now + frenzyDuration;
          const cooldownUntil = frenzyUntil + 45000; // 45s cooldown after frenzy
          set({
            aura: (state.aura || 0) + gain + 250, // +250 bonus for completing the streak (reduced to half)!
            mood: newMood,
            auraStreak: 0,
            auraFrenzyUntil: frenzyUntil,
            auraCooldownUntil: cooldownUntil
          });
          return { success: true, message: '¡AURA MÁXIMA ACTIVADA! x3 Dinero por 12s', isFrenzy: true };
        } else {
          set({
            aura: (state.aura || 0) + gain,
            mood: newMood,
            auraStreak: newStreak
          });
          return { success: true, message: `+${gain} Aura (Racha: ${newStreak}/10)`, isFrenzy: false };
        }
      },

      buyAuraTier: (tier: number) => {
        const state = get();
        const info = AURA_TIERS[tier];
        if (!info) return false;
        if ((state.aura || 0) >= info.cost && (state.auraTier || 0) < tier) {
          set({
            aura: state.aura - info.cost,
            auraTier: tier
          });
          return true;
        }
        return false;
      },

      addAura: (amount: number) => {
        set((state) => ({ aura: (state.aura || 0) + amount }));
      }
    }),
    {
      name: 'urban-survivor-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['activeEvent'].includes(key))
      ),
    }
  )
);
