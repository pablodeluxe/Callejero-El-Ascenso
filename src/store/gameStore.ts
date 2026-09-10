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

export interface GameState {
  money: number;
  reputation: number;
  health: number;
  hygiene: number;
  mood: number;
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
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 0,
      reputation: 50,
      health: 100,
      hygiene: 100,
      mood: 100,
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

        // Apply Aura Magnética
        if (state.prestigeUpgrades.aura) income *= 1.5;

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
        // 10% chance to trigger a random scavenge event
        if (Math.random() < 0.10 && !state.activeEvent) {
          const randomEvent = SCAVENGE_EVENTS[Math.floor(Math.random() * SCAVENGE_EVENTS.length)];
          set({ activeEvent: randomEvent });
        } else {
          set({ money: state.money + 1 });
        }
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
