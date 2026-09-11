import { GameState } from '../store/gameStore';

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

export const SCAVENGE_EVENTS: GameEvent[] = [
  {
    id: 'scavenge_fight',
    title: '¡Pelea por una moneda!',
    description: 'Viste una moneda brillante, pero un sujeto rudo la vio al mismo tiempo y te empuja exigiendo que te apartes.',
    options: [
      {
        label: 'Pelear por defender tu moneda y honor',
        description: 'Te bates a puñetazos. Sufres golpes (-10 Salud), pero si ganas obtienes +8 Reputación y la moneda (+$10). Si pierdes, te roban $5, recibes daño y pierdes reputación (-5).',
        action: (state) => {
          const won = Math.random() < 0.65;
          if (won) {
            return {
              money: state.money + 10,
              health: Math.max(0, state.health - 10),
              reputation: Math.min(100, state.reputation + 8),
              mood: Math.min(100, state.mood + 10)
            };
          } else {
            return {
              money: Math.max(0, state.money - 5),
              health: Math.max(0, state.health - 15),
              reputation: Math.max(0, state.reputation - 5),
              mood: Math.max(0, state.mood - 10)
            };
          }
        }
      },
      {
        label: 'Ceder pacíficamente y retirarte',
        description: 'Evitas el combate. No recibes daño, pero pierdes un poco de reputación (-3) y 5 Ánimo por la humillación.',
        action: (state) => ({
          reputation: Math.max(0, state.reputation - 3),
          mood: Math.max(0, state.mood - 5)
        })
      }
    ]
  },
  {
    id: 'scavenge_defend',
    title: '¡Defensa Ciudadana en la Calle!',
    description: 'Ves a un matón intimidando a un vendedor de frutas para robarle la recaudación del día. Nadie más se atreve a intervenir.',
    options: [
      {
        label: 'Intervenir físicamente y defenderlo',
        description: 'Peleas con valentía. Pierdes 12 Salud por los golpes, pero ganas +15 Reputación, +15 Ánimo y el vendedor te regala $30.',
        action: (state) => ({
          health: Math.max(0, state.health - 12),
          reputation: Math.min(100, state.reputation + 15),
          mood: Math.min(100, state.mood + 15),
          money: state.money + 30
        })
      },
      {
        label: 'Gritar pidiendo a la policía',
        description: 'Haces sonar la alarma y el matón huye asustado. Ganas +6 Reputación sin sufrir daño.',
        action: (state) => ({
          reputation: Math.min(100, state.reputation + 6),
          mood: Math.min(100, state.mood + 5)
        })
      },
      {
        label: 'Mirar hacia otro lado',
        description: 'Sin daño físico, pero el remordimiento te persigue (-10 Ánimo, -4 Reputación).',
        action: (state) => ({
          mood: Math.max(0, state.mood - 10),
          reputation: Math.max(0, state.reputation - 4)
        })
      }
    ]
  },
  {
    id: 'scavenge_gambler',
    title: 'El Duelo de Suerte de los Dados',
    description: 'Un hábil apostador callejero reta a los transeúntes a un tiro de dados frente a los curiosos de la plaza.',
    options: [
      {
        label: 'Apostar $15 al tiro mayor',
        description: '50% probabilidad de ganar $35 y +8 Reputación por tu astucia callejera. Si pierdes, pierdes los $15.',
        cost: 15,
        action: (state) => {
          if (state.money < 15) {
            return { mood: Math.max(0, state.mood - 5) };
          }
          const win = Math.random() < 0.55;
          if (win) {
            return {
              money: state.money + 35,
              reputation: Math.min(100, state.reputation + 8),
              mood: Math.min(100, state.mood + 10)
            };
          } else {
            return {
              money: state.money - 15,
              mood: Math.max(0, state.mood - 8)
            };
          }
        }
      },
      {
        label: 'Solo observar y aplaudir',
        description: 'No apuestas dinero. Ganas +5 Ánimo por el entretenimiento.',
        action: (state) => ({
          mood: Math.min(100, state.mood + 5)
        })
      }
    ]
  },
  {
    id: 'scavenge_lucky',
    title: '¡Día de Suerte!',
    description: 'Mientras buscabas monedas, encontraste un billete de $20 arrugado escondido entre unas hojas secas.',
    options: [
      {
        label: '¡Genial!',
        description: 'Ganas $20.',
        action: (state) => ({
          money: state.money + 20
        })
      }
    ]
  },
  {
    id: 'scavenge_puddle',
    title: 'Paso en Falso',
    description: 'Te distrajiste buscando en el suelo y pisaste de lleno un charco de agua sucia del alcantarillado.',
    options: [
      {
        label: '¡Qué asco!',
        description: 'Pierdes 10 Higiene.',
        action: (state) => ({
          hygiene: Math.max(0, state.hygiene - 10)
        })
      }
    ]
  },
  {
    id: 'scavenge_dog',
    title: 'Compañía Inesperada',
    description: 'Un perro amigable se acercó a saludarte mientras buscabas en la acera. Juegas con él un momento y te sientes mucho mejor.',
    options: [
      {
        label: 'Acariciar al perro',
        description: 'Ganas 15 Ánimo.',
        action: (state) => ({
          mood: Math.min(100, state.mood + 15)
        })
      }
    ]
  },
  {
    id: 'scavenge_police',
    title: 'Malentendido',
    description: 'Alguien pensó que estabas intentando robar y llamó a un oficial. Tuviste que explicarte, pero la gente se quedó mirándote mal.',
    options: [
      {
        label: 'Irte callado',
        description: 'Pierdes 10 Reputación.',
        action: (state) => ({
          reputation: Math.max(0, state.reputation - 10)
        })
      }
    ]
  },
  {
    id: 'scavenge_food',
    title: '¿Comida Gratis?',
    description: 'Buscando dinero encontraste un sándwich a medio comer, aún en su envoltorio. El hambre aprieta.',
    options: [
      {
        label: 'Comerlo',
        description: 'Ganas 10 Salud, pero pierdes 5 Higiene.',
        action: (state) => ({
          health: Math.min(100, state.health + 10),
          hygiene: Math.max(0, state.hygiene - 5)
        })
      },
      {
        label: 'Dejarlo',
        description: 'Pierdes 5 Ánimo por quedarte con hambre.',
        action: (state) => ({
          mood: Math.max(0, state.mood - 5)
        })
      }
    ]
  },
  {
    id: 'scavenge_fall',
    title: 'Caída Dolorosa',
    description: 'Intentaste alcanzar una moneda brillante que rodó hacia la alcantarilla y caíste raspándote las rodillas.',
    options: [
      {
        label: 'Levantarte adolorido',
        description: 'Pierdes 10 Salud y 5 Ánimo.',
        action: (state) => ({
          health: Math.max(0, state.health - 10),
          mood: Math.max(0, state.mood - 5)
        })
      }
    ]
  },
  {
    id: 'coffee_cup_aura',
    title: '¡La Taza de Café en el Aire!',
    description: 'Un ejecutivo apresurado con traje de marca tropieza a tu lado. Su capuchino hirviendo sale despedido volando por los aires trazando una parábola sobre la multitud.',
    options: [
      {
        label: 'Atraparlo en el aire con una sola mano sin mirar (60% de éxito)',
        description: 'Todo o nada por el clip épico. Éxito: +2,500 Aura, +10 Reputación y $50 de propina maravillado. Fallo: -3,000 Aura, quemadura (-10 Salud), te empapas de café (-25 Higiene) y la gente se burla.',
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
        description: 'Das un paso milimétrico con frialdad absoluta mientras el vaso se estrella en el asfalto. Conservas tu dignidad intacta.',
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
