# 📄 Documento de Especificación Funcional & Game Design (GDD)
## **Callejero: El Ascenso**
**Versión:** 1.4.0  
**Género:** Incremental / Idle Clicker / Survival RPG Humorístico  
**Plataformas:** Web Responsive, PWA (Móvil / Desktop)  
**Autor:** pablodeluxe  

---

## 1. 🎯 Visión General del Juego

**Callejero: El Ascenso** es un juego incremental de supervivencia urbana con tono cómico y satírico. El jugador encarna a un personaje que comienza en la calle sobreviviendo con lo básico y, a través de recolección manual, gestión de necesidades vitales, compra de negocios informales, rituales esotéricos y changas temporizadas, escala socialmente hasta convertirse en el amo indiscutido del barrio.

---

## 2. 🔄 Loops de Juego (Game Loops)

```
       [ 1. Loop Activo / Manual ]
    Recolectar Latas / Tirar Pose de Aura
                     │
                     ▼
           [ 2. Ganancia de Dinero & Aura ] ────────┐
                     │                              │
                     ▼                              ▼
      [ 3. Gestión de Supervivencia ]    [ 4. Negocios & Changas ]
     Comer / Higiene / Ánimo / Salud     Negocios Pasivos / Tareas x Tiempo
                     │                              │
                     └──────────────┬───────────────┘
                                    ▼
                         [ 5. Sistema de Prestigio ]
                      Reinicio con Fichas Permanentes
```

---

## 3. 📊 Módulos Funcionales y Mecánicas Detalladas

### 3.1. Atributos Vitales y Mecánica de Supervivencia
El personaje cuenta con 4 atributos fundamentales que oscilan entre 0% y 100%:

| Atributo | Desgaste Base / tick | Métodos de Recuperación | Consecuencia al llegar a 0% |
| :--- | :--- | :--- | :--- |
| **❤️ Salud** | -0.15% / seg | Botón "Comer" ($20 ➔ +30%), Comida rápida abandonada, Meditación | **Muerte por desnutrición/colapso.** Abre pantalla de Game Over. |
| **🧼 Higiene** | -0.10% / seg | Botón "Ducharse" ($15 ➔ +40%), Baño público | **Muerte por infección bacteriana extrema.** |
| **🎭 Ánimo** | -0.20% / seg | Botón "Ocio" ($30 ➔ +35%), Cantar a palomas, Radio a pilas | **Colapso mental por depresión callejera.** |
| **⭐ Reputación** | Variable por eventos | Boletos origami, cuidar autos, eventos de honor | Desbloqueo de negocios avanzados y mejores ganancias. |

#### Acciones Rápidas de Supervivencia:
* **Comer:** Coste `$20` ➔ Restaura `+30% Salud`.
* **Ducharse:** Coste `$15` ➔ Restaura `+40% Higiene`.
* **Ocio:** Coste `$30` ➔ Restaura `+35% Ánimo`.

---

### 3.2. Mecánica de Desconexión Offline y Ventana de 14 Horas
1. **Cálculo de Inactividad:**
   $$\Delta t = \min(\text{ahora} - \text{última\_conexión}, 14\text{ horas})$$
2. **Suelo de Seguridad al 5% (Hasta 14 horas):**
   * Mientras el usuario esté desconectado hasta un máximo de 14 horas, los atributos descienden pero se detienen en un **5% mínimo**.
   * Esto garantiza que el jugador no muera mientras duerme o trabaja, permitiéndole entrar a recoger sus ganancias pasivas y sanar a su personaje.
3. **Muerte por Abandono (>14 horas):**
   * Si la ausencia supera las 14 horas, el suelo de seguridad se desactiva y el personaje sufre Game Over.
4. **Reanimación Callejera (Rescate de Emergencia):**
   * En caso de muerte tras desconexión prolongada o colapso en partida activa, se habilita el rescate de paramédicos: el jugador entrega el 100% del dinero acumulado pero **conserva todos sus negocios, prestigio y auras**, reapareciendo con todas las estadísticas al **25%**.
5. **Pérdida de Changas y Rituales por Muerte:**
   * Si por cualquier motivo el personaje muere mientras tiene **changas o rituales activos**, todo vuelve a cero inmediatamente.
   * Las changas o rituales en curso se cancelan, no permanecen activas si el jugador revive con la Reanimación Callejera y **se pierde el 100% del progreso acumulado** en dichas actividades.

