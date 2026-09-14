export interface TimedActionTier {
  label: string;
  durationSeconds: number;
  description: string;
  cost?: number;
  rewards: {
    moneyMin?: number;
    moneyMax?: number;
    health?: number;
    hygiene?: number;
    mood?: number;
    reputation?: number;
    aura?: number;
    successRate?: number; // For gamble actions
  };
  buffs?: {
    preventHealthDecay?: boolean;
    preventMoodDecay?: boolean;
    moneyMultiplier?: number;
    auraMultiplier?: number;
    negativeEventImmunity?: boolean;
  };
}

export interface TimedAction {
  id: string;
  name: string;
  category: 'primary' | 'secondary';
  icon: string;
  tagline: string;
  description: string;
  color: string;
  tiers: TimedActionTier[];
}

export const PRIMARY_TIMED_ACTIONS: TimedAction[] = [
  {
    id: 'juntar_metales',
    name: 'Juntar metales y chatarra',
    category: 'primary',
    icon: 'Magnet',
    tagline: 'Recorres obras y baldíos con un imán gigante y carretilla.',
    description: 'Genera excelente dinero vendiendo cobre y aluminio al chatarrero, pero ensucia tu ropa.',
    color: 'amber',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Vuelta rápida a la manzana juntando latitas.',
        rewards: { moneyMin: 25, moneyMax: 45, hygiene: -6 }
      },
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Exploración a fondo de un contenedor de demolición.',
        rewards: { moneyMin: 90, moneyMax: 160, hygiene: -14 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Operativo maestro de chatarra pesada con carretilla prestada.',
        rewards: { moneyMin: 220, moneyMax: 380, hygiene: -25 }
      }
    ]
  },
  {
    id: 'comida_rapida',
    name: 'Buscar comida abandonada en locales de comida rápida',
    category: 'primary',
    icon: 'UtensilsCrossed',
    tagline: 'Ojo clínico en mesas desiertas y bandejas a medio terminar.',
    description: 'Encuentras papas fritas, hamburguesas y restos sabrosos para llenar tu estómago casi gratis.',
    color: 'orange',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Papas tibias y culos de gaseosa olvidados en una mesa exterior.',
        rewards: { health: 18, moneyMin: 3, moneyMax: 6, hygiene: -4 }
      },
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Cajita infantil intacta con hamburguesa entera y juguete de plástico.',
        rewards: { health: 42, mood: 12, moneyMin: 12, moneyMax: 20, hygiene: -8 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Bandeja familiar casi completa dejada por turistas apurados.',
        rewards: { health: 80, mood: 25, moneyMin: 30, moneyMax: 55, hygiene: -14 }
      }
    ]
  },
  {
    id: 'cantar_palomas',
    name: 'Cantar a las palomas',
    category: 'primary',
    icon: 'Mic2',
    tagline: 'Baladas sentimentales y óperas callejeras a la bandada.',
    description: 'Aumenta notablemente tu estado de ánimo y Aura mística, aunque los transeúntes te miren raro.',
    color: 'purple',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Tarareo suave mientras les convidas migas de pan.',
        rewards: { mood: 20, aura: 30 }
      },
      {
        label: '10 minutos',
        durationSeconds: 600,
        description: 'Serenata a pulmón abierto en la plaza central.',
        rewards: { mood: 45, aura: 75, reputation: -3 }
      },
      {
        label: '20 minutos',
        durationSeconds: 1200,
        description: 'Concierto sinfónico urbano; las palomas forman un círculo místico.',
        rewards: { mood: 90, aura: 180, reputation: -6 }
      }
    ]
  },
  {
    id: 'cuidar_autos',
    name: 'Cuidar autos en la cuadra ("Trapito")',
    category: 'primary',
    icon: 'Car',
    tagline: 'Trapito en mano y chaleco reflectante improvisado.',
    description: 'Buen caudal de efectivo por indicar huecos de estacionamiento. Cansa físicamente.',
    color: 'emerald',
    tiers: [
      {
        label: '10 minutos',
        durationSeconds: 600,
        description: 'Una tanda de tres autos estacionados.',
        rewards: { moneyMin: 60, moneyMax: 100, health: -8 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Hora pico de salida del teatro o estadio.',
        rewards: { moneyMin: 200, moneyMax: 340, health: -18, reputation: 5 }
      },
      {
        label: '60 minutos',
        durationSeconds: 3600,
        description: 'Turno completo de la noche; eres el amo de la cuadra.',
        rewards: { moneyMin: 450, moneyMax: 780, health: -30, reputation: 12 }
      }
    ]
  },
  {
    id: 'origami_colectivo',
    name: 'Armar origami con boletos de colectivo',
    category: 'primary',
    icon: 'Ticket',
    tagline: 'Transformas boletos de colectivo en pequeños cisnes y dragones.',
    description: 'Ganas el aprecio de los vecinos del barrio y acumulas Aura artesanal.',
    color: 'sky',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Dobleces básicos de cisnes y sapitos.',
        rewards: { reputation: 6, aura: 35, moneyMin: 8, moneyMax: 15 }
      },
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Mini dragones detallados con números capicúa.',
        rewards: { reputation: 18, aura: 110, moneyMin: 30, moneyMax: 50 }
      }
    ]
  },
  {
    id: 'revolver_contenedores',
    name: 'Revolver contenedores de lujo',
    category: 'primary',
    icon: 'Trash2',
    tagline: 'Incursión nocturna tras restaurantes de alta categoría.',
    description: 'Encuentras reliquias, comida gourmet y objetos caros a cambio de un gran olor corporal.',
    color: 'rose',
    tiers: [
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Contenedor de panadería artesanal.',
        rewards: { moneyMin: 120, moneyMax: 200, health: 18, hygiene: -16 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Fondo del bistró gourmet del centro.',
        rewards: { moneyMin: 280, moneyMax: 480, health: 35, hygiene: -28 }
      },
      {
        label: '45 minutos',
        durationSeconds: 2700,
        description: 'Batea de hotel cinco estrellas.',
        rewards: { moneyMin: 550, moneyMax: 920, health: 50, hygiene: -40, aura: 40 }
      }
    ]
  },
  {
    id: 'meditar_carton',
    name: 'Meditar sobre un cartón mojado',
    category: 'primary',
    icon: 'Sparkles',
    tagline: 'Zen urbano en plena vereda.',
    description: 'Recuperas completamente tu salud y tu mente al entrar en armonía con el asfalto.',
    color: 'teal',
    tiers: [
      {
        label: '10 minutos',
        durationSeconds: 600,
        description: 'Respiraciones profundas esquivando el humo de los colectivos.',
        rewards: { health: 30, mood: 35 }
      },
      {
        label: '20 minutos',
        durationSeconds: 1200,
        description: 'Trance callejero; el bullicio de la ciudad se vuelve música blanca.',
        rewards: { health: 65, mood: 75, aura: 50 }
      },
      {
        label: '40 minutos',
        durationSeconds: 2400,
        description: 'Iluminación de vereda; sanación absoluta de cuerpo y espíritu.',
        rewards: { health: 100, mood: 100, aura: 130 }
      }
    ]
  },
  {
    id: 'truco_clandestino',
    name: 'Partida de truco / dados clandestinos',
    category: 'primary',
    icon: 'Coins',
    tagline: 'Desafías a los veteranos de la plaza con cartas gastadas.',
    description: 'Arriesgas dinero en una timba rápida. Si ganas, duplicas o triplicas tu apuesta.',
    color: 'yellow',
    tiers: [
      {
        label: '5 minutos (Apuesta $20)',
        durationSeconds: 300,
        cost: 20,
        description: 'Mano rápida de truco a 15 puntos.',
        rewards: { moneyMin: 55, moneyMax: 60, successRate: 0.8 }
      },
      {
        label: '15 minutos (Apuesta $80)',
        durationSeconds: 900,
        cost: 80,
        description: 'Mesa pesada de dados con los muchachos del buffet.',
        rewards: { moneyMin: 220, moneyMax: 260, reputation: 10, aura: 40, successRate: 0.75 }
      }
    ]
  }
];

