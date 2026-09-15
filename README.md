# 🏋️‍♂️ OpenGym • Diario & Biblioteca de Fitness Inteligente

Una Progressive Web App (**PWA**) ultra-rápida, moderna con estética **Minimalist iOS**, y 100% funcional **offline** para el registro de entrenamientos, consulta visual de técnica biomecánica, cálculo de fuerza y gestión de equipamiento.

---

## ✨ Características Principales

### 🧬 1. Selector Anatómico Muscular Interactivo
- Maniquí anatómico vectorial frontal y dorsal de alta precisión.
- Toca cualquier músculo (Pectorales, Dorsales, Deltoides, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos, Gemelos, Core, etc.) para filtrar al instante todos los ejercicios que lo estimulan.

### 🏢 2. "Mi Gimnasio" & Inventario de Máquinas
- Catálogo con fotos reales y nítidas de más de 30 máquinas específicas (Prensa 45°, Sentadilla Hack, Pec Deck, Jalón dorsal, Extensión de cuádriceps, Smith, etc.) y pesos libres.
- Filtro inteligente: activa **"Filtro de Gym"** para ver únicamente los ejercicios que puedes realizar con el material disponible en tu gimnasio o casa.
- Perfiles rápidos predefinidos (Gimnasio Comercial Completo, Gimnasio Básico, Casa con Mancuernas, Calistenia).

### 📚 3. Biblioteca de Más de 80 Ejercicios con Guía Visual Paso a Paso
- Demostración visual animada en alta definición para cada ejercicio.
- Instrucciones técnicas detalladas en español, músculos primarios y secundarios, consejos de seguridad para evitar lesiones y nivel de dificultad.

### ⚡ 4. Calculadora de Fuerza & Auto-Escáner de Historial
- Evaluación biomecánica flexible por patrones de movimiento: empuje horizontal, empuje vertical, tracción, dominante de rodilla y dominante de cadera.
- No te obliga a hacer solo los 4 básicos tradicionales: funciona con mancuernas, máquinas o barras.
- **Auto-Calcular desde mi Historial**: Escanea tus entrenamientos anteriores para encontrar tus mejores levantamientos, estimar tu 1RM, asignar tu nivel de fuerza (*Principiante, Novato, Intermedio, Avanzado, Élite*) y alertarte de posibles descompensaciones musculares.

### ⏱️ 5. Diario de Entrenamiento en Vivo (Workout Tracker)
- Registro de series con tipos específicos (**Normal, Calentamiento, Drop Set, Al Fallo**), peso en kg, repeticiones y RPE.
- Cronómetro de descanso flotante con avisos sonoros y vibración háptica.
- Calculadora de discos para barra olímpica y tabla de porcentajes 1RM (Epley).
- Celebración con confeti al finalizar la sesión.

### 💾 6. 100% Offline & PWA Instalable
- Toda la base de datos y la interfaz funcionan sin conexión a internet.
- Instalable como aplicación nativa en iOS (iPhone/iPad), Android, Windows y macOS.
- Exportación e importación de copias de seguridad en formato `.json`.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Vanilla CSS Moderno (Design tokens, iOS Minimalist palette, Glassmorphism, Micro-animaciones)
- **Iconografía**: Lucide React
- **PWA & Offline**: Vite PWA Plugin, Service Workers, Web App Manifest
- **Base de Datos de Ejercicios**: Integración verificada con `free-exercise-db`

---

## 🚀 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd APP_GYM

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```
