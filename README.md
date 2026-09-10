# Callejero: El Ascenso 🌆

> **De la acera a la cima:** sobrevive en la ciudad, equilibra tus necesidades básicas de salud, higiene y ánimo, y forja un imperio financiero paso a paso.

*Callejero: El Ascenso* es un juego de gestión y progresión urbana (*incremental / idle game*) donde comienzas sin un solo centavo en la calle y debes tomar decisiones estratégicas para mantenerte con vida, ganar reputación y montar negocios que generen ingresos continuos.

---

## 🎮 Funcionalidades Principales

### 1. 🩺 Supervivencia y Muertes Cómicas
Tus atributos vitales se desgastan de manera continua. Si cualquiera de ellos llega a **0%**, el personaje sufre una muerte cómica y la partida se reinicia desde cero:
* **Salud (0%) — ¡Colapso Dramático!**: Te desplomas como un saco de papas tras comer frituras misteriosas y un vahído frente a una paloma.
* **Higiene (0%) — ¡Alarma Bioquímica!**: Tu aroma a calcetín milenario activa una brigada municipal con trajes NBQ que te rocía con mangueras y te manda rodando al río.
* **Ánimo (0%) — ¡El Rey de las Palomas!**: Pierdes la cordura urbana, te colocas una caja de pizza en la cabeza como corona y te vas a fundar un imperio aviar con los pájaros.
* **Reputación (0%) — ¡Desterrado en Contenedor!**: Vecinos y comerciantes se cansan de tus escándalos, te meten en un contenedor de reciclaje con ruedas y te lanzan autopista abajo.
* **⛔ Suspensión de Ganancias:** Si la salud cae por debajo del **10%**, tus negocios pasivos se pausan automáticamente.
* **Recuperación:** Puedes gastar dinero para comprar comida nutritiva, asearte en fuentes públicas y divertirte en el salón de recreativas.

---

### 2. 💼 Economía Urbana y Negocios Pasivos
* **Acción Manual:** Pide monedas o busca en las calles para ganar tus primeros dólares y encontrar oportunidades.
* **Negocios Desbloqueables y Mejorables:**
  * 🎭 **Estatua Viviente**: Ingresos base para comenzar tu camino.
  * 🎸 **Músico Callejero**: Ritmo y propinas de los transeúntes.
  * 📚 **Puesto de Libros Usados**: Comercio cultural en la vereda.
  * 🏪 **Cadena de Kioscos**: Venta masiva y distribución minorista.
* **Monitoreo Financiero:** Visualiza tus ingresos pasivos desglosados en tiempo real por minuto (`$/min`) y por segundo (`$/s`).
* **Penalización por Descuido:** Si tu salud o ánimo caen por debajo del 20%, tus ingresos sufren una penalización del 50%.

---

### 3. 🎲 Eventos Callejeros Dinámicos
A lo largo de la partida ocurren situaciones fortuitas y dilemas morales:
* Inspecciones policiales o municipales donde puedes pagar sobornos o intentar negociar.
* Rescate de animales callejeros, apuestas de dados y ofertas clandestinas.
* **Validación de Fondos:** Las opciones que exigen un pago (como sobornos o gastos médicos) se bloquean automáticamente con una advertencia si no cuentas con el dinero suficiente.

---

### 4. 🌙 Progresión Desconectado (Offline Earnings)
* El juego continúa calculando tus ganancias pasivas y el desgaste de tus atributos incluso cuando la aplicación está cerrada o en segundo plano.
* Al volver, recibirás un informe detallado con el efectivo acumulado listo para recolectar.

---

### 5. 🏆 Sistema de Prestigio (Renacer Urbano)
Cuando alcanzas suficiente riqueza, puedes reiniciar tu partida a cambio de **Fichas de Prestigio** para desbloquear ventajas permanentes:
* **Aura Magnética:** +50% a todos los ingresos pasivos.
* **Genética Callejera:** Reduce un 50% la velocidad con la que se desgastan la salud, higiene y ánimo.
* **Mente Emprendedora:** 25% de descuento permanente en el coste de todos los negocios.

---

### 6. 📱 Progressive Web App (PWA)
* Totalmente adaptable para dispositivos móviles, tablets y escritorio.
* Instalable directamente en Android e iOS como una aplicación nativa.
* Soporte para ejecución sin conexión a internet (*offline-first*).

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19 + TypeScript
* **Herramienta de Construcción:** Vite 6
* **Estilos:** Tailwind CSS
* **Gestión de Estado:** Zustand (con persistencia en `localStorage`)
* **Iconografía:** Lucide React
* **Animaciones:** Motion
* **PWA:** `vite-plugin-pwa`

---

## 🚀 Instalación y Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   cd TU_REPOSITORIO
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compila para producción:
   ```bash
   npm run build
   ```