export const SECONDARY_TIMED_ACTIONS: TimedAction[] = [
  {
    id: 'agua_bendita',
    name: 'Beber agua bendita de grifo municipal',
    category: 'secondary',
    icon: 'Droplet',
    tagline: 'Un trago sagrado de la canilla de la iglesia de la esquina.',
    description: 'Otorga bendición corporal: congela el desgaste de salud y aumenta las ganancias de Aura un +50%.',
    color: 'cyan',
    tiers: [
      {
        label: '10 minutos',
        durationSeconds: 600,
        description: 'Trago purificador.',
        rewards: { health: 10 },
        buffs: { preventHealthDecay: true, auraMultiplier: 1.5 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Botella de plástico llena hasta el tope.',
        rewards: { health: 25 },
        buffs: { preventHealthDecay: true, auraMultiplier: 1.8 }
      }
    ]
  },
  {
    id: 'radio_pilas',
    name: 'Escuchar radio a pilas en la oreja',
    category: 'secondary',
    icon: 'Radio',
    tagline: 'Transmisión de fútbol y cumbias clásicas con antena de alambre.',
    description: 'Mantiene tu mente alegre y concentrada: congela completamente el desgaste de Ánimo.',
    color: 'emerald',
    tiers: [
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Bloque de noticias y tangos.',
        rewards: { mood: 15 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Partido de la tarde con relatores apasionados.',
        rewards: { mood: 30, aura: 25 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '60 minutos',
        durationSeconds: 3600,
        description: 'Especial nocturno de éxitos tropicales.',
        rewards: { mood: 50, aura: 60 },
        buffs: { preventMoodDecay: true }
      }
    ]
  },
  {
    id: 'dientes_ajos',
    name: 'Llevar dientes de ajos en el bolsillo',
    category: 'secondary',
    icon: 'Shield',
    tagline: 'Tres dientes de ajo bien concentrados contra la mala vibra.',
    description: 'Protege contra eventos desafortunados y reduce a 0% las pérdidas imprevistas de reputación.',
    color: 'indigo',
    tiers: [
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Aroma protector sutil.',
        rewards: { aura: 20 },
        buffs: { negativeEventImmunity: true }
      },
      {
        label: '60 minutos',
        durationSeconds: 3600,
        description: 'Aura impenetrable contra inspectores y malas ondas.',
        rewards: { aura: 50 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.1 }
      }
    ]
  },
  {
    id: 'vela_san_cayetano',
    name: 'Prender vela de cartón a San Cayetano',
    category: 'secondary',
    icon: 'Flame',
    tagline: 'Rezo callejero al santo del pan y del trabajo.',
    description: 'Bendice todas tus changas y actividades aumentando un +25% a +50% todo el dinero generado.',
    color: 'amber',
    tiers: [
      {
        label: '20 minutos',
        durationSeconds: 1200,
        description: 'Plegaria humilde con llamita protegida del viento.',
        rewards: { aura: 15 },
        buffs: { moneyMultiplier: 1.25 }
      },
      {
        label: '40 minutos',
        durationSeconds: 2400,
        description: 'Vela mediana con estampita recortada del diario.',
        rewards: { aura: 35 },
        buffs: { moneyMultiplier: 1.35 }
      },
      {
        label: '80 minutos',
        durationSeconds: 4800,
        description: 'Santuario de vereda completo con velas encendidas.',
        rewards: { aura: 80 },
        buffs: { moneyMultiplier: 1.5 }
      }
    ]
  },
  {
    id: 'chicle_encontrado',
    name: 'Masticar chicle encontrado',
    category: 'secondary',
    icon: 'Smile',
    tagline: 'Todavía tenía el envoltorio plateado a medio abrir.',
    description: 'Engaña al estómago y te da sabor mentolado durante las changas cortas.',
    color: 'pink',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Sabor a menta fresca.',
        rewards: { mood: 8 },
        buffs: { preventHealthDecay: true }
      },
      {
        label: '10 minutos',
        durationSeconds: 600,
        description: 'Globo gigante que impresiona a los pibes de la plaza.',
        rewards: { mood: 16, aura: 10 },
        buffs: { preventHealthDecay: true }
      }
    ]
  }
];

export const ALL_TIMED_ACTIONS: TimedAction[] = [
  ...PRIMARY_TIMED_ACTIONS,
  ...SECONDARY_TIMED_ACTIONS
];
