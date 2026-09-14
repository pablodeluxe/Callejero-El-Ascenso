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
    id: 'guardia_sereno',
    name: 'Sereno y Guardia Nocturna de Galpón',
    category: 'primary',
    icon: 'Warehouse',
    tagline: 'Linterna gastada, termos de mate y vigilia de predio industrial.',
    description: 'Trabajos de guardia y vigilancia extendida. Excelente paga acumulada por largas horas de turno.',
    color: 'indigo',
    tiers: [
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Recorrida perimetral y mateada en la casilla de entrada.',
        rewards: { moneyMin: 1400, moneyMax: 2200, mood: -12, hygiene: -10, aura: 40 }
      },
      {
        label: '6 horas (Turno noche)',
        durationSeconds: 21600,
        description: 'Vigilancia nocturna con linterna y radio contra ladrones de cables.',
        rewards: { moneyMin: 3200, moneyMax: 5000, mood: -22, hygiene: -18, reputation: 15, aura: 95 }
      },
      {
        label: '9 horas (Jornada completa)',
        durationSeconds: 32400,
        description: 'Guardia ininterrumpida de galpón con apertura de portón a proveedores.',
        rewards: { moneyMin: 5500, moneyMax: 8500, mood: -35, hygiene: -28, reputation: 30, aura: 170 }
      },
      {
        label: '12 horas (Turno extendido rotativo)',
        durationSeconds: 43200,
        description: 'Doble turno de vigilancia con perro ovejero y rondas cada 30 minutos.',
        rewards: { moneyMin: 8500, moneyMax: 13500, mood: -48, hygiene: -38, reputation: 50, aura: 280 }
      },
      {
        label: '24 horas (Maratón de Guardia 24hs)',
        durationSeconds: 86400,
        description: 'Guardia maratónica de fin de semana completo en parque industrial. Pago monumental.',
        rewards: { moneyMin: 20000, moneyMax: 32000, mood: -65, hygiene: -55, reputation: 110, aura: 650 }
      }
    ]
  },
  {
    id: 'estibador_mercado',
    name: 'Carga y descarga en Mercado Central',
    category: 'primary',
    icon: 'Truck',
    tagline: 'Descarga de acoplados con cajones de frutas, verduras y bolsas de papa.',
    description: 'Trabajo físico de fuerza bruta. Forja cuerpo de acero pero desgasta tu higiene al máximo.',
    color: 'emerald',
    tiers: [
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Bajar 50 cajones de tomates y melones.',
        rewards: { moneyMin: 500, moneyMax: 800, health: 15, hygiene: -20 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Cuadrilla de descarga de camión con acoplado.',
        rewards: { moneyMin: 1600, moneyMax: 2500, health: 25, hygiene: -35, reputation: 10 }
      },
      {
        label: '6 horas (Media jornada)',
        durationSeconds: 21600,
        description: 'Turno completo en el pabellón central de verduras.',
        rewards: { moneyMin: 3600, moneyMax: 5600, health: 40, hygiene: -55, reputation: 25, aura: 90 }
      },
      {
        label: '9 horas (Jornada laboral completa)',
        durationSeconds: 32400,
        description: 'Día entero de estibador profesional bajo el sol y lluvia.',
        rewards: { moneyMin: 6200, moneyMax: 9500, health: 55, hygiene: -70, reputation: 45, aura: 180 }
      },
      {
        label: '12 horas (Turno pesado de madrugada)',
        durationSeconds: 43200,
        description: 'Descarga de 3 semirremolques frigoríficos con bolsas de 50kg.',
        rewards: { moneyMin: 9800, moneyMax: 15500, health: 70, hygiene: -85, reputation: 75, aura: 320 }
      }
    ]
  },
  {
    id: 'peon_feria',
    name: 'Peón de Feria Barrial y Armado de Puestos',
    category: 'primary',
    icon: 'ShoppingBag',
    tagline: 'Armado de caballetes, toldos de lona y venta de ofertas.',
    description: 'Te ganas el respeto de los puesteros del barrio mientras ganas dinero y reputación.',
    color: 'sky',
    tiers: [
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Armar tablones y colgar percheros al amanecer.',
        rewards: { moneyMin: 400, moneyMax: 650, reputation: 8, mood: 10 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Atención de puesto de ropa usada y baratijas.',
        rewards: { moneyMin: 1300, moneyMax: 2100, reputation: 20, mood: 20, aura: 40 }
      },
      {
        label: '6 horas (Feria de fin de semana)',
        durationSeconds: 21600,
        description: 'Atención completa de clientela y regateo callejero.',
        rewards: { moneyMin: 3000, moneyMax: 4800, reputation: 40, mood: 35, aura: 100 }
      },
      {
        label: '9 horas (Jornada dominical completa)',
        durationSeconds: 32400,
        description: 'Desde el armado a las 6 AM hasta el conteo de caja y limpieza.',
        rewards: { moneyMin: 5200, moneyMax: 8200, reputation: 65, mood: 50, aura: 190 }
      },
      {
        label: '12 horas (Mega feria franca regional)',
        durationSeconds: 43200,
        description: 'Armado, 10 horas de atención continua a miles de personas y desarme nocturno.',
        rewards: { moneyMin: 8200, moneyMax: 12800, reputation: 95, mood: 65, aura: 310 }
      }
    ]
  },
  {
    id: 'acampe_fila',
    name: 'Vigilia y Acampe de Fila para Recitales / Trámites',
    category: 'primary',
    icon: 'Tent',
    tagline: 'Reposera desvencijada, abrigo térmico y guardar lugar en la vereda.',
    description: 'Cobras por guardar puestos codiciados en trámites o conciertos masivos. Aura mística de aguante.',
    color: 'rose',
    tiers: [
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Guardar lugar en la fila del banco a la mañana.',
        rewards: { moneyMin: 1200, moneyMax: 1900, aura: 50, mood: -10 }
      },
      {
        label: '6 horas (Fila matutina de consulado / trámites)',
        durationSeconds: 21600,
        description: 'Cuidar el primer puesto desde la madrugada.',
        rewards: { moneyMin: 2800, moneyMax: 4200, aura: 120, mood: -20, reputation: 15 }
      },
      {
        label: '9 horas (Jornada completa de fila)',
        durationSeconds: 32400,
        description: 'Esperar todo el día bajo el alero para entrega de turnos especiales.',
        rewards: { moneyMin: 4800, moneyMax: 7500, aura: 220, mood: -35, reputation: 30 }
      },
      {
        label: '12 horas (Noche entera en carpa)',
        durationSeconds: 43200,
        description: 'Noche completa de guardia para entradas de campo VIP.',
        rewards: { moneyMin: 7800, moneyMax: 12000, aura: 360, mood: -50, reputation: 60 }
      },
      {
        label: '24 horas (Acampe legendario 24hs)',
        durationSeconds: 86400,
        description: '24 horas ininterrumpidas en la vereda con mate, frazadas y radio. Pago y Aura descomunales.',
        rewards: { moneyMin: 18500, moneyMax: 29000, aura: 800, mood: -65, reputation: 130 }
      }
    ]
  },
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
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Búsqueda sistemática de cañerías y cables viejos.',
        rewards: { moneyMin: 480, moneyMax: 850, hygiene: -35, health: -10 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Raid por 5 obras en construcción recolectando perfiles y chapas.',
        rewards: { moneyMin: 1600, moneyMax: 2800, hygiene: -48, health: -20, reputation: 6 }
      },
      {
        label: '6 horas (Media jornada)',
        durationSeconds: 21600,
        description: 'Recorrido barrial masivo con carro tirado a pulso.',
        rewards: { moneyMin: 3500, moneyMax: 6000, hygiene: -65, health: -30, reputation: 15, aura: 85 }
      },
      {
        label: '9 horas (Jornada completa de reciclaje)',
        durationSeconds: 32400,
        description: 'Jornada laboral completa cargando más de 200kg de metales limpios.',
        rewards: { moneyMin: 6000, moneyMax: 10500, hygiene: -78, health: -42, reputation: 25, aura: 160 }
      },
      {
        label: '12 horas (Turno pesado de chatarra)',
        durationSeconds: 43200,
        description: 'Desarme y carga de estructuras metálicas pesadas en fábricas abandonadas.',
        rewards: { moneyMin: 9200, moneyMax: 16200, hygiene: -88, health: -52, reputation: 35, aura: 260 }
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
        description: 'Hora pico de salida del teatro o restaurante.',
        rewards: { moneyMin: 200, moneyMax: 340, health: -18, reputation: 5 }
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Turno de noche; eres el dueño de la cuadra.',
        rewards: { moneyMin: 450, moneyMax: 780, health: -28, reputation: 12 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Estacionamiento continuo durante un partido barrial.',
        rewards: { moneyMin: 1500, moneyMax: 2600, health: -42, reputation: 25, aura: 60 }
      },
      {
        label: '6 horas (Media jornada)',
        durationSeconds: 21600,
        description: 'Control de cuadra entera durante recital en el estadio.',
        rewards: { moneyMin: 3400, moneyMax: 5800, health: -58, reputation: 45, aura: 140 }
      },
      {
        label: '9 horas (Jornada laboral completa)',
        durationSeconds: 32400,
        description: 'Jornada comercial completa frente al centro comercial y bancos.',
        rewards: { moneyMin: 5800, moneyMax: 9800, health: -70, reputation: 65, aura: 230 }
      },
      {
        label: '12 horas (Doble turno de festival masivo)',
        durationSeconds: 43200,
        description: 'Festival de música multitudinario; coordinas 10 cuadras con chaleco flúor.',
        rewards: { moneyMin: 8800, moneyMax: 14800, health: -80, reputation: 90, aura: 340 }
      }
    ]
  },
  {
    id: 'revolver_contenedores',
    name: 'Revolver contenedores de lujo',
    category: 'primary',
    icon: 'Trash2',
    tagline: 'Incursión nocturna tras restaurantes y hoteles de alta categoría.',
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
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Raid por 10 contenedores en el polo gastronómico.',
        rewards: { moneyMin: 2200, moneyMax: 3600, health: 75, hygiene: -60, aura: 120 }
      },
      {
        label: '6 horas (Media jornada de recolección gourmet)',
        durationSeconds: 21600,
        description: 'Incursión completa tras eventos diplomáticos y cadenas de lujo.',
        rewards: { moneyMin: 4800, moneyMax: 7800, health: 90, hygiene: -78, aura: 240, reputation: 15 }
      },
      {
        label: '9 horas (Jornada completa)',
        durationSeconds: 32400,
        description: 'Ruta planificada por los mejores desechos de la alta sociedad.',
        rewards: { moneyMin: 7800, moneyMax: 12500, health: 100, hygiene: -88, aura: 380, reputation: 28 }
      },
      {
        label: '12 horas (El rey de los tachos gourmet)',
        durationSeconds: 43200,
        description: 'Inspección minuciosa de contenedores de hoteles, bodegas y embajadas.',
        rewards: { moneyMin: 11800, moneyMax: 18500, health: 100, hygiene: -98, aura: 560, reputation: 45 }
      }
    ]
  },
  {
    id: 'comida_rapida',
    name: 'Buscar comida abandonada en comida rápida',
    category: 'primary',
    icon: 'UtensilsCrossed',
    tagline: 'Ojo clínico en mesas desiertas y bandejas a medio terminar.',
    description: 'Encuentras papas fritas, hamburguesas y restos sabrosos para llenar tu estómago gratis.',
    color: 'orange',
    tiers: [
      {
        label: '5 minutos',
        durationSeconds: 300,
        description: 'Papas tibias y culos de gaseosa en mesa exterior.',
        rewards: { health: 18, moneyMin: 3, moneyMax: 6, hygiene: -4 }
      },
      {
        label: '15 minutos',
        durationSeconds: 900,
        description: 'Cajita infantil intacta con hamburguesa entera y juguete.',
        rewards: { health: 42, mood: 12, moneyMin: 12, moneyMax: 20, hygiene: -8 }
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Bandeja familiar dejada por turistas apurados.',
        rewards: { health: 80, mood: 25, moneyMin: 30, moneyMax: 55, hygiene: -14 }
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Banquete en patio de comidas de shopping.',
        rewards: { health: 100, mood: 40, moneyMin: 70, moneyMax: 120, hygiene: -22 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Patrullaje gastronómico por 4 sucursales distintas.',
        rewards: { health: 100, mood: 70, moneyMin: 220, moneyMax: 380, hygiene: -40, aura: 35 }
      },
      {
        label: '6 horas (Cacería gastronómica)',
        durationSeconds: 21600,
        description: 'Llenas mochilas enteras de combos casi intactos y nuggets.',
        rewards: { health: 100, mood: 90, moneyMin: 550, moneyMax: 900, hygiene: -58, aura: 85 }
      }
    ]
  },
  {
    id: 'cantar_palomas',
    name: 'Cantar a las palomas en la plaza',
    category: 'primary',
    icon: 'Mic2',
    tagline: 'Baladas sentimentales y óperas callejeras a la bandada.',
    description: 'Aumenta notablemente tu estado de ánimo y Aura mística.',
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
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Ópera callejera de 3 actos; el público tira monedas conmovido.',
        rewards: { mood: 100, aura: 400, moneyMin: 150, moneyMax: 300, reputation: 10 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Maratón coral acústico; bandadas de aves de toda la ciudad te veneran.',
        rewards: { mood: 100, aura: 1100, moneyMin: 600, moneyMax: 1100, reputation: 25 }
      },
      {
        label: '6 horas (Concierto de la plaza)',
        durationSeconds: 21600,
        description: 'Te conviertes en la leyenda del canto urbano. Aura descomunal.',
        rewards: { mood: 100, aura: 2400, moneyMin: 1500, moneyMax: 2600, reputation: 50 }
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
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Esculturas de papel gigantes exhibidas en la parada.',
        rewards: { reputation: 45, aura: 380, moneyMin: 120, moneyMax: 220 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Taller de papiroflexia en la plaza para niños del barrio.',
        rewards: { reputation: 90, aura: 950, moneyMin: 400, moneyMax: 750 }
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
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Meditación profunda; levitación sutil de 2 centímetros sobre el cartón.',
        rewards: { health: 100, mood: 100, aura: 750, reputation: 20 }
      },
      {
        label: '6 horas (Trance de gurú callejero)',
        durationSeconds: 21600,
        description: 'Inmóvil bajo la lluvia; los transeúntes te dejan ofrendas de respeto.',
        rewards: { health: 100, mood: 100, aura: 1800, moneyMin: 800, moneyMax: 1500, reputation: 50 }
      },
      {
        label: '12 horas (Nirvana del asfalto)',
        durationSeconds: 43200,
        description: 'Desconexión total del plano material. Regeneración divina y bendición de Aura.',
        rewards: { health: 100, mood: 100, aura: 4200, moneyMin: 2200, moneyMax: 4000, reputation: 100 }
      }
    ]
  },
  {
    id: 'truco_clandestino',
    name: 'Partida de truco / dados clandestinos',
    category: 'primary',
    icon: 'Coins',
    tagline: 'Desafías a los veteranos de la plaza con cartas gastadas.',
    description: 'Arriesgas dinero en una timba rápida. Si ganas, multiplicas tu apuesta.',
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
      },
      {
        label: '1 hora (Apuesta $300 - Mesa VIP de plaza)',
        durationSeconds: 3600,
        cost: 300,
        description: 'Torneo de truco con puesteros y remiseros.',
        rewards: { moneyMin: 850, moneyMax: 1100, reputation: 25, aura: 120, successRate: 0.72 }
      },
      {
        label: '3 horas (Apuesta $1,000 - Campeonato nocturno)',
        durationSeconds: 10800,
        cost: 1000,
        description: 'Gran timba clandestina en el sótano de la rotisería.',
        rewards: { moneyMin: 3200, moneyMax: 4200, reputation: 60, aura: 350, successRate: 0.70 }
      }
    ]
  }
];

