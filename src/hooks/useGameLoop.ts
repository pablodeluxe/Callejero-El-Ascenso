import { useEffect, useRef } from 'react';
import { useGameStore, GameState } from '../store/gameStore';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: {
    label: string;
    description: string;
    cost?: number;
    action: (state: GameState) => Partial<GameState>;
  }[];
}

const EVENTS: GameEvent[] = [
  {
    id: 'wallet',
    title: 'La Billetera Perdida',
    description: 'Encuentras una billetera gruesa en un banco de la plaza. Hay un documento de identidad dentro.',
    options: [
      {
        label: 'Llevarla a la policía',
        description: '+5 Reputación Urbana, +$20 de recompensa segura.',
        action: (state) => ({
          reputation: Math.min(100, state.reputation + 5),
          money: state.money + 20
        })
      },
      {
        label: 'Quedarte el dinero',
        description: '+$200 inmediatos. 30% probabilidad de perder 10 Reputación.',
        action: (state) => {
          const caught = Math.random() < 0.3;
          return {
            money: state.money + 200,
            reputation: caught ? Math.max(0, state.reputation - 10) : state.reputation
          };
        }
      }
    ]
  },
  {
    id: 'dog',
    title: 'El Perro Herido',
    description: 'Un perro callejero herido se acerca cojeando hacia ti buscando comida.',
    options: [
      {
        label: 'Gastar $50 en el veterinario',
        description: 'Pierdes $50, pero ganas +20 Ánimo.',
        cost: 50,
        action: (state) => ({
          money: Math.max(0, state.money - 50),
          mood: Math.min(100, state.mood + 20)
        })
      },
      {
        label: 'Ignorarlo',
        description: 'Sin costo. -20 Ánimo inmediatos.',
        action: (state) => ({
          mood: Math.max(0, state.mood - 20)
        })
      }
    ]
  },
  {
    id: 'inspection',
    title: 'Inspección Municipal',
    description: 'Un inspector de la ciudad te exige un permiso para tocar música en esta calle.',
    options: [
      {
        label: 'Pagar el soborno ($100)',
        description: 'Pierdes $100, pero evitas problemas.',
        cost: 100,
        action: (state) => ({
          money: Math.max(0, state.money - 100)
        })
      },
      {
        label: 'Discutir y negarte',
        description: '50% de ganar la discusión (+10 Reputación), 50% de pagar multa de $300 y perder 10 Ánimo.',
        action: (state) => {
          const lose = Math.random() < 0.5;
          if (lose) {
            return {
              money: Math.max(0, state.money - 300),
              mood: Math.max(0, state.mood - 10),
              reputation: Math.max(0, state.reputation - 5)
            };
          }
          return {
            reputation: Math.min(100, state.reputation + 10),
            mood: Math.min(100, state.mood + 10)
          }; // Won discussion
        }
      }
    ]
  },
  {
    id: 'street_brawl',
    title: '¡Desafío Callejero por Territorio!',
    description: 'Un matón callejero te acorrala frente a una multitud exigiendo que le pagues un peaje por estar en esta acera.',
    options: [
      {
        label: 'Defender tu honor y pelear a golpes',
        description: 'Te bates a puño limpio. Pierdes 12 Salud, pero demuestras valentía ante la gente: +12 Reputación y +15 Ánimo.',
        action: (state) => ({
          health: Math.max(0, state.health - 12),
          reputation: Math.min(100, state.reputation + 12),
          mood: Math.min(100, state.mood + 15),
          money: state.money + 15
        })
      },
      {
        label: 'Desactivar la situación con carisma callejero',
        description: 'Usas tu astucia y elocuencia para calmar los ánimos sin pelear: +6 Reputación Urbana.',
        action: (state) => ({
          reputation: Math.min(100, state.reputation + 6),
          mood: Math.min(100, state.mood + 5)
        })
      },
      {
        label: 'Pagarle $25 para que te deje en paz',
        description: 'Evitas el peligro pero te sientes avergonzado (-$25, -5 Reputación, -10 Ánimo).',
        cost: 25,
        action: (state) => ({
          money: Math.max(0, state.money - 25),
          reputation: Math.max(0, state.reputation - 5),
          mood: Math.max(0, state.mood - 10)
        })
      }
    ]
  },
  {
    id: 'coffee_cup_aura',
    title: '¡La Taza de Café en el Aire!',
    description: 'Un ejecutivo apresurado con traje de marca tropieza a tu lado. Su capuchino hirviendo sale disparado volando por los aires sobre la multitud.',
    options: [
      {
        label: 'Atraparlo en el aire con una sola mano sin mirar (60% éxito)',
        description: 'Todo o nada por el clip épico. Éxito: +2,500 Aura, +10 Reputación y $50 de propina. Fallo: -3,000 Aura, quemadura (-10 Salud), te empapas de café (-25 Higiene).',
        action: (state) => {
          const success = Math.random() < 0.60;
          if (success) {
            return {
              aura: (state.aura || 0) + 2500,
              reputation: Math.min(100, state.reputation + 10),
              mood: Math.min(100, state.mood + 15),
              money: state.money + 50
            };
          } else {
            return {
              aura: (state.aura || 0) - 3000,
              health: Math.max(0, state.health - 10),
              hygiene: Math.max(0, state.hygiene - 25),
              mood: Math.max(0, state.mood - 15)
            };
          }
        }
      },
      {
        label: 'Esquivarlo con compostura indiferente (+200 Aura seguro)',
        description: 'Das un paso milimétrico con calma gélida mientras el café se estrella en el suelo. Conservas tu dignidad intacta.',
        action: (state) => ({
          aura: (state.aura || 0) + 200,
          mood: Math.min(100, state.mood + 5)
        })
      }
    ]
  },
  {
    id: 'stare_down_aura',
    title: 'El Duelo de Miradas Callejero',
    description: 'Un tipo intimidante con chaqueta de cuero y gafas oscuras se para frente a ti en la acera y te clava una mirada desafiante.',
    options: [
      {
        label: 'Sostenerle la mirada con presencia implacable (55% de ganar)',
        description: 'Duelo de pura aura. Si aguantas: +500 Aura, +8 Reputación y el tipo baja la vista con respeto. Si pestañeas: -500 Aura y -5 Reputación.',
        action: (state) => {
          const win = Math.random() < 0.55;
          if (win) {
            return {
              aura: (state.aura || 0) + 500,
              reputation: Math.min(100, state.reputation + 8),
              mood: Math.min(100, state.mood + 10)
            };
          } else {
            return {
              aura: (state.aura || 0) - 500,
              reputation: Math.max(0, state.reputation - 5),
              mood: Math.max(0, state.mood - 8)
            };
          }
        }
      },
      {
        label: 'Saludar con un guiño de confianza (+100 Aura)',
        description: 'Rompes la tensión con carisma callejero sin entrar en el juego del conflicto.',
        action: (state) => ({
          aura: (state.aura || 0) + 100,
          mood: Math.min(100, state.mood + 5)
        })
      }
    ]
  },
  {
    id: 'pose_extreme_fail',
    title: '¡Pose Extrema en la Baranda!',
    description: 'Para ganar aura callejera y conseguir un video viral, intentas hacer equilibrio con un solo pie sobre la baranda de la escalera del metro.',
    options: [
      {
        label: 'Aterrizar con voltereta de superhéroe (40% de éxito)',
        description: 'Arriesgas tu dignidad y tu cuerpo. Éxito: +400 Aura y +10 Reputación. Fallo: -600 Aura, te caes estrepitosamente rodando por la escalera (-15 Salud, -20 Higiene) y la multitud se ríe.',
        action: (state) => {
          const success = Math.random() < 0.40;
          if (success) {
            return {
              aura: (state.aura || 0) + 400,
              reputation: Math.min(100, state.reputation + 10),
              mood: Math.min(100, state.mood + 10)
            };
          } else {
            return {
              aura: (state.aura || 0) - 600,
              health: Math.max(0, state.health - 15),
              hygiene: Math.max(0, state.hygiene - 20),
              mood: Math.max(0, state.mood - 10)
            };
          }
        }
      },
      {
        label: 'Bajarte con calma disimulando (+30 Aura seguro)',
        description: 'Decides que tu seguridad y dignidad valen más. Bajas con paso firme sin llamar la atención.',
        action: (state) => ({
          aura: (state.aura || 0) + 30,
          mood: Math.min(100, state.mood + 2)
        })
      }
    ]
  }
];