---

### 3.3. Sistema de Aura, Poses y Frenesí Callejero

* **Aura Base:** Recurso místico acumulativo generado al recolectar dinero, completar changas o "Tirar Pose".
* **Acción «Tirar Pose»:**
  * **Éxito (75%):** Otorga un golpe de Aura y suma `+1` a la racha de poses.
  * **Blooper / Fallo (25%):** El personaje tropieza o se le cae el sombrero. Se pierde un pequeño porcentaje de higiene/ánimo y se reinicia la racha.
  * **Frenesí de Aura x3 (Racha de 5 poses consecutivas):**
    * Activa una ventana de **15 segundos** donde cada clic de recolección otorga el **triple de dinero** ($3x$) con animaciones doradas y efectos de partículas.
* **Tienda de Estilo y Auras (Tiers 1 al 6):**
  * Tiers cosméticos y mecánicos que incrementan permanentemente el dinero base obtenido por clic (desde `$1/clic` hasta `$50/clic`).

---

### 3.4. Negocios Pasivos (Ingresos por Segundo)

| ID Negocio | Nombre Temático | Coste Inicial | Renta Base / seg | Multiplicador de Coste |
| :--- | :--- | :--- | :--- | :--- |
| `cartonero` | **Carro de Cartones Reforzado** | $50 | $1.50 / seg | $\times 1.15$ por nivel |
| `estampitas` | **Venta de Estampitas en el Subte** | $250 | $8.00 / seg | $\times 1.16$ por nivel |
| `limpiavidrios`| **Cuadrilla de Limpiavidrios de Esquina** | $1,200 | $42.00 / seg | $\times 1.18$ por nivel |
| `parrilla` | **Parrillita al Paso en la Vereda** | $6,000 | $220.00 / seg | $\times 1.20$ por nivel |
| `colectora` | **Monopolio de Reciclaje Barrial** | $30,000 | $1,250.00 / seg | $\times 1.22$ por nivel |

---

### 3.5. ⏳ Módulo de Changas Temporizadas & Rituales en Paralelo (Nueva Pantalla)

El juego cuenta con un selector de dos pantallas principales:
1. 🏪 **Mi Esquina:** Vista central de negocios, estadísticas vitales, clicker manual y tienda de auras.
2. ⏳ **Changas & Rituales:** Centro de expediciones temporizadas.

#### Reglas de Concurrencia y Paralelismo:
* **Slot Principal (1 máximo):** Solo se puede realizar **1 Changa Principal** a la vez (requiere dedicación física).
* **Slots Secundarios / Rituales (Hasta 2 simultáneos):** Se pueden activar hasta **2 Rituales en Paralelo** mientras se ejecuta una changa principal.

#### Catálogo de Changas Principales:
1. **🏢 Sereno y Guardia Nocturna de Galpón (Larga Duración / 24hs):**
   * 3 horas: Ganancia `$1,400 - $2,200` | `-12% Ánimo`, `-10% Higiene`, `+40 Aura`.
   * 6 horas (Turno noche): Ganancia `$3,200 - $5,000` | `-22% Ánimo`, `-18% Higiene`, `+15 Reputación`, `+95 Aura`.
   * 9 horas (Jornada completa): Ganancia `$5,500 - $8,500` | `-35% Ánimo`, `-28% Higiene`, `+30 Reputación`, `+170 Aura`.
   * 12 horas (Turno extendido rotativo): Ganancia `$8,500 - $13,500` | `-48% Ánimo`, `-38% Higiene`, `+50 Reputación`, `+280 Aura`.
   * 24 horas (Maratón de Guardia 24hs): Ganancia `$20,000 - $32,000` | `-65% Ánimo`, `-55% Higiene`, `+110 Reputación`, `+650 Aura`.