export const SECONDARY_TIMED_ACTIONS: TimedAction[] = [
  {
    id: 'vela_san_cayetano',
    name: 'Prender vela de cartón a San Cayetano',
    category: 'secondary',
    icon: 'Flame',
    tagline: 'Rezo callejero al santo del pan y del trabajo.',
    description: 'Bendice todas tus changas y actividades aumentando un +25% a +100% todo el dinero generado.',
    color: 'amber',
    tiers: [
      {
        label: '20 minutos (+25% Dinero)',
        durationSeconds: 1200,
        description: 'Plegaria humilde con llamita protegida del viento.',
        rewards: { aura: 15 },
        buffs: { moneyMultiplier: 1.25 }
      },
      {
        label: '40 minutos (+35% Dinero)',
        durationSeconds: 2400,
        description: 'Vela mediana con estampita recortada del diario.',
        rewards: { aura: 35 },
        buffs: { moneyMultiplier: 1.35 }
      },
      {
        label: '80 minutos (+50% Dinero)',
        durationSeconds: 4800,
        description: 'Santuario de vereda completo con velas encendidas.',
        rewards: { aura: 80 },
        buffs: { moneyMultiplier: 1.5 }
      },
      {
        label: '3 horas (+60% Dinero)',
        durationSeconds: 10800,
        description: 'Novena callejera con velón rojo y amarillo protegido en tarro.',
        rewards: { aura: 180 },
        buffs: { moneyMultiplier: 1.6 }
      },
      {
        label: '6 horas (+75% Dinero)',
        durationSeconds: 21600,
        description: 'Cirio pascual bendito en la esquina más transitada.',
        rewards: { aura: 380 },
        buffs: { moneyMultiplier: 1.75 }
      },
      {
        label: '9 horas (+85% Dinero - Jornada Santa)',
        durationSeconds: 32400,
        description: 'Vigilia de velas con peregrinos del barrio. Bendición inquebrantable.',
        rewards: { aura: 650 },
        buffs: { moneyMultiplier: 1.85 }
      },
      {
        label: '12 horas (+100% Dinero - DOBLE DE GANANCIAS)',
        durationSeconds: 43200,
        description: 'Doble de efectivo en todas las changas completadas durante el turno.',
        rewards: { aura: 1000 },
        buffs: { moneyMultiplier: 2.0 }
      },
      {
        label: '24 horas (+125% Dinero - PROSPERIDAD DIVINA 24HS)',
        durationSeconds: 86400,
        description: 'Vela de 7 días encendida en nicho barrial. Multiplicador x2.25 durante 24 horas.',
        rewards: { aura: 2400 },
        buffs: { moneyMultiplier: 2.25 }
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
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Especial nocturno de éxitos tropicales.',
        rewards: { mood: 50, aura: 60 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Transmisión ininterrumpida de clásicos del rock nacional y folklore.',
        rewards: { mood: 80, aura: 180 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '6 horas (Media jornada musical)',
        durationSeconds: 21600,
        description: 'Pilas alcalinas nuevas; programa cómico y entrevistas de trasnoche.',
        rewards: { mood: 100, aura: 380 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '9 horas (Jornada radial completa)',
        durationSeconds: 32400,
        description: 'Todo el día acompañado por la mejor programación; congelamiento total de depresión.',
        rewards: { mood: 100, aura: 620 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '12 horas (Maratón radial nocturno)',
        durationSeconds: 43200,
        description: 'Guardia completa con relatos de boxeo y cumbia santafesina.',
        rewards: { mood: 100, aura: 950 },
        buffs: { preventMoodDecay: true }
      },
      {
        label: '24 horas (Transmisión ininterrumpida 24hs)',
        durationSeconds: 86400,
        description: 'La radio nunca se apaga. Congela el desgaste de ánimo durante 24 horas continuas.',
        rewards: { mood: 100, aura: 2200 },
        buffs: { preventMoodDecay: true }
      }
    ]
  },
  {
    id: 'agua_bendita',
    name: 'Beber agua bendita de grifo municipal',
    category: 'secondary',
    icon: 'Droplet',
    tagline: 'Un trago sagrado de la canilla de la iglesia de la esquina.',
    description: 'Otorga bendición corporal: congela el desgaste de salud y aumenta las ganancias de Aura.',
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
      },
      {
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Bidón de 5 litros bendecido por el cura párroco.',
        rewards: { health: 45, aura: 40 },
        buffs: { preventHealthDecay: true, auraMultiplier: 2.0 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Protección inmunológica contra la intemperie por 3 horas.',
        rewards: { health: 70, aura: 140 },
        buffs: { preventHealthDecay: true, auraMultiplier: 2.2 }
      },
      {
        label: '6 horas (Media jornada de inmunidad)',
        durationSeconds: 21600,
        description: 'Salud blindada y aura duplicada durante 6 horas de trabajo continuo.',
        rewards: { health: 100, aura: 320 },
        buffs: { preventHealthDecay: true, auraMultiplier: 2.4 }
      },
      {
        label: '9 horas (Jornada completa bendecida)',
        durationSeconds: 32400,
        description: 'Inmunidad de salud total para toda tu jornada laboral.',
        rewards: { health: 100, aura: 550 },
        buffs: { preventHealthDecay: true, auraMultiplier: 2.5 }
      },
      {
        label: '12 horas (Blindaje divino de 12hs)',
        durationSeconds: 43200,
        description: 'Cero pérdida de salud durante 12 horas completas de intemperie.',
        rewards: { health: 100, aura: 850 },
        buffs: { preventHealthDecay: true, auraMultiplier: 2.8 }
      }
    ]
  },
  {
    id: 'dientes_ajos',
    name: 'Llevar dientes de ajos en el bolsillo',
    category: 'secondary',
    icon: 'Shield',
    tagline: 'Tres dientes de ajo bien concentrados contra la mala vibra.',
    description: 'Protege contra eventos desafortunados y pérdidas de reputación, con bonus de dinero.',
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
        label: '1 hora',
        durationSeconds: 3600,
        description: 'Aura impenetrable contra inspectores y malas ondas.',
        rewards: { aura: 50 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.1 }
      },
      {
        label: '3 horas',
        durationSeconds: 10800,
        description: 'Ristra de 5 ajos trenzados con hilo sisal.',
        rewards: { aura: 160 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.15 }
      },
      {
        label: '6 horas (Amuleto de turno completo)',
        durationSeconds: 21600,
        description: 'Protección absoluta durante 6 horas contra cualquier mala racha.',
        rewards: { aura: 350 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.2 }
      },
      {
        label: '9 horas (Escudo de jornada completa)',
        durationSeconds: 32400,
        description: 'Inmunidad garantizada durante 9 horas de changas pesadas.',
        rewards: { aura: 580 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.25 }
      },
      {
        label: '12 horas (Ristra gigante de 12hs)',
        durationSeconds: 43200,
        description: 'Escudo protector contra eventos negativos y +30% de dinero por 12 horas.',
        rewards: { aura: 900 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.3 }
      },
      {
        label: '24 horas (Amuleto sagrado de 24hs)',
        durationSeconds: 86400,
        description: 'Protección total e inquebrantable durante un día completo.',
        rewards: { aura: 2000 },
        buffs: { negativeEventImmunity: true, moneyMultiplier: 1.35 }
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
      },
      {
        label: '30 minutos',
        durationSeconds: 1800,
        description: 'Chicle resistente que mantiene sabor durante media hora.',
        rewards: { mood: 35, aura: 25 },
        buffs: { preventHealthDecay: true }
      }
    ]
  }
];

export const ALL_TIMED_ACTIONS: TimedAction[] = [
  ...PRIMARY_TIMED_ACTIONS,
  ...SECONDARY_TIMED_ACTIONS
];

