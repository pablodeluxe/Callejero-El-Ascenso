import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCAVENGE_EVENTS } from '../data/events';
import { ALL_TIMED_ACTIONS, TimedAction, TimedActionTier } from '../data/timedActions';

export interface ActiveTimedTask {
  id: string;
  actionId: string;
  category: 'primary' | 'secondary';
  tierIndex: number;
  startTime: number;
  durationSeconds: number;
  costPaid?: number;
}

export interface BusinessConfig {
  id: string;
  name: string;
  baseCost: number;
  multiplier: number;
  baseIncome: number;
  suppliesName: string;
}

export const BUSINESSES: Record<string, BusinessConfig> = {
  statue: { id: 'statue', name: 'Estatua Humana', baseCost: 50, multiplier: 1.09, baseIncome: 1, suppliesName: 'Maquillaje y Disfraz' },
  musician: { id: 'musician', name: 'Músico Subterráneo', baseCost: 300, multiplier: 1.13, baseIncome: 5, suppliesName: 'Cuerdas e Instrumentos' },
  books: { id: 'books', name: 'Puesto de Libros', baseCost: 1500, multiplier: 1.16, baseIncome: 30, suppliesName: 'Inventario y Fletes' },
  kiosks: { id: 'kiosks', name: 'Red de Quioscos', baseCost: 10000, multiplier: 1.20, baseIncome: 150, suppliesName: 'Mercadería y Reposición' },
};

export const BUSINESS_LICENSE_TIERS = [25, 50, 75, 100];
export const BUSINESS_LICENSE_COSTS: Record<string, number[]> = {
  statue: [800, 6000, 45000, 300000],
  musician: [4500, 35000, 250000, 1800000],
  books: [22000, 180000, 1200000, 8000000],
  kiosks: [150000, 1100000, 7500000, 50000000],
};

export function getBusinessUpgradeCost(
  id: string,
  currentLevel: number,
  hasEntrepreneur: boolean
): number {
  const config = BUSINESSES[id];
  if (!config) return 0;
  const baseCost = hasEntrepreneur ? config.baseCost * 0.75 : config.baseCost;
  // Soft cap: past level 25, exponential cost increases
  const softCapMultiplier = currentLevel > 25 ? Math.pow(1.02, currentLevel - 25) : 1;
  return Math.floor(baseCost * Math.pow(config.multiplier, currentLevel) * softCapMultiplier);
}

export function getBusinessRestockCost(id: string, level: number): number {
  if (level <= 0) return 0;
  const base = id === 'statue' ? 10 : id === 'musician' ? 30 : id === 'books' ? 100 : 400;
  return Math.max(10, Math.floor(base + level * (base * 0.15)));
}

export function getLifestyleInflation(
  businessLevels: Record<string, number>,
  businessSupplies: Record<string, number>,
  hasPrestigeAura: boolean,
  auraTier: number
): number {
  let incomePerMin = 0;
  Object.entries(businessLevels || {}).forEach(([id, level]) => {
    const config = BUSINESSES[id];
    if (config && level > 0) {
      const sup = businessSupplies?.[id] ?? 100;
      const supMod = sup <= 0 ? 0.3 : 1.0;
      incomePerMin += config.baseIncome * level * supMod;
    }
  });
  if (hasPrestigeAura) incomePerMin *= 1.5;
  const AURA_TIER_MULT = [1.0, 1.05, 1.12, 1.20, 1.35];
  incomePerMin *= (AURA_TIER_MULT[auraTier] || 1.0);

  return Math.floor(incomePerMin * 0.015);
}