2. **🚚 Carga y descarga en Mercado Central (Trabajo Físico Pesado):**
   * 1 hora: Ganancia `$500 - $800` | `+15% Salud`, `-20% Higiene`.
   * 3 horas: Ganancia `$1,600 - $2,500` | `+25% Salud`, `-35% Higiene`, `+10 Reputación`.
   * 6 horas (Media jornada): Ganancia `$3,600 - $5,600` | `+40% Salud`, `-55% Higiene`, `+25 Reputación`, `+90 Aura`.
   * 9 horas (Jornada laboral completa): Ganancia `$6,200 - $9,500` | `+55% Salud`, `-70% Higiene`, `+45 Reputación`, `+180 Aura`.
   * 12 horas (Turno pesado de madrugada): Ganancia `$9,800 - $15,500` | `+70% Salud`, `-85% Higiene`, `+75 Reputación`, `+320 Aura`.
3. **🛍️ Peón de Feria Barrial y Armado de Puestos:**
   * 1 hora: Ganancia `$400 - $650` | `+8 Reputación`, `+10 Ánimo`.
   * 3 horas: Ganancia `$1,300 - $2,100` | `+20 Reputación`, `+20 Ánimo`, `+40 Aura`.
   * 6 horas (Feria de fin de semana): Ganancia `$3,000 - $4,800` | `+40 Reputación`, `+35 Ánimo`, `+100 Aura`.
   * 9 horas (Jornada dominical completa): Ganancia `$5,200 - $8,200` | `+65 Reputación`, `+50 Ánimo`, `+190 Aura`.
   * 12 horas (Mega feria franca regional): Ganancia `$8,200 - $12,800` | `+95 Reputación`, `+65 Ánimo`, `+310 Aura`.
4. **⛺ Vigilia y Acampe de Fila para Recitales / Trámites (24hs):**
   * 3 horas: Ganancia `$1,200 - $1,900` | `+50 Aura`, `-10% Ánimo`.
   * 6 horas (Fila matutina de consulado / trámites): Ganancia `$2,800 - $4,200` | `+120 Aura`, `-20% Ánimo`, `+15 Reputación`.
   * 9 horas (Jornada completa de fila): Ganancia `$4,800 - $7,500` | `+220 Aura`, `-35% Ánimo`, `+30 Reputación`.
   * 12 horas (Noche entera en carpa): Ganancia `$7,800 - $12,000` | `+360 Aura`, `-50% Ánimo`, `+60 Reputación`.
   * 24 horas (Acampe legendario 24hs): Ganancia `$18,500 - $29,000` | `+800 Aura`, `-65% Ánimo`, `+130 Reputación`.
5. **🧲 Juntar metales y chatarra (Hasta 12hs):**
   * 5m, 15m, 30m, 1h, 3h, 6h, 9h y 12h (Ganancias escalonadas desde `$25` hasta `$16,200`).
6. **🚗 Cuidar autos en la cuadra ("Trapito", Hasta 12hs):**
   * 10m, 30m, 1h, 3h, 6h, 9h y 12h (Ganancias desde `$60` hasta `$14,800` con reputación barrial).
7. **🔍 Revolver contenedores de lujo (Hasta 12hs):**
   * 15m, 30m, 45m, 3h, 6h, 9h y 12h (Ganancias gourmet desde `$120` hasta `$18,500`).
8. **🍔 Buscar comida abandonada en comida rápida (Hasta 6hs):**
   * 5m, 15m, 30m, 1h, 3h, 6h (Restauración de salud y ánimo gratis).
9. **🎤 Cantar a las palomas en la plaza (Hasta 6hs):**
   * 5m, 10m, 20m, 1h, 3h, 6h (Generador masivo de Aura mística hasta `+2,400 Aura`).
10. **🎫 Armar origami con boletos de colectivo (Hasta 3hs):**
    * 5m, 15m, 1h, 3h (Reputación comunitaria y Aura).
11. **🧘 Meditar sobre un cartón mojado (Hasta 12hs):**
    * 10m, 20m, 40m, 3h, 6h, 12h (Nirvana del asfalto: regeneración total y hasta `+4,200 Aura`).
12. **🃏 Partida de truco / dados clandestinos (Hasta 3hs):**
    * Timba callejera de 5m, 15m, 1h y 3h (Apuestas desde `$20` hasta `$1,000`).

#### Catálogo de Rituales en Paralelo (Buffs y Multiplicadores de Larga Duración):
1. **🕯️ Prender vela de cartón a San Cayetano (20m a 24hs):**
   * *Efecto:* Multiplicador de dinero en changas desde $\times 1.25$ (+25%) hasta $\times 2.25$ (+125% por 24 horas continuas).
