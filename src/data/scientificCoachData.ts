export interface CoachTopic {
  id: string;
  category: 'hypertrophy' | 'strength' | 'nutrition' | 'recovery' | 'biomechanics' | 'cardio';
  categoryLabel: string;
  question: string;
  shortQuestion: string;
  keywords: string[];
  summary: string;
  scientificEvidence: string;
  practicalAdvice: string[];
  keyStudies: string[];
  relatedQuestionIds: string[];
}

export const COACH_TOPICS: CoachTopic[] = [
  // ==========================================
  // --- 1. HIPERTROFIA & VOLUMEN DE ENTRENAMIENTO ---
  // ==========================================
  {
    id: 'optimal-volume-sets',
    category: 'hypertrophy',
    categoryLabel: '🔬 Hipertrofia & Volumen',
    question: '¿Cuántas series efectivas debo hacer por grupo muscular a la semana?',
    shortQuestion: '¿Cuántas series por músculo a la semana?',
    keywords: ['series', 'volumen', 'semana', 'cuantas', 'hipertrofia', 'sets', 'crecimiento'],
    summary: 'Para la gran mayoría de levantadores, el rango óptimo es de 10 a 20 series efectivas semanales por grupo muscular, repartidas en al menos 2 sesiones.',
    scientificEvidence: 'Los meta-análisis de referencia (Schoenfeld et al., 2017; Baz-Valle et al., 2022) demuestran una relación dosis-respuesta escalonada: <5 series semanales producen ganancias modestas, 5-9 series ofrecen ganancias intermedias, y 10-20 series maximizan el crecimiento. Superar 20-22 series suele entrar en la zona de "volumen basura" (junk volume), donde la fatiga supera la capacidad de recuperación del sistema nervioso y muscular.',
    practicalAdvice: [
      'Principiantes: 8 - 12 series efectivas semanales por grupo muscular.',
      'Intermedios / Avanzados: 12 - 18 series semanales.',
      'No hagas más de 8-10 series para un mismo músculo en una sola sesión; divide el volumen en 2 o 3 días para mayor calidad por serie.'
    ],
    keyStudies: [
      'Schoenfeld BJ, et al. (2017) "Dose-response relationship between weekly resistance training volume and increases in muscle mass." J Sports Sci.',
      'Baz-Valle E, et al. (2022) "A Systematic Review of The Effects of Different Resistance Training Volumes on Muscle Hypertrophy." J Hum Kinet.'
    ],
    relatedQuestionIds: ['rir-proximity-to-failure', 'training-frequency-split', 'deload-week-timing']
  },
  {
    id: 'rir-proximity-to-failure',
    category: 'hypertrophy',
    categoryLabel: '🔬 Hipertrofia & Volumen',
    question: '¿Es necesario llegar al fallo muscular absoluto en cada serie?',
    shortQuestion: '¿Llegar al fallo en cada serie o dejar RIR?',
    keywords: ['fallo', 'rir', 'rpe', 'fallo muscular', 'intensidad', 'proximidad', 'esfuerzo'],
    summary: 'No es necesario ni recomendable llegar al fallo en todas las series. Entrenar a 1-3 RIR (repeticiones en recámara) produce la misma hipertrofia con mucha menor fatiga neuromuscular.',
    scientificEvidence: 'La evidencia científica moderna (Robinson et al., 2023; Refalo et al., 2022) muestra que el reclutamiento de unidades motoras de alto umbral es prácticamente idéntico al entrenar con 1-3 RIR que llegando al fallo concéntrico total. El fallo absoluto en ejercicios multiarticulares pesados (como sentadilla o peso muerto) triplica la fatiga central y el daño muscular, comprometiendo el rendimiento en series y días posteriores.',
    practicalAdvice: [
      'Ejercicios multiarticulares básicos (Banca, Sentadilla, Peso Muerto, Remo): Entrena a RIR 1-3 (RPE 7-9) para máxima seguridad y calidad mecánica.',
      'Ejercicios de aislamiento en máquinas y poleas (Elevaciones laterales, Curl bíceps, Extensiones tríceps): Puedes llevar la última serie al fallo concéntrico (RIR 0).',
      'Si pierdes más del 30% de repeticiones entre series consecutivas, estás acumulando demasiada fatiga.'
    ],
    keyStudies: [
      'Robinson Z, et al. (2023) "Exploring the Proximity to Failure in Resistance Training: A Meta-Regression." Sports Med.',
      'Refalo MC, et al. (2022) "Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy." Sports Med.'
    ],
    relatedQuestionIds: ['optimal-volume-sets', 'rest-intervals-hypertrophy', 'reps-range-hypertrophy']
  },
  {
    id: 'reps-range-hypertrophy',
    category: 'hypertrophy',
    categoryLabel: '🔬 Hipertrofia & Volumen',
    question: '¿Cuál es el mejor rango de repeticiones para ganar masa muscular (6-12 o 15-30)?',
    shortQuestion: '¿Rango de repeticiones ideal (6-12 vs 15-30)?',
    keywords: ['repeticiones', 'rango', 'reps', 'hipertrofia', 'pesado', 'liviano', 'bombeo'],
    summary: 'Cualquier rango entre 5 y 30 repeticiones produce ganancias similares de masa muscular, SIEMPRE que se entrene cerca del fallo (RIR 0-3).',
    scientificEvidence: 'El estudio seminal de Schoenfeld et al. (2016) y revisiones posteriores compararon cargas pesadas (8-12 reps) frente a ligeras (25-35 reps) igualando el esfuerzo. Los resultados mostraron una hipertrofia equivalente en fibras tipo I y II. Sin embargo, las series de 6-12 reps son más eficientes en tiempo y producen menor fatiga cardiovascular/metabólica que series de 25-30 reps.',
    practicalAdvice: [
      'Ejercicios básicos multiarticulares: 6 - 10 repeticiones (fuerza y tensión mecánica).',
      'Ejercicios con mancuernas y máquinas: 8 - 15 repeticiones (equilibrio óptimo fatiga/estímulo).',
      'Ejercicios de aislamiento, brazos y gemelos: 12 - 20 repeticiones (estrés metabólico y bombeo).',
      'Variar rangos a lo largo del mesestimula diferentes vías moleculares de señalización (mTOR).'
    ],
    keyStudies: [
      'Schoenfeld BJ, et al. (2016) "Differential Effects of Heavy Versus Moderate Loads on Measures of Strength and Hypertrophy." J Sports Sci Med.'
    ],
    relatedQuestionIds: ['stretch-mediated-hypertrophy', 'optimal-volume-sets', 'rir-proximity-to-failure']
  },
  {
    id: 'stretch-mediated-hypertrophy',
    category: 'hypertrophy',
    categoryLabel: '🔬 Hipertrofia & Volumen',
    question: '¿Qué es la hipertrofia mediada por estiramiento (Long Muscle Lengths)?',
    shortQuestion: '¿Qué ejercicios crecen más con estiramiento?',
    keywords: ['estiramiento', 'longitudes largas', 'rom', 'rango de movimiento', 'isquios', 'triceps', 'biceps', 'pectoral'],
    summary: 'Entrenar con énfasis en la posición de máximo estiramiento bajo tensión desencadena mayor señalización anabólica y crecimiento muscular por sarcómeros en serie.',
    scientificEvidence: 'Múltiples estudios recientes (Pedrosa et al., 2022; Wolf et al., 2023; Maeo et al., 2021) han demostrado que los ejercicios que sobrecargan el músculo cuando está totalmente elongado producen significativamente más hipertrofia que aquellos que solo tienen tensión en la contracción corta. Ejemplos claros: el curl femoral sentado supera al tumbado porque los isquiotibiales se estiran más en la cadera; las extensiones de tríceps sobre la cabeza superan a los pushdowns en polea para la cabeza larga.',
    practicalAdvice: [
      'Pectoral: Pausa de 1 segundo en el punto bajo del press con mancuernas o aperturas.',
      'Isquiotibiales: Prioriza el Curl Femoral Sentado y el Peso Muerto Rumano sobre el curl tumbado.',
      'Tríceps: Incluye extensiones por encima de la cabeza (en polea o con mancuerna) para la cabeza larga.',
      'Bíceps: Realiza Curl en banco inclinado o Curl en banco Scott/predicador.',
      'Dorsales: Asegúrate de extender los brazos por completo en cada jalón y remo.'
    ],
    keyStudies: [
      'Wolf M, et al. (2023) "Lengthened Partials and Muscle Growth: A Systematic Review and Meta-Analysis." SportRxiv.',
      'Pedrosa GF, et al. (2022) "Partial range of motion training in lengthened muscle position improves muscle hypertrophy." Eur J Sport Sci.'
    ],
    relatedQuestionIds: ['reps-range-hypertrophy', 'rir-proximity-to-failure', 'optimal-volume-sets']
  },

  // ==========================================
  // --- 2. FUERZA & SOBRECARGA PROGRESIVA ---
  // ==========================================
  {
    id: 'progressive-overload-principles',
    category: 'strength',
    categoryLabel: '⚡ Fuerza & Sobrecarga',
    question: '¿Cómo aplicar la sobrecarga progresiva correctamente sin estancarme?',
    shortQuestion: '¿Cómo aplicar sobrecarga progresiva real?',
    keywords: ['sobrecarga', 'progresiva', 'estancamiento', 'subir peso', 'progresion', 'fuerza'],
    summary: 'La sobrecarga progresiva no significa únicamente subir peso a la barra; también incluye añadir repeticiones, series de calidad, mejorar la técnica y controlar el tempo excéntrico.',
    scientificEvidence: 'El principio de sobrecarga progresiva (Kraemer & Ratamess, ACSM Guidelines) dicta que el sistema neuromuscular debe someterse a demandas crecientes para continuar adaptándose. Usar el sistema de "Doble Progresión" (Double Progression) es el método con mayor soporte científico para hipertrofia: primero aumentas repeticiones dentro de un rango objetivo (ej: de 8 a 12 reps) con el mismo peso, y una vez alcanzado el tope superior, incrementas el peso un 2-5% y vuelves a empezar en 8 reps.',
    practicalAdvice: [
      'Paso 1 (Doble Progresión): Fija un rango (ej: 8-12 reps). Si haces 4x8 con 60kg, tu meta en la siguiente sesión es sacar 9 o 10 reps con 60kg.',
      'Paso 2: Cuando logres 4x12 con 60kg con buena técnica, sube a 62.5kg y vuelve a empezar en 8 reps.',
      'Lleva un registro estricto en OpenGym de tus pesos y repeticiones sesión a sesión.',
      'Si un día no puedes subir repeticiones, añade una pausa isométrica de 1 segundo en el estiramiento.'
    ],
    keyStudies: [
      'Kraemer WJ, Ratamess NA. (2004) "Fundamentals of resistance training: progression and exercise prescription." Med Sci Sports Exerc.'
    ],
    relatedQuestionIds: ['rest-intervals-hypertrophy', 'deload-week-timing', 'optimal-volume-sets']
  },
  {
    id: 'rest-intervals-hypertrophy',
    category: 'strength',
    categoryLabel: '⚡ Fuerza & Sobrecarga',
    question: '¿Cuánto tiempo debo descansar entre series (1 minuto vs 3 minutos)?',
    shortQuestion: '¿Cuánto tiempo descansar entre series?',
    keywords: ['descanso', 'tiempo', 'minutos', 'cronometro', 'recuperacion', 'series'],
    summary: 'Descansar entre 2 y 3 minutos en ejercicios compuestos produce significativamente más músculo y fuerza que descansos cortos de 1 minuto.',
    scientificEvidence: 'En el ensayo clínico de Schoenfeld et al. (2016), levantadores entrenados que descansaron 3 minutos ganaron significativamente más fuerza máxima (1RM) y mayor volumen muscular que aquellos que descansaron solo 1 minuto con el mismo volumen programado. Los descansos más largos permiten disipar la fatiga del sistema nervioso central y reponer las reservas de fosfocreatina (PCr) celular en más de un 85-90%.',
    practicalAdvice: [
      'Ejercicios compuestos pesados (Sentadilla, Banca, Peso Muerto, Prensa): 2.5 a 3.5 minutos de descanso.',
      'Ejercicios con mancuernas y poleas multiarticulares: 1.5 a 2 minutos.',
      'Aislamiento de brazos, hombros laterales y gemelos: 1 a 1.5 minutos.',
      'Usa el cronómetro flotante integrado en OpenGym para asegurar descansos consistentes.'
    ],
    keyStudies: [
      'Schoenfeld BJ, et al. (2016) "Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy in Resistance-Trained Men." J Strength Cond Res.'
    ],
    relatedQuestionIds: ['optimal-volume-sets', 'progressive-overload-principles', 'rir-proximity-to-failure']
  },

  // ==========================================
  // --- 3. NUTRICIÓN & SUPLEMENTACIÓN CON EVIDENCIA ---
  // ==========================================
  {
    id: 'protein-daily-intake',
    category: 'nutrition',
    categoryLabel: '🥗 Nutrición & Suplementos',
    question: '¿Cuánta proteína necesito consumir al día para ganar músculo de forma óptima?',
    shortQuestion: '¿Cuánta proteína al día por kg de peso?',
    keywords: ['proteina', 'gramos', 'nutricion', 'dieta', 'gramos por kilo', 'macros'],
    summary: 'La ingesta óptima respaldada por la ciencia es de 1.6 a 2.2 gramos de proteína por kilogramo de peso corporal al día, distribuida en 3 a 5 tomas.',
    scientificEvidence: 'El meta-análisis más grande jamás realizado sobre suplementación proteica (Morton et al., 2018, British Journal of Sports Medicine, 49 estudios, 1863 participantes) concluyó que la síntesis de proteína muscular alcanza una meseta en 1.62 g/kg/día. Consumir hasta 2.2 g/kg/día ofrece un margen de seguridad ideal, especialmente durante etapas de déficit calórico (definición) para preservar masa magra.',
    practicalAdvice: [
      'Regla simple: Multiplica tu peso en kg por 1.8 - 2.0 (ej: 75 kg x 2.0 = 150g de proteína/día).',
      'Distribución: Reparte la proteína en 3 a 4 comidas con 30-45g por toma para estimular picos periódicos de leucina y síntesis proteica (MPS).',
      'Fuentes de alta calidad: Huevos, pollo, ternera magra, pescado, lácteos/queso batido, legumbres, tofu y proteína de suero (whey).'
    ],
    keyStudies: [
      'Morton RW, et al. (2018) "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults." Br J Sports Med.'
    ],
    relatedQuestionIds: ['creatine-monohydrate-guide', 'calorie-surplus-deficit', 'pre-workout-caffeine']
  },
  {
    id: 'creatine-monohydrate-guide',
    category: 'nutrition',
    categoryLabel: '🥗 Nutrición & Suplementos',
    question: '¿Cómo tomar la creatina monohidrato y qué beneficios reales tiene según la ciencia?',
    shortQuestion: '¿Cómo tomar creatina (dosis, mitos y efectos)?',
    keywords: ['creatina', 'monohidrato', 'dosis', 'suplemento', 'fase de carga', 'agua'],
    summary: 'La creatina monohidrato es el suplemento más investigado y seguro del mundo. Toma de 3 a 5 gramos diarios todos los días, a cualquier hora, sin necesidad de fase de carga.',
    scientificEvidence: 'La posición oficial de la Sociedad Internacional de Nutrición Deportiva (ISSN, Kreider et al., 2017) confirma que la creatina monohidrato satura los depósitos intracelulares de fosfocreatina en el músculo esquelético, mejorando la potencia anaeróbica en un 10-15%, aumentando la fuerza máxima y acelerando la ganancia de masa libre de grasa. No causa daño renal en personas sanas ni caída del cabello.',
    practicalAdvice: [
      'Dosis diaria estándar: 3 a 5 gramos al día (o 0.08 g/kg de peso).',
      'Consistencia: Tómala todos los días, incluso los días que no entrenas (funciona por acumulación celular).',
      'Momento: Es indiferente, aunque tomarla con una comida con carbohidratos/proteína puede mejorar ligeramente su absorción.',
      'No gastes dinero en formas caras (hcl, etil-éster); el monohidrato de creatina (Creapure o estándar 200 mesh) es el más biodisponible y económico.'
    ],
    keyStudies: [
      'Kreider RB, et al. (2017) "International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine." J Int Soc Sports Nutr.'
    ],
    relatedQuestionIds: ['protein-daily-intake', 'calorie-surplus-deficit', 'pre-workout-caffeine']
  },
  {
    id: 'calorie-surplus-deficit',
    category: 'nutrition',
    categoryLabel: '🥗 Nutrición & Suplementos',
    question: '¿Cuánto superávit o déficit calórico necesito para volumen o definición?',
    shortQuestion: '¿Calorías para volumen vs definición?',
    keywords: ['calorias', 'superavit', 'deficit', 'volumen', 'definicion', 'grasa', 'peso'],
    summary: 'Para volumen limpio: superávit moderado de +200 a +350 kcal/día (+1-1.5% peso corporal al mes). Para definición: déficit de -300 a -500 kcal/día (-0.5-1% peso/semana).',
    scientificEvidence: 'Estudios de balance energético (Helms et al., 2014; Garthe et al., 2011) demostraron que superávits agresivos (+800 kcal) no generan más masa muscular que superávits moderados (+300 kcal), pero sí provocan hasta 3 veces más acumulación de tejido adiposo. En definición, un déficit moderado del 15-20% por debajo de mantenimiento conserva prácticamente el 100% de la masa muscular si se mantiene el entrenamiento pesado y alta proteína.',
    practicalAdvice: [
      'Volumen (Ganancia Muscular): Apunta a subir entre 0.8 y 1.5 kg al mes en la báscula.',
      'Definición (Pérdida de Grasa): Apunta a perder entre 0.4 y 0.8 kg a la semana.',
      'Pésate 3-4 mañanas por semana en ayunas y utiliza el promedio semanal para ajustar calorías.'
    ],
    keyStudies: [
      'Helms ER, et al. (2014) "Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation." J Int Soc Sports Nutr.',
      'Garthe I, et al. (2011) "Effect of two different weight-loss rates on body composition and strength." Int J Sport Nutr Exerc Metab.'
    ],
    relatedQuestionIds: ['protein-daily-intake', 'creatine-monohydrate-guide', 'deload-week-timing']
  },

  // ==========================================
  // --- 4. RECUPERACIÓN, SUEÑO & DELOAD ---
  // ==========================================
  {
    id: 'deload-week-timing',
    category: 'recovery',
    categoryLabel: '🛌 Recuperación & Descarga',
    question: '¿Qué es una semana de descarga (Deload) y cuándo debo hacerla?',
    shortQuestion: '¿Cuándo y cómo hacer una semana de descarga (Deload)?',
    keywords: ['descarga', 'deload', 'semana', 'descanso', 'fatiga', 'estancamiento', 'articulaciones'],
    summary: 'Un deload es una semana de entrenamiento reducido (50% menos volumen o RIR 3-4) cada 5-8 semanas para disipar fatiga sistémica y prevenir sobreentrenamiento.',
    scientificEvidence: 'La fatiga acumulada en tendones, ligamentos y sistema nervioso simpático crece con el entrenamiento continuo de alta intensidad (Israetel et al., 2020; Pritchard et al., 2015). Durante la descarga, el fitness acumulado se "desenmascara" gracias a la caída exponencial de la fatiga (modelo Fitness-Fatiga de Banister), permitiendo volver con mayores picos de fuerza y resensibilización muscular.',
    practicalAdvice: [
      'Señales de que necesitas un deload: Estancamiento en cargas durante 2 semanas, fatiga al despertar, dolores articulares leves o desmotivación.',
      'Cómo ejecutarlo: Mantén los mismos ejercicios y el mismo peso, pero haz solo la MITAD de series (ej: si hacías 4 series, haz 2) y quédate a 3-4 RIR del fallo.',
      'Frecuencia: Cada 6 a 10 semanas de entrenamiento intenso y progresivo.'
    ],
    keyStudies: [
      'Pritchard C, et al. (2015) "Tapering Practices in Strength and Power Athletes." Sports Med.'
    ],
    relatedQuestionIds: ['optimal-volume-sets', 'progressive-overload-principles', 'sleep-muscle-growth']
  },
  {
    id: 'sleep-muscle-growth',
    category: 'recovery',
    categoryLabel: '🛌 Recuperación & Descarga',
    question: '¿Cómo afecta el sueño al crecimiento muscular y a la quema de grasa?',
    shortQuestion: '¿Por qué el sueño es clave para el músculo?',
    keywords: ['sueño', 'dormir', 'horas', 'hormonas', 'testosterona', 'recuperacion', 'cortisol'],
    summary: 'Dormir menos de 7 horas reduce la síntesis proteica, disminuye la testosterona hasta un 15% y provoca que hasta el 80% del peso perdido en déficit sea músculo en vez de grasa.',
    scientificEvidence: 'El estudio clínico de Nedeltcheva et al. (Annals of Internal Medicine) comparó 8.5 horas vs 5.5 horas de sueño con idéntico déficit calórico: el grupo con privación de sueño perdió un 60% menos de grasa y un 50% más de masa muscular. Además, Dattilo et al. (2011) demostraron que la falta crónica de sueño eleva el cortisol catabólico y reduce la hormona de crecimiento (GH) y el factor IGF-1.',
    practicalAdvice: [
      'Prioriza entre 7.5 y 9 horas de sueño nocturno de calidad.',
      'Evita pantallas y luz azul 45 minutos antes de dormir o usa modo nocturno.',
      'Mantén la habitación fresca (18-20°C) y completamente a oscuras.',
      'Evita consumir cafeína después de las 16:00 (su vida media es de 5 a 8 horas).'
    ],
    keyStudies: [
      'Nedeltcheva AV, et al. (2010) "Insufficient sleep undermines dietary efforts to reduce adiposity." Ann Intern Med.',
      'Dattilo M, et al. (2011) "Sleep and muscle recovery: endocrinological and molecular basis." Med Hypotheses.'
    ],
    relatedQuestionIds: ['deload-week-timing', 'protein-daily-intake', 'calorie-surplus-deficit']
  },
  {
    id: 'training-frequency-split',
    category: 'recovery',
    categoryLabel: '🛌 Recuperación & Descarga',
    question: '¿Es mejor entrenar cada músculo 1 vez por semana (Weider) o 2 veces (Frecuencia 2)?',
    shortQuestion: '¿Frecuencia 2 vs Frecuencia 1 por semana?',
    keywords: ['frecuencia', 'split', 'ppl', 'torso pierna', 'weider', 'dias', 'rutina'],
    summary: 'Entrenar cada músculo 2 veces por semana supera a 1 vez por semana porque mantiene la síntesis proteica elevada y permite mayor calidad por serie.',
    scientificEvidence: 'El meta-análisis de Schoenfeld et al. (2016) sobre frecuencia de entrenamiento concluyó que una frecuencia de 2 veces por semana por grupo muscular produce significativamente mayor hipertrofia que 1 vez por semana, incluso igualando el volumen total. La síntesis de proteína muscular tras una sesión solo dura entre 24 y 48 horas en sujetos entrenados; por tanto, estimular el músculo cada 3-4 días maximiza los días semanales en estado anabólico.',
    practicalAdvice: [
      'Rutinas recomendadas Frecuencia 2: Push / Pull / Legs (Empuje, Tracción, Pierna 2x), Torso / Pierna (4 días/semana) o Full Body (3 días/semana).',
      'En vez de hacer 16 series de pecho el lunes, haz 8 series el lunes y 8 series el jueves para rendir con más fuerza en cada serie.'
    ],
    keyStudies: [
      'Schoenfeld BJ, et al. (2016) "Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis." Sports Med.'
    ],
    relatedQuestionIds: ['optimal-volume-sets', 'progressive-overload-principles', 'stretch-mediated-hypertrophy']
  },

  // ==========================================
  // --- 5. BIOMECÁNICA & SALUD ARTICULAR ---
  // ==========================================
  {
    id: 'warmup-scientific-protocol',
    category: 'biomechanics',
    categoryLabel: '🛡️ Biomecánica & Articulaciones',
    question: '¿Cómo calentar correctamente para levantar más peso y prevenir lesiones?',
    shortQuestion: '¿Protocolo de calentamiento eficiente antes de levantar?',
    keywords: ['calentamiento', 'calentar', 'lesiones', 'estiramientos', 'hombro', 'movilidad'],
    summary: 'Evita estiramientos estáticos largos antes de levantar; realiza movilidad articular dinámica y series de aproximación progresiva en pirámide.',
    scientificEvidence: 'Los meta-análisis sobre estiramiento pre-ejercicio (Simic et al., 2013) demuestran que el estiramiento estático sostenido (>45s) reduce temporalmente la fuerza máxima y la potencia muscular en un 5-8% debido a relajación viscoelástica del tendón. El protocolo RAMP (Raise, Activate, Mobilize, Potentiate) aumenta la temperatura intramuscular, mejora la velocidad de conducción nerviosa y lubrica las articulaciones con líquido sinovial sin generar fatiga.',
    practicalAdvice: [
      'Paso 1: 3-5 minutos de movilidad dinámica (rotaciones de hombro, apertura de cadera, sentadillas al aire).',
      'Paso 2 (Series de Aproximación en el 1er ejercicio):',
      '  • Serie 1: 50% de tu peso de trabajo x 5 reps (muy fácil)',
      '  • Serie 2: 70% x 3 reps (ligero)',
      '  • Serie 3: 85-90% x 1 rep (potenciación neuromuscular sin fatiga)',
      'Paso 3: Descansa 2 minutos e inicia tus series efectivas al 100%.'
    ],
    keyStudies: [
      'Simic L, et al. (2013) "Does pre-exercise static stretching inhibit maximal muscular performance? A meta-analytical review." Scand J Med Sci Sports.'
    ],
    relatedQuestionIds: ['shoulder-pain-bench-press', 'rest-intervals-hypertrophy', 'progressive-overload-principles']
  },
  {
    id: 'shoulder-pain-bench-press',
    category: 'biomechanics',
    categoryLabel: '🛡️ Biomecánica & Articulaciones',
    question: '¿Cómo evitar el dolor de hombro en el press de banca?',
    shortQuestion: '¿Cómo proteger los hombros en press banca?',
    keywords: ['hombro', 'dolor', 'press banca', 'lesion', 'manguito', 'rotador', 'escapulas'],
    summary: 'Aplica retracción y depresión escapular constante, mantén los codos a 45-75° (no a 90°) y apoya los pies firmemente en el suelo.',
    scientificEvidence: 'La abducción del hombro a 90° con rotación interna ("estilo guillotina") comprime el tendón del supraespinoso y la bursa subacromial contra el arco coracoacromial (impingement subacromial). Meter los codos a unos 60-70° y crear un arco torácico fisiológico con escápulas retraídas despeja el espacio subacromial y coloca el pectoral mayor en su mejor línea de tracción biomecánica.',
    practicalAdvice: [
      'Junta las escápulas atrás y abajo ("guárdalas en los bolsillos traseros") antes de sacar la barra.',
      'Toca la parte media o inferior del esternón, no el cuello ni las clavículas.',
      'Si persiste molestia con barra, cambia temporalmente a press con mancuernas con agarre semi-neutro o press en máquina convergente.'
    ],
    keyStudies: [
      'Bengtsson V, et al. (2018) "Narrative review of injuries in powerlifting with special reference to their association to the squat, bench press and deadlift." BMJ Open Sport Exerc Med.'
    ],
    relatedQuestionIds: ['warmup-scientific-protocol', 'stretch-mediated-hypertrophy', 'optimal-volume-sets']
  },

  // ==========================================
  // --- 6. CARDIO & MASA MUSCULAR ---
  // ==========================================
  {
    id: 'cardio-interference-effect',
    category: 'cardio',
    categoryLabel: '🏃 Cardio & Concurrencia',
    question: '¿El cardio quema o perjudica la ganancia de masa muscular (efecto interferencia)?',
    shortQuestion: '¿El cardio perjudica la masa muscular?',
    keywords: ['cardio', 'interferencia', 'correr', 'bici', 'caminar', 'masa muscular', 'hiit', 'liss'],
    summary: 'El cardio de bajo impacto (caminar en pendiente, bici estática) NO perjudica la masa muscular si se realiza después de las pesas o en días separados.',
    scientificEvidence: 'El "efecto de interferencia" molecular (activación de AMPK vs mTOR) ocurre principalmente con cardio de alto impacto y alta frecuencia (correr en asfalto >4 días/semana) o al hacer cardio intenso antes de las pesas. El meta-análisis de Schumann et al. (2022, Sports Medicine) concluyó que el entrenamiento concurrente no atenúa la hipertrofia muscular ni la fuerza cuando el cardio es de bajo impacto (ciclismo, caminata) y se programa con separación horaria.',
    practicalAdvice: [
      'Mejor opción: Caminata inclinada en cinta (LISS) o 8,000 - 10,000 pasos diarios.',
      'Si haces cardio el mismo día de pesas, hazlo SIEMPRE después del entrenamiento de fuerza o con al menos 6 horas de separación.',
      'Limita el cardio intenso a 2-3 sesiones semanales de 20-30 minutos para no restar energía a los levantamientos pesados.'
    ],
    keyStudies: [
      'Schumann M, et al. (2022) "Compatibility of Concurrent Aerobic and Strength Training for Skeletal Muscle Size and Maximal Strength: A Systematic Review and Meta-Analysis." Sports Med.'
    ],
    relatedQuestionIds: ['calorie-surplus-deficit', 'sleep-muscle-growth', 'optimal-volume-sets']
  }
];