export function getRecoveryCosts(
  businessLevels: Record<string, number>,
  businessSupplies: Record<string, number>,
  hasPrestigeAura: boolean,
  auraTier: number
) {
  const inflation = getLifestyleInflation(businessLevels, businessSupplies, hasPrestigeAura, auraTier);
  return {
    inflation,
    health: 20 + inflation,
    hygiene: 15 + Math.floor(inflation * 0.75),
    mood: 30 + Math.floor(inflation * 1.25)
  };
}

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
  poseClickCount: number;
  businessLevels: Record<string, number>;
  businessSupplies: Record<string, number>;
  businessLicenses: Record<string, number>;
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
  activeTimedTasks: Record<string, ActiveTimedTask>;
  
  // Actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  buyBusiness: (id: string) => void;
  buyBusinessLicense: (id: string) => boolean;
  restockBusiness: (id: string) => boolean;
  restockAllBusinesses: () => { success: boolean; totalCost: number; count: number };
  buyPrestigeUpgrade: (upgrade: 'aura' | 'genetics' | 'entrepreneur', cost: number) => void;
  prestigeReset: (tokensGained: number) => void;
  resetGame: () => void;
  reviveCharacter: () => void;
  updateStats: (healthDecay: number, hygieneDecay: number, moodDecay: number) => void;
  applyOfflineStats: (healthDecay: number, hygieneDecay: number, moodDecay: number, elapsedSeconds: number) => void;
  setOfflineReport: (report: GameState['offlineReport']) => void;
  triggerEvent: (event: any) => void;
  resolveEvent: (option: any) => void;
  tick: (deltaSeconds: number) => void;
  recoverStat: (stat: 'health' | 'hygiene' | 'mood', amount: number, cost?: number) => void;
  scavenge: () => void;
  poseForAura: () => { success: boolean; message: string; isFrenzy: boolean; isFail?: boolean };
  buyAuraTier: (tier: number) => boolean;
  addAura: (amount: number) => void;
  startTimedTask: (actionId: string, tierIndex: number) => { success: boolean; message: string };
  cancelTimedTask: (taskId: string) => void;
  claimTimedTask: (taskId: string) => { success: boolean; message: string; details?: any };
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
      poseClickCount: 0,
      businessLevels: { statue: 0, musician: 0, books: 0, kiosks: 0 },
      businessSupplies: { statue: 100, musician: 100, books: 100, kiosks: 100 },
      businessLicenses: { statue: 0, musician: 0, books: 0, kiosks: 0 },
      prestigeTokens: 0,
      prestigeUpgrades: { aura: false, genetics: false, entrepreneur: false },
      lastSaved: Date.now(),
      offlineReport: null,
      activeEvent: null,
      isGameOver: false,
      deathReason: null,
      activeTimedTasks: {},

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
        if (!config) return;
        
        const currentLevel = state.businessLevels[id] || 0;
        const licenseTier = state.businessLicenses?.[id] || 0;
        const maxLevelAllowed = (licenseTier + 1) * 25;

        // Check license cap
        if (currentLevel >= maxLevelAllowed) {
          return;
        }

        const cost = getBusinessUpgradeCost(id, currentLevel, state.prestigeUpgrades.entrepreneur);
        
        if (state.money >= cost) {
          set({
            money: state.money - cost,
            businessLevels: {
              ...state.businessLevels,
              [id]: currentLevel + 1
            },
            businessSupplies: {
              ...state.businessSupplies,
              [id]: state.businessSupplies?.[id] !== undefined ? state.businessSupplies[id] : 100
            }
          });
        }
      },

      buyBusinessLicense: (id) => {
        const state = get();
        if (state.isGameOver) return false;
        const currentTier = state.businessLicenses?.[id] || 0;
        const tierCosts = BUSINESS_LICENSE_COSTS[id] || [];
        const cost = tierCosts[currentTier];

        if (cost === undefined) return false;

        if (state.money >= cost) {
          set({
            money: state.money - cost,
            businessLicenses: {
              ...(state.businessLicenses || {}),
              [id]: currentTier + 1
            }
          });
          return true;
        }
        return false;
      },

      restockBusiness: (id) => {
        const state = get();
        if (state.isGameOver) return false;
        const level = state.businessLevels[id] || 0;
        if (level <= 0) return false;

        const cost = getBusinessRestockCost(id, level);
        if (state.money >= cost) {
          set({
            money: state.money - cost,
            businessSupplies: {
              ...(state.businessSupplies || {}),
              [id]: 100
            }
          });
          return true;
        }
        return false;
      },

      restockAllBusinesses: () => {
        const state = get();
        if (state.isGameOver) return { success: false, totalCost: 0, count: 0 };

        let totalCost = 0;
        let count = 0;
        const newSupplies = { ...(state.businessSupplies || {}) };

        Object.entries(state.businessLevels).forEach(([id, level]) => {
          if (level > 0 && (newSupplies[id] ?? 100) < 100) {
            totalCost += getBusinessRestockCost(id, level);
            newSupplies[id] = 100;
            count++;
          }
        });

        if (count === 0) return { success: true, totalCost: 0, count: 0 };

        if (state.money >= totalCost) {
          set({
            money: state.money - totalCost,
            businessSupplies: newSupplies
          });
          return { success: true, totalCost, count };
        }
        return { success: false, totalCost, count };
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
        businessSupplies: { statue: 100, musician: 100, books: 100, kiosks: 100 },
        businessLicenses: { statue: 0, musician: 0, books: 0, kiosks: 0 },
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
        poseClickCount: 0,
        businessLevels: { statue: 0, musician: 0, books: 0, kiosks: 0 },
        businessSupplies: { statue: 100, musician: 100, books: 100, kiosks: 100 },
        businessLicenses: { statue: 0, musician: 0, books: 0, kiosks: 0 },
        prestigeTokens: 0,
        prestigeUpgrades: { aura: false, genetics: false, entrepreneur: false },
        lastSaved: Date.now(),
        offlineReport: null,
        activeEvent: null,
        isGameOver: false,
        deathReason: null,
        activeTimedTasks: {},
      }),

      updateStats: (h, hy, m) => set((state) => {
        if (state.isGameOver) return state;

        // Check active ritual buffs
        const now = Date.now();
        const activeTasks = Object.values(state.activeTimedTasks || {});
        
        let preventHealth = false;
        let preventMood = false;

        for (const task of activeTasks) {
          if (now < task.startTime + task.durationSeconds * 1000) {
            const action = ALL_TIMED_ACTIONS.find((a) => a.id === task.actionId);
            const tier = action?.tiers[task.tierIndex];
            if (tier?.buffs?.preventHealthDecay) preventHealth = true;
            if (tier?.buffs?.preventMoodDecay) preventMood = true;
          }
        }

        const effectiveH = preventHealth ? 0 : h;
        const effectiveM = preventMood ? 0 : m;

        const genMod = state.prestigeUpgrades.genetics ? 0.5 : 1.0;
        const newHealth = Math.max(0, state.health - effectiveH * genMod);
        const newHygiene = Math.max(0, state.hygiene - hy * genMod);
        const newMood = Math.max(0, Math.min(100, state.mood - effectiveM * genMod));

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
          deathReason: isDead ? reason : state.deathReason,
          activeTimedTasks: isDead ? {} : state.activeTimedTasks
        };
      }),

      applyOfflineStats: (hDecay, hyDecay, mDecay, elapsedSeconds) => set((state) => {
        if (state.isGameOver) return state;
        const genMod = state.prestigeUpgrades.genetics ? 0.5 : 1.0;
        const isWithin14Hours = elapsedSeconds <= 14 * 3600;

        if (isWithin14Hours) {
          // Ventana de protección de sueño (<= 14h): suelo mínimo al 5%, nunca muere mientras duerme
          const newHealth = Math.max(5, state.health - hDecay * genMod);
          const newHygiene = Math.max(5, state.hygiene - hyDecay * genMod);
          const newMood = Math.max(5, state.mood - mDecay * genMod);

          return {
            health: newHealth,
            hygiene: newHygiene,
            mood: newMood,
            isGameOver: false,
            deathReason: null
          };
        } else {
          // Inactividad superior a 14h: sin suelo de seguridad, los valores caen a 0 y causan muerte cómica
          const newHealth = Math.max(0, state.health - hDecay * genMod);
          const newHygiene = Math.max(0, state.hygiene - hyDecay * genMod);
          const newMood = Math.max(0, state.mood - mDecay * genMod);

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
            deathReason: isDead ? reason : state.deathReason,
            activeTimedTasks: isDead ? {} : state.activeTimedTasks
          };
        }
      }),

      reviveCharacter: () => set((state) => ({
        money: 0,
        health: 25,
        hygiene: 25,
        mood: 25,
        reputation: Math.max(25, state.reputation),
        isGameOver: false,
        deathReason: null,
        activeEvent: null,
        auraStreak: 0,
        activeTimedTasks: {}
      })),

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
            activeTimedTasks: isDead ? {} : state.activeTimedTasks,
            activeEvent: null
          };
        });
      },

      tick: (deltaSeconds) => {
        const state = get();
        if (state.isGameOver) return;

        // Supplies decay and calculation
        const newSupplies: Record<string, number> = { ...(state.businessSupplies || {}) };
        const decayPerSec = 0.055; // 100% lasts ~30 mins of active play

        let income = 0;
        
        // Calculate income per business with supplies modifier
        Object.entries(state.businessLevels).forEach(([id, level]) => {
          if (level > 0) {
            const currentSup = newSupplies[id] !== undefined ? newSupplies[id] : 100;
            const updatedSup = Math.max(0, currentSup - decayPerSec * deltaSeconds);
            newSupplies[id] = updatedSup;

            // When supplies reach 0, business suffers a 70% penalty (runs at 30%)
            const suppliesMod = updatedSup <= 0 ? 0.3 : 1.0;
            const config = BUSINESSES[id];
            if (config) {
              income += (config.baseIncome / 60) * level * suppliesMod * deltaSeconds;
            }
          }
        });

        // Las ganancias pasivas se detienen por completo cuando la salud está en menos de 10%
        if (state.health < 10) {
          set({
            businessSupplies: newSupplies,
            lastSaved: Date.now()
          });
          return;
        }

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
          businessSupplies: newSupplies,
          lastSaved: Date.now()
        }));
      },

      recoverStat: (stat, amount, manualCost) => {
        const state = get();
        if (state.isGameOver) return;

        const costs = getRecoveryCosts(
          state.businessLevels,
          state.businessSupplies,
          state.prestigeUpgrades.aura,
          state.auraTier
        );
        const actualCost = manualCost !== undefined ? manualCost : costs[stat];

        if (state.money >= actualCost) {
          set({
            money: state.money - actualCost,
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
        const newPoseClickCount = (state.poseClickCount || 0) + 1;
        const addsRep = newPoseClickCount % 3 === 0;
        const newReputation = addsRep ? Math.min(100, state.reputation + 1) : state.reputation;

        // 4% chance of mishap / pose fail: loses aura and breaks streak!
        if (Math.random() < 0.04) {
          const fail = POSE_FAILS[Math.floor(Math.random() * POSE_FAILS.length)];
          set({
            aura: (state.aura || 0) - fail.loss,
            mood: newMood,
            auraStreak: 0,
            reputation: newReputation,
            poseClickCount: newPoseClickCount
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
            auraCooldownUntil: cooldownUntil,
            reputation: newReputation,
            poseClickCount: newPoseClickCount
          });
          return {
            success: true,
            message: addsRep
              ? '¡AURA MÁXIMA ACTIVADA! +1 Reputación y x3 Dinero por 12s'
              : '¡AURA MÁXIMA ACTIVADA! x3 Dinero por 12s',
            isFrenzy: true
          };
        } else {
          set({
            aura: (state.aura || 0) + gain,
            mood: newMood,
            auraStreak: newStreak,
            reputation: newReputation,
            poseClickCount: newPoseClickCount
          });
          return {
            success: true,
            message: addsRep
              ? `+${gain} Aura y +1 Reputación (Racha: ${newStreak}/10)`
              : `+${gain} Aura (Racha: ${newStreak}/10)`,
            isFrenzy: false
          };
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
      },

      startTimedTask: (actionId: string, tierIndex: number) => {
        const state = get();
        if (state.isGameOver) return { success: false, message: 'El personaje ha colapsado.' };

        const action = ALL_TIMED_ACTIONS.find((a) => a.id === actionId);
        if (!action) return { success: false, message: 'Acción no encontrada.' };

        const tier = action.tiers[tierIndex];
        if (!tier) return { success: false, message: 'Nivel de duración no válido.' };

        // Check cost
        if (tier.cost && state.money < tier.cost) {
          return { success: false, message: `No tienes suficiente dinero ($${tier.cost}) para comenzar esta actividad.` };
        }

        const currentTasks = Object.values(state.activeTimedTasks || {});

        // Check if already running this exact action
        if (currentTasks.some((t) => t.actionId === actionId)) {
          return { success: false, message: 'Esta acción ya se encuentra en curso.' };
        }

        // Check parallel rules:
        if (action.category === 'primary') {
          const hasPrimary = currentTasks.some((t) => t.category === 'primary');
          if (hasPrimary) {
            return {
              success: false,
              message: 'Ya estás realizando una changa principal. Termínala o cancélala antes de empezar otra.'
            };
          }
        } else {
          const secondaryCount = currentTasks.filter((t) => t.category === 'secondary').length;
          if (secondaryCount >= 2) {
            return {
              success: false,
              message: 'Solo puedes tener un máximo de 2 rituales o acompañamientos activos en paralelo.'
            };
          }
        }

        const taskId = `${actionId}_${Date.now()}`;
        const newTask: ActiveTimedTask = {
          id: taskId,
          actionId,
          category: action.category,
          tierIndex,
          startTime: Date.now(),
          durationSeconds: tier.durationSeconds,
          costPaid: tier.cost || 0
        };

        set((s) => ({
          money: tier.cost ? Math.max(0, s.money - tier.cost) : s.money,
          activeTimedTasks: {
            ...(s.activeTimedTasks || {}),
            [taskId]: newTask
          }
        }));

        return {
          success: true,
          message: `¡Comenzaste "${action.name}" (${tier.label})!`
        };
      },

      cancelTimedTask: (taskId: string) => {
        set((state) => {
          const updated = { ...(state.activeTimedTasks || {}) };
          delete updated[taskId];
          return { activeTimedTasks: updated };
        });
      },

      claimTimedTask: (taskId: string) => {
        const state = get();
        const task = (state.activeTimedTasks || {})[taskId];
        if (!task) return { success: false, message: 'La tarea no existe o ya fue reclamada.' };

        const now = Date.now();
        const elapsed = (now - task.startTime) / 1000;
        if (elapsed < task.durationSeconds) {
          const remaining = Math.ceil(task.durationSeconds - elapsed);
          const mins = Math.floor(remaining / 60);
          const secs = remaining % 60;
          const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
          return { success: false, message: `Aún no ha finalizado. Faltan ${timeStr}.` };
        }

        const action = ALL_TIMED_ACTIONS.find((a) => a.id === task.actionId);
        if (!action) return { success: false, message: 'Acción no encontrada.' };

        const tier = action.tiers[task.tierIndex];
        if (!tier) return { success: false, message: 'Nivel no encontrado.' };

        // Active ritual bonuses (other active tasks with multipliers)
        const otherActiveTasks = Object.values(state.activeTimedTasks || {}).filter(
          (t) => t.category === 'secondary' && t.id !== taskId
        );

        let moneyMultiplier = 1.0;
        let auraMultiplier = 1.0;

        for (const st of otherActiveTasks) {
          const sAction = ALL_TIMED_ACTIONS.find((a) => a.id === st.actionId);
          const sTier = sAction?.tiers[st.tierIndex];
          if (sTier?.buffs?.moneyMultiplier) {
            moneyMultiplier *= sTier.buffs.moneyMultiplier;
          }
          if (sTier?.buffs?.auraMultiplier) {
            auraMultiplier *= sTier.buffs.auraMultiplier;
          }
        }

        const r = tier.rewards;
        let wonGamble = true;
        if (r.successRate !== undefined) {
          wonGamble = Math.random() < r.successRate;
        }

        let gainedMoney = 0;
        if (wonGamble && r.moneyMin !== undefined) {
          const max = r.moneyMax ?? r.moneyMin;
          const base = Math.floor(r.moneyMin + Math.random() * (max - r.moneyMin + 1));
          gainedMoney = Math.round(base * moneyMultiplier);
        }

        const gainedAura = r.aura ? Math.round(r.aura * auraMultiplier) : 0;
        const healthDelta = wonGamble ? (r.health || 0) : -10;
        const hygieneDelta = wonGamble ? (r.hygiene || 0) : -5;
        const moodDelta = wonGamble ? (r.mood || 0) : -15;
        const repDelta = wonGamble ? (r.reputation || 0) : -5;

        // Apply stat bounds:
        const newHealth = Math.max(1, Math.min(100, state.health + healthDelta));
        const newHygiene = Math.max(1, Math.min(100, state.hygiene + hygieneDelta));
        const newMood = Math.max(1, Math.min(100, state.mood + moodDelta));
        const newReputation = Math.max(1, Math.min(100, state.reputation + repDelta));

        const updatedTasks = { ...(state.activeTimedTasks || {}) };
        delete updatedTasks[taskId];

        set((s) => ({
          money: s.money + gainedMoney,
          health: newHealth,
          hygiene: newHygiene,
          mood: newMood,
          reputation: newReputation,
          aura: (s.aura || 0) + gainedAura,
          activeTimedTasks: updatedTasks
        }));

        let message = wonGamble
          ? `¡Completaste con éxito "${action.name}"!`
          : `¡Mala suerte en "${action.name}"! Perdiste la apuesta y saliste con el ánimo bajo.`;

        return {
          success: true,
          message,
          details: {
            actionName: action.name,
            wonGamble,
            gainedMoney,
            gainedAura,
            healthDelta,
            hygieneDelta,
            moodDelta,
            repDelta
          }
        };
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