export function useGameLoop() {
  const lastTickRef = useRef<number>(Date.now());
  const initializedRef = useRef(false);

  useEffect(() => {
    // 1. One-time offline progress calculation on mount
    if (!initializedRef.current) {
      initializedRef.current = true;
      const state = useGameStore.getState();
      const now = Date.now();
      const elapsedSeconds = (now - state.lastSaved) / 1000;
      
      if (elapsedSeconds > 60) {
        const effectiveSeconds = Math.min(elapsedSeconds, 86400);
        const moneyBefore = state.money;
        
        state.tick(effectiveSeconds);
        
        // Offline decay balanced for a 12-16 hour survival window:
        // Full bars (100%) now comfortably sustain 14-16 hours of offline sleep.
        const hDecay = (effectiveSeconds / 60) * 0.05;
        const hyDecay = (effectiveSeconds / 60) * 0.10; 
        const mDecay = (effectiveSeconds / 60) * 0.07;
        
        // Safety floor active up to 14 hours; beyond 14h of inactivity, stats drop to 0 and death occurs.
        state.applyOfflineStats(hDecay, hyDecay, mDecay, elapsedSeconds);
        
        const moneyAfter = useGameStore.getState().money;
        const earnings = moneyAfter - moneyBefore;
        
        if (earnings > 0 || hDecay > 1) {
          state.setOfflineReport({
            earnings,
            healthDecay: hDecay,
            hygieneDecay: hyDecay,
            moodDecay: mDecay
          });
        }
      }
    }

    // 2. Continuous game loop running every 1000ms, using store state directly
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.max(0.1, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      
      const state = useGameStore.getState();
      if (state.isGameOver) return;
      
      state.tick(deltaSeconds);
      
      // Decay stats gently during active session (~2 to 3 hours between needs)
      state.updateStats(0.006 * deltaSeconds, 0.012 * deltaSeconds, 0.009 * deltaSeconds);

      // Random events
      if (!state.activeEvent && Math.random() < 0.005 * deltaSeconds) {
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        state.triggerEvent(randomEvent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
