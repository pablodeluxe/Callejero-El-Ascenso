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
  
  // Actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  buyBusiness: (id: string) => void;
  buyPrestigeUpgrade: (upgrade: 'aura' | 'genetics' | 'entrepreneur', cost: number) => void;
  prestigeReset: (tokensGained: number) => void;
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
      })),

      updateStats: (h, hy, m) => set((state) => {
        const genMod = state.prestigeUpgrades.genetics ? 0.5 : 1.0;
        return {
          health: Math.max(0, state.health - h * genMod),
          hygiene: Math.max(0, state.hygiene - hy * genMod),
          mood: Math.max(0, Math.min(100, state.mood - m * genMod))
        };
      }),

      setOfflineReport: (report) => set({ offlineReport: report }),

      triggerEvent: (event) => set({ activeEvent: event }),

      resolveEvent: (optionAction) => {
        if (typeof optionAction !== 'function') {
          set({ activeEvent: null });
          return;
        }
        set((state) => {
          const updates = optionAction(state);
          return { ...updates, activeEvent: null };
        });
      },

      tick: (deltaSeconds) => {
        const state = get();
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

        // Apply mood/health modifiers? (Optional, let's keep it simple or slightly debuff if stats are 0)
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
        if (state.money >= cost) {
          set({
            money: state.money - cost,
            [stat]: Math.min(100, state[stat] + amount)
          });
        }
      },
      
      scavenge: () => {
        const state = get();
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