2. **📻 Escuchar radio a pilas en la oreja (15m a 24hs):**
   * *Efecto:* Congela al 100% el desgaste de ánimo (`preventMoodDecay = true`) hasta por 24 horas continuas.
3. **💧 Beber agua bendita de grifo municipal (10m a 12hs):**
   * *Efecto:* Inmunidad total al desgaste de salud (`preventHealthDecay = true`) y multiplicador de Aura hasta $\times 2.8$.
4. **🧄 Llevar dientes de ajos en el bolsillo (30m a 24hs):**
   * *Efecto:* Inmunidad a eventos negativos y robos de reputación + bonus de dinero de hasta +35% durante 24 horas.
5. **🍞 Masticar chicle encontrado (5m / 10m / 30m):**
   * *Efecto:* Congela el hambre y otorga ánimo extra durante changas rápidas.

---

### 3.6. Sistema de Prestigio (Renacer Urbano)
Al superar el umbral de `$10,000`, el jugador puede renacer, restableciendo su dinero y negocios a cambio de **Fichas de Prestigio** permanentes:
* **Fórmula de Fichas:**
  $$\text{Fichas Ganadas} = \lfloor \sqrt{\text{Dinero Total} / 10,000} \rfloor$$
* **Árbol de Mejoras de Prestigio:**
  1. *Aura Magnética:* $+50\%$ a la producción pasiva de todos los negocios.
  2. *Genética Callejera:* Reduce en un $50\%$ la tasa de decaimiento de Salud, Higiene y Ánimo.
  3. *Carisma de Asfalto:* Duplica los premios y la reputación en todos los eventos aleatorios.
  4. *Maestría en Changas:* Reduce un $20\%$ el tiempo requerido en todas las changas temporizadas.

---

### 3.7. 🔄 Renacer Callejero (Reinicio a Cero)
Ubicado al final de la pantalla principal (*Mi Esquina*), permite al jugador reiniciar voluntariamente la partida en caso de desear reorientar su estrategia o comenzar un nuevo camino desde cero:
* **Modal de Confirmación:** Advierte con precisión que la acción es irreversible y detalla las pérdidas.
* **Efectos del Reinicio:**
  * Dinero restablecido a `$0.00`.
  * Salud, Higiene y Ánimo restablecidos al `100%`.
  * Reputación restablecida al valor inicial (`50`).
  * Todos los niveles de negocios restablecidos a `0`.
  * Aura, rachas, nivel de estilo y frenesí reiniciados a `0`.
  * Cancelación inmediata de cualquier changa o ritual en curso con pérdida total de progreso.
  * Restablecimiento de fichas y mejoras permanentes de prestigio a `0`.

---

## 4. 📱 Arquitectura Técnica & Persistencia

* **Framework:** React 19 con TypeScript, Vite y Tailwind CSS.
* **Gestión de Estado:** `Zustand` con middleware `persist` sincronizado en `localStorage`.
* **Ciclo de Ticks:** Hook centralizado `useGameLoop` ejecutado cada 1,000 ms:
  * Aplica desgaste de atributos vitales (considerando buffs de rituales activos).
  * Acumula ingresos pasivos de negocios.
  * Verifica condiciones de muerte y dispara modales correspondientes.
* **PWA (Progressive Web App):** Service Worker para soporte offline total, instalación en pantalla de inicio de Android/iOS y manifest con theme color oscuro.

---

## 5. 🛡️ Criterios de Aceptación & Pruebas

1. **Persistencia de Tareas Temporizadas:** Al salir del juego y volver tras 10 minutos, las changas finalizadas deben reflejarse como listas para reclamar sin desfasaje temporal.
2. **Exclusividad de Ranuras:** No es posible iniciar una segunda changa principal si ya hay una en curso; sí se permite activar hasta 2 rituales en paralelo.
3. **Buffs Combinados:** Si el usuario tiene activo el ritual de San Cayetano ($\times 1.25$) y completa una changa de chatarra, el dinero final entregado debe incorporar el multiplicador correspondiente.
4. **Respeto de la Ventana de 14h:** Tras una ausencia de 8 horas, los atributos deben estar en el suelo del 5% y el dinero acumulado debe estar listo para reclamar.
