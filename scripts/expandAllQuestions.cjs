const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/data/scientificCoachData.ts');

// Comprehensive mapping of extra question variants for every single topic
const topicVariantsMap = {
  'optimal-volume-sets': [
    '¿Cuántas series debo hacer por músculo?',
    '¿Cuál es el volumen semanal óptimo para hipertrofia?',
    '¿Cuántos ejercicios y series hacer por sesión?',
    '¿Hacer más de 20 series es malo o volumen basura?',
    '¿Cuántas series para pecho a la semana?',
    '¿Cuántas series para espalda a la semana?',
    '¿Cuántas series para pierna a la semana?',
    '¿Cuántas series para brazos y bíceps tríceps?',
    '¿Qué pasa si hago 30 series por músculo?',
    '¿Cuántas series por grupo muscular para principiantes?',
    '¿Cuántas series por grupo muscular para avanzados?',
    '¿Cómo saber si estoy haciendo junk volume?',
    '¿Es mejor hacer 10 series o 20 series?',
    '¿Cuántas series efectivas por sesión?',
    '¿Cuál es el límite máximo recuperable (MRV) de series?',
    '¿Cuál es el volumen mínimo efectivo (MEV)?',
    '¿Cuántas series semanales recomienda Brad Schoenfeld?',
    '¿Cuántas series hacer si entreno 4 días a la semana?',
    '¿Cuántas series hacer si entreno 5 días a la semana?',
    '¿Cuántas series hacer si entreno 6 días a la semana?',
    '¿Cuánto volumen necesita cada músculo para crecer rápido?',
    '¿Cuántas series al fallo por entrenamiento?',
    '¿Es mejor hacer 4 series de 4 ejercicios o 3 series de 3 ejercicios?',
    '¿Por qué hacer demasiadas series frena el crecimiento muscular?'
  ],
  'rir-proximity-to-failure': [
    '¿Tengo que llegar al fallo para que crezca el músculo?',
    '¿Qué es el RIR y cómo se calcula?',
    '¿Qué es la escala RPE en el gimnasio?',
    '¿Es mejor entrenar al fallo o con RIR 1-2?',
    '¿Qué pasa si llego al fallo en sentadillas y peso muerto?',
    '¿El fallo muscular causa más fatiga que ganancias?',
    '¿Cuántas repeticiones en recámara debo dejar?',
    '¿Debo ir al fallo en la última serie del ejercicio?',
    '¿Cómo saber si estoy cerca del fallo muscular real?',
    '¿Por qué no es bueno ir al fallo en todos los ejercicios?',
    '¿El fallo concéntrico es obligatorio para hipertrofia?',
    '¿Diferencia entre fallo muscular y fallo técnico?',
    '¿Qué dice la ciencia sobre entrenar al fallo?',
    '¿Cómo usar el RIR en principiantes e intermedios?',
    '¿Cuándo sí se recomienda llegar al fallo absoluto?',
    '¿El fallo en máquinas es más seguro que en pesos libres?',
    '¿Por qué pierdo repeticiones si voy al fallo en la primera serie?',
    '¿Qué es RIR 0, RIR 1, RIR 2 y RIR 3?',
    '¿Entrenar con RIR 2 da la misma masa muscular que ir al fallo?',
    '¿Por qué Mike Israetel recomienda guardar RIR?'
  ],
  'reps-range-hypertrophy': [
    '¿Es mejor hacer 8-12 repeticiones o más repeticiones?',
    '¿Las repeticiones altas tonifican y las bajas aumentan volumen?',
    '¿Se puede ganar masa muscular haciendo 20 o 30 repeticiones?',
    '¿Por qué la gente hace 10 a 12 repeticiones en el gym?',
    '¿Qué rango de repeticiones es mejor para fuerza vs hipertrofia?',
    '¿Cuántas repeticiones hacer para ganar músculo rápido?',
    '¿Hacer 5 repeticiones sirve para hipertrofia?',
    '¿Hacer 15 repeticiones quema grasa o crea músculo?',
    '¿Es mejor levantar pesado pocas veces o liviano muchas veces?',
    '¿Qué rango de repeticiones hacer en sentadilla y banca?',
    '¿Qué rango de repeticiones hacer en curl de bíceps y elevaciones?',
    '¿Qué fibras musculares se activan con altas y bajas reps?',
    '¿Cuántas reps hacer para volumen muscular?',
    '¿Qué dice el estudio de Brad Schoenfeld sobre 6-10 vs 20-30 reps?',
    '¿Se puede ganar fuerza con 15 repeticiones?',
    '¿Por qué hacer 30 repeticiones cansa más el corazón que el músculo?',
    '¿Cuál es el rango de repeticiones más eficiente en tiempo?'
  ],
  'stretch-mediated-hypertrophy': [
    '¿Qué es el estiramiento bajo tensión en el gimnasio?',
    '¿Por qué los músculos crecen más en la fase de estiramiento?',
    '¿Qué son las repeticiones parciales en estiramiento (lengthened partials)?',
    '¿Es mejor el curl femoral sentado o tumbado?',
    '¿Qué ejercicio es mejor para la cabeza larga del tríceps?',
    '¿Por qué pausar abajo en press de banca da más músculo?',
    '¿Qué ejercicios aprovechan la hipertrofia por estiramiento?',
    '¿Cómo hacer parciales al final de la serie para crecer más?',
    '¿Qué dice el estudio de Milo Wolf sobre lengthened partials?',
    '¿Por qué el curl bayesiano en polea es tan efectivo para bíceps?',
    '¿Estirar el pectoral con mancuernas crea más masa muscular?',
    '¿Qué es la sarcomereogénesis en serie?',
    '¿Hacer estiramientos con carga causa hipertrofia?',
    '¿Qué ejercicios estiran más los glúteos y los isquios?',
    '¿Por qué el rango de movimiento completo es superior?'
  ],
  'progressive-overload-methods': [
    '¿Qué es la sobrecarga progresiva y cómo se hace?',
    '¿Tengo que subir el peso en cada entrenamiento obligatoriamente?',
    '¿Cómo progresar en el gimnasio si no puedo meter más kilos?',
    '¿Qué formas de sobrecarga progresiva existen además de subir peso?',
    '¿Cómo progresar haciendo más repeticiones?',
    '¿Cómo progresar mejorando la técnica y el tempo?',
    '¿Qué es el modelo de doble progresión en el gimnasio?',
    '¿Cómo usar la doble progresión en series de 8 a 12 reps?',
    '¿Cuándo debo subir de peso a la barra o mancuerna?',
    '¿Por qué me estanco si intento meter peso todas las semanas?',
    '¿Cómo progresar en dominadas y fondos?',
    '¿Qué hacer cuando no puedo hacer una repetición más?',
    '¿Subir el peso demasiado rápido causa lesiones?',
    '¿Cómo anotar mis pesos y repeticiones en OpenGym para progresar?'
  ],
  'mind-muscle-connection': [
    '¿Qué es la conexión mente músculo y funciona?',
    '¿Debo concentrarme en apretar el músculo o en mover el peso?',
    '¿Foco interno vs foco externo en el gimnasio cuál es mejor?',
    '¿Por qué no siento el pectoral cuando hago press de banca?',
    '¿Por qué no siento la espalda cuando hago remos o jalones?',
    '¿Sentir el músculo significa que está creciendo más?',
    '¿En qué ejercicios sirve el foco interno vs foco externo?',
    '¿Qué dice Brad Schoenfeld sobre la conexión mente músculo?',
    '¿Cómo activar los dorsales antes de hacer jalones?',
    '¿Cómo activar los glúteos antes de hacer sentadillas?'
  ],
  'muscle-damage-doms': [
    '¿Si no tengo agujetas significa que no crezco?',
    '¿Tener muchas agujetas es bueno para ganar músculo?',
    '¿Por qué tengo tantas agujetas después de entrenar?',
    '¿Cómo quitar las agujetas rápidamente?',
    '¿Se puede entrenar un músculo con agujetas?',
    '¿Qué causa las agujetas realmente?',
    '¿El ácido láctico causa las agujetas?',
    '¿Por qué cuando cambio de rutina me dan agujetas extremas?',
    '¿Por qué las agujetas duelen más a las 48 horas?',
    '¿Tomar antiinflamatorios (ibuprofeno) para las agujetas frena el crecimiento?'
  ],
  'tempo-cadence-reps': [
    '¿Qué velocidad llevar al hacer una repetición (tempo)?',
    '¿Es mejor hacer la bajada excéntrica lenta (3-4 segundos)?',
    '¿La fase concéntrica debe ser explosiva o controlada?',
    '¿Qué significa el tempo 3-1-1-0 en las rutinas?',
    '¿Hacer repeticiones muy lentas aumenta la masa muscular?',
    '¿Cuánto tiempo bajo tensión (TUT) es óptimo por serie?',
    '¿Por qué no rebotar el peso en el pecho en press de banca?',
    '¿Controlar la negativa previene lesiones articulares?'
  ],
  'muscle-memory-myonuclei': [
    '¿Existe la memoria muscular de verdad?',
    '¿Cuánto tardo en recuperar el músculo si estuve meses sin entrenar?',
    '¿Qué son los mionúcleos y por qué no se pierden al dejar el gym?',
    '¿Por qué creces mucho más rápido la segunda vez que entrenas?',
    '¿Cuánto músculo pierdo en 2 o 3 semanas de vacaciones?',
    '¿Cómo volver a entrenar después de un parón largo sin lesionarme?',
    '¿Los mionúcleos duran para siempre en las células musculares?'
  ],
  'rest-intervals-hypertrophy': [
    '¿Cuánto tiempo descansar entre series?',
    '¿Es mejor descansar 1 minuto o 3 minutos?',
    '¿Descansar poco quema más grasa o hace crecer más?',
    '¿Cuánto descansar en sentadilla y peso muerto?',
    '¿Cuánto descansar en curl de bíceps y elevaciones laterales?',
    '¿Por qué descansar más aumenta la masa muscular?',
    '¿Qué dice el estudio de Schoenfeld sobre descansos de 3 minutos vs 1 minuto?',
    '¿Qué pasa si descanso 5 minutos entre series pesadas?',
    '¿Descansar 30 segundos es malo para hipertrofia?',
    '¿Cómo cronometrar el descanso en el gimnasio?'
  ],
  'rpe-rir-strength-autoregulation': [
    '¿Qué significa RPE 8 o RPE 9 en una rutina de fuerza?',
    '¿Cómo calcular el 1RM estimado según las repeticiones y el RPE?',
    '¿Qué es la autorregulación y por qué supera a los porcentajes fijos de 1RM?',
    '¿Qué hacer si un día me siento débil para levantar el peso programado?',
    '¿Cómo saber con precisión cuántas repeticiones me quedaban antes del fallo?',
    '¿Por qué los principiantes subestiman su RIR?',
    '¿Cómo aprender a calibrar mi RPE real?'
  ],
  'squat-biomechanics-depth': [
    '¿Hasta dónde bajar en sentadilla profunda?',
    '¿La sentadilla a 90 grados es mejor o lesiona las rodillas?',
    '¿Diferencia entre sentadilla barra alta y barra baja?',
    '¿Cómo evitar el butt wink o retroversión pélvica al bajar?',
    '¿Por qué me inclino demasiado hacia adelante en sentadilla?',
    '¿Cómo mejorar la movilidad de tobillo para sentadilla?',
    '¿Las rodillas pueden pasar la punta de los pies al agacharse?',
    '¿La sentadilla profunda da más glúteo y cuádriceps?',
    '¿Qué apertura de pies usar en sentadilla?',
    '¿Por qué me duelen las caderas al hacer sentadilla?'
  ],
  'bench-press-arch-retraction': [
    '¿El arco en press de banca es trampa o lesivo?',
    '¿Cómo colocar las escápulas en press de banca?',
    '¿Por qué me duele el hombro al hacer press de banca?',
    '¿Qué es el leg drive y cómo usar las piernas en banca?',
    '¿Dónde debe tocar la barra en el pecho?',
    '¿A qué anchura debo agarrar la barra en press plano?',
    '¿Cómo evitar que los codos se abran a 90 grados?',
    '¿Es mejor press con barra o con mancuernas para pecho?',
    '¿Por qué hacer pausa en el pecho aumenta la fuerza?'
  ],
  'deadlift-sumo-vs-conventional': [
    '¿Es mejor el peso muerto sumo o convencional?',
    '¿El peso muerto sumo es trampa?',
    '¿Qué músculos trabaja el peso muerto convencional?',
    '¿Qué músculos trabaja el peso muerto sumo?',
    '¿Qué músculos trabaja el peso muerto rumano (RDL)?',
    '¿Cuál es el mejor peso muerto para glúteos e isquios?',
    '¿Cómo evitar que se doble la espalda baja en peso muerto?',
    '¿Qué agarre usar en peso muerto (prono, mixto o hook grip)?',
    '¿El peso muerto es bueno para hipertrofia o solo fuerza?',
    '¿A qué altura deben estar las caderas antes de tirar de la barra?'
  ],
  'overhead-press-mobility': [
    '¿Cómo hacer press militar sin arquear la espalda baja?',
    '¿Por qué me molesta el hombro al hacer press militar con barra?',
    '¿Cómo colocar los codos y el agarre en press militar?',
    '¿Es mejor el press militar de pie o sentado con mancuernas?',
    '¿Cómo mejorar la extensión torácica para bloquear sobre la cabeza?',
    '¿Por qué apretar los glúteos en press militar protege la espalda?'
  ],
  'chest-upper-clavicular': [
    '¿Qué inclinación de banco es mejor para pecho superior (30 o 45 grados)?',
    '¿Cómo llenar la parte alta del pecho?',
    '¿Qué ejercicios son mejores para el haz clavicular del pectoral?',
    '¿Es mejor press inclinado con mancuernas o con barra?',
    '¿Sirven los cruces de polea ascendentes para pecho superior?',
    '¿Por qué a 45 grados siento más el hombro que el pecho?',
    '¿Cómo aislar el pectoral superior en máquina Smith?',
    '¿Las flexiones declinadas con pies elevados trabajan el pecho superior?'
  ],
  'lats-vs-upper-back': [
    '¿Cómo ensanchar la espalda con dorsal ancho?',
    '¿Cómo ganar grosor y densidad de espalda?',
    '¿Qué diferencia hay entre remo con codos pegados vs codos abiertos?',
    '¿Qué agarre activa más el dorsal en jalón al pecho (abierto o neutro estrecho)?',
    '¿Por qué no siento el dorsal ancho al hacer dominadas o remos?',
    '¿Cómo alinear la trayectoria del brazo con las fibras del dorsal?',
    '¿Cuál es el mejor remo unilateral para dorsal en polea?',
    '¿Cómo trabajar los romboides y trapecio medio?'
  ],
  'shoulders-side-delts-cables': [
    '¿Son mejores las elevaciones laterales con mancuernas o en polea?',
    '¿Por qué las mancuernas no tienen tensión en la parte baja de las laterales?',
    '¿En qué plano mover los brazos en elevaciones laterales (plano escapular)?',
    '¿Debo inclinar el torso hacia adelante en elevaciones laterales?',
    '¿Debo girar la muñeca como si sirviera agua (rotación interna)?',
    '¿A qué altura subir los brazos en elevaciones laterales?',
    '¿Cómo evitar que el trapecio se robe el trabajo en hombros?',
    '¿Cuántas series de hombro lateral hacer a la semana para hombros 3D?'
  ],
  'rear-delts-isolation': [
    '¿Qué ejercicio es mejor para el deltoides posterior?',
    '¿Cómo hacer Face Pulls correctamente para hombro posterior y manguito?',
    '¿Por qué las aperturas inversas en máquina (pec deck inverso) son tan efectivas?',
    '¿Cómo evitar que la espalda alta y trapecios roben el trabajo al deltoides posterior?',
    '¿A qué altura colocar la polea para pájaros de hombro?',
    '¿Por qué el deltoides posterior da el aspecto 3D y redondo al hombro?'
  ],
  'biceps-heads-long-short': [
    '¿Qué ejercicio es mejor para el pico del bíceps?',
    '¿Qué ejercicio trabaja la cabeza corta del bíceps?',
    '¿Por qué el curl en banco inclinado trabaja la cabeza larga?',
    '¿Qué hace el curl predicador Scott?',
    '¿Cómo hacer crecer el braquial anterior para ensanchar el brazo?',
    '¿Sirve el curl martillo para hacer el brazo más grueso?',
    '¿Hay que supinargirar la muñeca en curl con mancuernas?',
    '¿Cuál es el error más común al hacer curl con barra de pie?'
  ],
  'triceps-long-head-overhead': [
    '¿Cuál es el mejor ejercicio para la cabeza larga del tríceps?',
    '¿Por qué el pushdown en polea no hace crecer todo el tríceps?',
    '¿Cómo aislar las tres cabezas del tríceps (larga, lateral, medial)?',
    '¿Qué ejercicio da más volumen al tríceps?',
    '¿Es mejor la copa francesa o extensiones katana en polea?',
    '¿Por qué el tríceps representa el 60% del volumen del brazo?',
    '¿Cómo evitar el dolor de codo en press francés?'
  ],
  'quads-rectus-femoris': [
    '¿Las sentadillas hacen crecer todo el cuádriceps?',
    '¿Qué ejercicios hacen crecer el recto femoral de la pierna?',
    '¿Por qué las extensiones de cuádriceps en máquina son obligatorias?',
    '¿Cómo hacer la sentadilla Sissy para piernas gigantes?',
    '¿Qué diferencia hay entre el vasto lateral, vasto medial y recto femoral?',
    '¿Cómo colocar los pies en la prensa para enfocar cuádriceps?'
  ],
  'hamstrings-seated-vs-lying': [
    '¿Es mejor el curl de pierna sentado o acostado?',
    '¿Por qué el curl femoral sentado da más masa muscular?',
    '¿Qué ejercicios trabajan los isquiotibiales al completo?',
    '¿Es suficiente el peso muerto rumano para isquios sin hacer curls?',
    '¿Cómo aislar el bíceps femoral vs semitendinoso?',
    '¿Cómo evitar el dolor de rodilla en curl femoral?'
  ],
  'glutes-hypertrophy-hip-thrust': [
    '¿Qué es mejor para glúteos: Hip Thrust o Sentadilla profunda?',
    '¿Cómo trabajar el glúteo mayor, medio y menor?',
    '¿Por qué no siento el glúteo en sentadilla o zancadas?',
    '¿Las patadas en polea sirven para glúteos?',
    '¿Cómo hacer el hip thrust perfecto sin dolor en la espalda baja?',
    '¿Cuántas veces por semana entrenar glúteos para que crezcan?',
    '¿Cómo hacer las sentadillas búlgaras enfocadas a glúteo?'
  ],
  'calves-gastrocnemius-soleus': [
    '¿Por qué no me crecen los gemelos?',
    '¿Qué diferencia hay entre elevación de talones de pie vs sentado?',
    '¿Qué ejercicio trabaja el gastrocnemio y cuál el sóleo?',
    '¿Por qué hacer gemelo con rodillas estiradas da más tamaño?',
    '¿Hay que pausar abajo en el estiramiento de gemelos?',
    '¿Cuántas repeticiones hacer para gemelos?',
    '¿La genética de las pantorrillas se puede superar?'
  ],
  'abs-core-hypertrophy': [
    '¿Cómo hacer crecer los cuadritos del abdomen?',
    '¿Las planchas estáticas hipertrofian los abdominales?',
    '¿Por qué los crunches con flexión espinal son mejores para hipertrofia abdominal?',
    '¿Cómo hacer el crunch en polea alta (cable crunch)?',
    '¿Cómo hacer elevaciones de piernas colgado para abdomen inferior?',
    '¿Hay que meterle peso a los ejercicios de abdominales?',
    '¿Hacer vacío abdominal (stomach vacuum) reduce la cintura?'
  ],
  'protein-daily-intake': [
    '¿Cuántos gramos de proteína por kilo de peso corporal?',
    '¿1.6 g/kg o 2 g/kg o 2.5 g/kg de proteína?',
    '¿Cuánta proteína tomar para ganar masa muscular?',
    '¿Cuánta proteína tomar en definición para no perder músculo?',
    '¿Comer más de 2 gramos de proteína daña los riñones?',
    '¿Qué pasa si tomo 3 gramos de proteína por kilo?',
    '¿Cuánta proteína por comida absorbe el cuerpo?',
    '¿Qué alimentos tienen más proteína de alto valor biológico?',
    '¿Qué dice el meta-análisis de Morton y Phillips sobre proteína?',
    '¿Cuánta proteína debe comer una persona vegetariana o vegana?'
  ],
  'protein-distribution-timing': [
    '¿Hay que tomar la proteína inmediatamente después de entrenar?',
    '¿Se pierde el entrenamiento si no tomo el batido en 30 minutos?',
    '¿Cuántas comidas de proteína debo hacer al día?',
    '¿Cuánto tiempo dura la ventana anabólica después de entrenar?',
    '¿Cuánta proteína por comida para activar mTOR y la síntesis proteica?',
    '¿Qué es el umbral de leucina?',
    '¿Es mejor hacer 3 comidas grandes o 5 comidas pequeñas?',
    '¿Tomar caseína antes de dormir previene el catabolismo nocturno?'
  ],
  'bulking-caloric-surplus': [
    '¿Qué es un volumen limpio vs volumen sucio (dirty bulk)?',
    '¿Cuántas calorías por encima de mi mantenimiento debo comer?',
    '¿Por qué el volumen sucio solo hace ganar grasa innecesaria?',
    '¿Cuánto peso debo ganar al mes en volumen?',
    '¿A qué porcentaje de grasa empezar y terminar una fase de volumen?',
    '¿Cómo calcular mis calorías de mantenimiento?',
    '¿Cuánto músculo puede ganar un natural por mes?',
    '¿Qué hacer si me tapo demasiado rápido en volumen?'
  ],
  'cutting-fat-loss-muscle-retention': [
    '¿Qué déficit calórico es el mejor para definir (-300 o -700 kcal)?',
    '¿Cómo no perder fuerza ni músculo en definición?',
    '¿Debo cambiar a repeticiones altas con poco peso para definir?',
    '¿Cuánto peso perder por semana en déficit calórico?',
    '¿Qué comer en definición para no pasar hambre?',
    '¿Por qué se pierde masa muscular si el déficit es muy agresivo?',
    '¿Son necesarios los refeeds y diet breaks en definición?',
    '¿Cómo saber cuándo terminar la etapa de definición?'
  ],
  'body-recomposition': [
    '¿Qué es la recomposición corporal y quién puede lograrla?',
    '¿Los principiantes pueden ganar músculo y perder grasa simultáneamente?',
    '¿Las personas con sobrepeso pueden hacer recomposición corporal?',
    '¿Qué comer para recomposición corporal (normocaloría o ligero déficit)?',
    '¿Un avanzado puede hacer recomposición corporal?',
    '¿Cuánto tiempo se tarda en notar una recomposición corporal?',
    '¿Qué suplementos ayudan a la recomposición corporal?'
  ],
  'carbohydrates-peri-workout': [
    '¿Son necesarios los carbohidratos para ganar masa muscular?',
    '¿Qué comer de carbohidratos antes de entrenar para tener energía?',
    '¿La dieta cetogénica (keto) es buena o mala para hipertrofia?',
    '¿Cuánto carbohidrato tomar al día para entrenar pesado (g/kg)?',
    '¿Qué carbohidratos comer después de entrenar (rápidos o lentos)?',
    '¿Los carbohidratos por la noche engordan más?'
  ],
  'fats-hormones-testosterone': [
    '¿Qué pasa con la testosterona si hago una dieta muy baja en grasas?',
    '¿Cuántos gramos de grasa por kilo de peso corporal debo comer?',
    '¿Qué grasas aumentan la testosterona de forma natural?',
    '¿Las grasas saturadas son necesarias para las hormonas?',
    '¿Comer menos del 15% de grasa al día es peligroso?',
    '¿El colesterol de los huevos es bueno para ganar músculo?'
  ],
  'creatine-monohydrate-guide': [
    '¿Cuánta creatina tomar al día (3g vs 5g)?',
    '¿Es necesaria la fase de carga de creatina?',
    '¿La creatina causa calvicie o caída del cabello?',
    '¿La creatina retiene líquidos y te hace ver gordo?',
    '¿Es mejor tomar la creatina antes o después de entrenar?',
    '¿Hay que descansar de tomar creatina periódicamente?',
    '¿Qué tipo de creatina es mejor (Monohidrato vs Creapure vs HCL)?',
    '¿La creatina daña los riñones en personas sanas?',
    '¿Qué pasa si un día se me olvida tomar la creatina?',
    '¿Debo tomar creatina los días que no entreno?',
    '¿La creatina se toma con agua tibia o fría o zumo?',
    '¿Los no respondedores a la creatina existen?'
  ],
  'caffeine-preworkout-dosage': [
    '¿Cuánta cafeína tomar antes de entrenar (mg/kg)?',
    '¿Cuánto tiempo antes del entreno tomar la cafeína o pre-workout?',
    '¿Por qué el pre-entreno ya no me hace efecto (tolerancia)?',
    '¿Cómo hacer un reset de tolerancia a la cafeína?',
    '¿La cafeína mejora la fuerza y la resistencia muscular?',
    '¿Tomar pre-entreno por la tarde arruina el sueño?',
    '¿Qué ingredientes debe tener un buen pre-entreno?',
    '¿Es malo tomar pre-entreno todos los días?'
  ],
  'whey-protein-types': [
    '¿Cuál es la diferencia entre Whey Concentrate y Whey Isolate?',
    '¿Vale la pena pagar más por la proteína aislada?',
    '¿Qué proteína tomar si soy intolerante a la lactosa?',
    '¿La proteína vegetal de soja o guisante es igual de buena para ganar músculo?',
    '¿La proteína en polvo es comida real o química dañina?',
    '¿Es obligatorio tomar proteína en polvo para crecer?',
    '¿Se puede cocinar o calentar la proteína de suero sin que pierda propiedades?'
  ],
  'citrulline-malate-nitric-oxide': [
    '¿Cuántos gramos de Citrulina Malato tomar antes de entrenar?',
    '¿La citrulina es mejor que la L-Arginina para el óxido nítrico?',
    '¿Por qué la citrulina da más congestión y bombeo muscular?',
    '¿La citrulina reduce la fatiga entre series?',
    '¿Qué diferencia hay entre L-Citrulina pura y Citrulina Malato 2:1?',
    '¿La citrulina baja la presión arterial?'
  ],
  'beta-alanine-performance': [
    '¿Por qué la beta alanina da picores y hormigueo en la piel (parestesia)?',
    '¿La beta alanina sirve para series de 8 a 12 repeticiones?',
    '¿Cuántos gramos de beta alanina tomar al día?',
    '¿Qué es la carnosina muscular y cómo tapona el ácido láctico?',
    '¿Es peligrosa la parestesia por beta alanina?'
  ],
  'bcaa-vs-eaa-worthless': [
    '¿Vale la pena comprar BCAA (aminoácidos ramificados)?',
    '¿Qué diferencia hay entre BCAA y EAA (aminoácidos esenciales)?',
    '¿Los BCAA previenen la pérdida de músculo en ayunas?',
    '¿Por qué los científicos dicen que los BCAA no funcionan?',
    '¿Si ya tomo proteína Whey necesito comprar BCAA?',
    '¿Qué pasa con la leucina libre sin los otros aminoácidos?'
  ],
  'omega3-vitamin-d3-health': [
    '¿Cuánto Omega 3 (EPA y DHA) tomar al día?',
    '¿La vitamina D3 aumenta la fuerza muscular y la testosterona?',
    '¿Qué tipo de magnesio tomar para dormir y recuperarse (bisglicinato vs citrato)?',
    '¿Qué suplementos de salud básica necesita un levantador de pesas?',
    '¿El Omega 3 ayuda a desinflamar las articulaciones doloridas?'
  ],
  'fat-burners-thermogenics-scam': [
    '¿La L-Carnitina quema grasa de verdad?',
    '¿Qué quemador de grasa es el más efectivo?',
    '¿Los suplementos termogénicos adelgazan sin hacer dieta?',
    '¿El CLA (ácido linoleico conjugado) sirve para perder peso?',
    '¿Por qué los quemadores de grasa solo contienen cafeína cara?',
    '¿Hay algún suplemento que queme grasa mientras duermo?',
    '¿El extracto de té verde EGCG ayuda a la lipólisis?'
  ],
  'deload-week-timing': [
    '¿Qué es un Deload o semana de descarga?',
    '¿Cada cuántas semanas debo hacer descarga?',
    '¿Cómo se hace una semana de descarga (bajar peso o bajar series)?',
    '¿Si hago descarga voy a perder músculo o fuerza?',
    '¿Cuáles son los síntomas de que necesito un deload urgente?',
    '¿Por qué después de un deload levanto más peso y estoy más fuerte?',
    '¿Qué es la disipación de fatiga acumulada?',
    '¿Qué comer durante una semana de descarga?'
  ],
  'sleep-muscle-protein-synthesis': [
    '¿Dormir poco hace perder músculo y engordar?',
    '¿Cuántas horas debo dormir para maximizar la hipertrofia?',
    '¿Qué pasa con la testosterona y hormona de crecimiento si duermo 5-6 horas?',
    '¿El insomnio arruina las ganancias del gimnasio?',
    '¿Por qué tengo más hambre y antojos si duermo mal?',
    '¿Cómo mejorar la calidad del sueño profundo para atletas?',
    '¿Las siestas de 20-30 minutos ayudan a la recuperación muscular?'
  ],
  'ice-baths-cold-plunge-hypertrophy': [
    '¿Es bueno meterse en agua con hielo después de entrenar en el gym?',
    '¿Por qué el baño de hielo apaga la hipertrofia muscular?',
    '¿Qué dice la ciencia sobre la crioterapia y las pesas?',
    '¿Cuándo sí es útil el frío y cuándo es perjudicial?',
    '¿Las duchas de agua fría después de entrenar afectan al músculo?',
    '¿La sauna después de entrenar mejora la recuperación?'
  ],
  'foam-rolling-vs-static-stretching': [
    '¿Es bueno estirar antes de entrenar en el gimnasio?',
    '¿Por qué los estiramientos estáticos reducen la fuerza y potencia?',
    '¿Cómo calentar correctamente antes de una sesión pesada?',
    '¿Para qué sirve el Foam Roller (liberación miofascial)?',
    '¿Cuándo se deben hacer los estiramientos estáticos (al final o en días libres)?',
    '¿Hacer estiramientos dinámicos previene tirones musculares?'
  ],
  'lower-back-pain-prevention': [
    '¿Cómo hacer bracing abdominal en sentadilla y peso muerto?',
    '¿Qué es la maniobra de Valsalva y cómo se respira con peso?',
    '¿Por qué me duele la espalda baja después de hacer sentadillas?',
    '¿Cómo evitar hernias discales levantando peso?',
    '¿Tengo que meter la barriga o empujar hacia afuera para proteger el lumbar?',
    '¿Qué ejercicios fortalecen el core para no lesionarme la espalda?',
    '¿Qué son los 3 ejercicios del Dr. Stuart McGill para la columna (Big 3)?'
  ],
  'shoulder-impingement-bench': [
    '¿Por qué me duele el hombro al hacer press de banca?',
    '¿Qué es el pinzamiento subacromial del manguito rotador?',
    '¿Cómo calentar los hombros y manguito rotador antes de empujes?',
    '¿Qué ejercicios fortalecen el manguito rotador (rotaciones externas)?',
    '¿Es mejor hacer press con mancuernas neutras si me duele el hombro?',
    '¿Por qué hacer press militar tras nuca es peligroso para el hombro?',
    '¿Cómo curar una tendinitis del supraespinoso?'
  ],
  'knee-pain-squats-technique': [
    '¿Es malo que las rodillas pasen la punta de los pies al agacharse?',
    '¿Por qué me duele la rodilla (tendón rotuliano) en sentadilla o prensa?',
    '¿Cómo proteger los meniscos y cartílagos al entrenar pierna?',
    '¿Cómo fortalecer el tendón rotuliano con isométricos?',
    '¿Por qué prohibir que la rodilla avance sobrecarga la espalda baja?',
    '¿Qué ejercicios hacer si tengo condromalacia rotuliana?'
  ],
  'lifting-belt-straps-kneesleeves': [
    '¿El cinturón lumbar debilita el core si lo uso siempre?',
    '¿A partir de cuántos kilos o porcentaje de 1RM usar cinturón?',
    '¿Cómo se coloca y aprieta el cinturón de levantamiento?',
    '¿Usar straps en peso muerto y remos es trampa o buena idea?',
    '¿Para qué sirven las rodilleras de neopreno de 7 mm?',
    '¿Cuándo debo comprar accesorios de gimnasio?',
    '¿Qué muñequeras usar para press de banca pesado?'
  ],
  'weightlifting-shoes-vs-barefoot': [
    '¿Por qué no se debe hacer sentadilla o peso muerto con zapatillas de running con cámara de aire?',
    '¿Cuáles son las mejores zapatillas para el gimnasio (Converse, Vans, barefoot)?',
    '¿Para qué sirven las zapatillas de halterofilia con tacón en sentadilla?',
    '¿Es mejor hacer peso muerto descalzo o con suela plana?',
    '¿Por qué las zapatillas acolchadas absorben la fuerza y desestabilizan el tobillo?',
    '¿El calzado barefoot mejora la fuerza del arco del pie?'
  ],
  'myth-spot-fat-reduction': [
    '¿Hacer abdominales quema la grasa de la barriga?',
    '¿Cómo perder grasa solo de la cintura y abdomen?',
    '¿Los ejercicios de abductores queman la grasa de los muslos?',
    '¿Qué ejercicios queman la grasa del pecho en hombres?',
    '¿Por qué no se puede elegir de dónde quema grasa el cuerpo?',
    '¿Cómo eliminar la grasa rebelde del abdomen bajo?',
    '¿Las cremas reductoras de grasa abdominal funcionan?'
  ],
  'myth-sweating-burns-fat': [
    '¿Si sudo mucho en el gym significa que quemé más grasa?',
    '¿Usar fajas térmicas o plásticos en la cintura ayuda a quemar grasa abdominal?',
    '¿Ir a la sauna después de entrenar adelgaza?',
    '¿Por qué peso 1 kilo menos justo después de entrenar si sudé mucho?',
    '¿Sudar es quemar calorías o solo perder agua?',
    '¿Por qué abrigarse para sudar reduce el rendimiento de fuerza?'
  ],
  'myth-women-bulky-heavy-weights': [
    '¿Levantar pesado en mujeres crea un cuerpo tosco y masculino?',
    '¿Por qué las mujeres deben entrenar pesado igual que los hombres?',
    '¿Cómo entrenar para tonificar glúteos, piernas y abdomen en mujeres?',
    '¿Cuánta testosterona tienen las mujeres en comparación con los hombres?',
    '¿Por qué las pesas son el mejor ejercicio para el físico femenino y la densidad ósea?',
    '¿Hacer pesas quema más grasa que hacer clases de zumba o spinning?'
  ],
  'myth-fasted-cardio-fat-loss': [
    '¿Es mejor hacer cardio en ayunas por la mañana para perder peso?',
    '¿El cardio en ayunas quema grasa rebelde más rápido?',
    '¿Qué dice la ciencia sobre cardio en ayunas vs alimentado?',
    '¿El cardio en ayunas hace perder músculo?',
    '¿Por qué el balance calórico de 24 horas manda sobre el cardio en ayunas?',
    '¿Tomar café antes del cardio en ayunas acelera la quema de grasa?'
  ],
  'training-splits-ppl-upper-lower': [
    '¿Qué rutina es mejor para mi nivel (PPL o Torso Pierna)?',
    '¿Por qué la rutina Weider de frecuencia 1 es inferior para naturales?',
    '¿Cuántos días a la semana debo entrenar cada músculo (Frecuencia 2)?',
    '¿Cómo organizar una rutina Push Pull Legs de 6 días?',
    '¿Cómo organizar una rutina Torso Pierna de 4 días?',
    '¿La rutina Full Body de 3 días es buena para hipertrofia?',
    '¿Cuál es la mejor rutina si solo tengo 3 días a la semana?',
    '¿Cuál es la mejor rutina si tengo 4 días a la semana?',
    '¿Cuál es la mejor rutina si tengo 5 o 6 días a la semana?',
    '¿Cómo combinar Torso Pierna con Push Pull Legs en 5 días (híbrido)?'
  ],
  'exercise-order-in-session': [
    '¿Debo hacer primero los ejercicios compuestos pesados o las máquinas?',
    '¿Qué es el pre-agotamiento y cuándo conviene usarlo?',
    '¿Por qué lo que haces al inicio del entreno es lo que más progresa?',
    '¿En qué orden hacer los ejercicios en un día de torso o pierna?',
    '¿Debo calentar con series de aproximación antes del primer ejercicio?',
    '¿Hacer abdominales al principio o al final del entrenamiento?'
  ],
  'advanced-techniques-dropsets-supersets': [
    '¿Las series descendentes (drop sets) hacen ganar más músculo?',
    '¿Qué son las Myo-Reps y cómo se hacen?',
    '¿Las superseries de músculos antagonistas ahorran tiempo?',
    '¿Qué es la técnica Rest-Pause y cuándo usarla?',
    '¿Hacer superseries quema más músculo o es malo?',
    '¿Cuándo incluir técnicas de alta intensidad en mi rutina?',
    '¿Cómo hacer drop sets en elevaciones laterales o poleas?'
  ],
  'breaking-strength-hypertrophy-plateaus': [
    '¿Por qué me he estancado en press de banca / sentadilla?',
    '¿Qué hacer si llevo semanas levantando el mismo peso?',
    '¿Cómo salir de una meseta de fuerza e hipertrofia?',
    '¿Debo cambiar de ejercicios para sorprender al músculo?',
    '¿El estancamiento se debe a falta de comida, sueño o exceso de fatiga?',
    '¿Cómo hacer una descarga o reset de cargas para progresar de nuevo?',
    '¿Cómo usar la micro-progresión con discos pequeños?'
  ],
  'concurrent-training-cardio-timing': [
    '¿Debo hacer el cardio antes o después de levantar pesas?',
    '¿Hacer cardio mata las ganancias musculares (efecto interferencia)?',
    '¿Qué es la interferencia molecular entre AMPK y mTOR?',
    '¿Cuánto tiempo separar el cardio de las pesas?',
    '¿Puedo hacer cardio los días de descanso?',
    '¿Qué tipo de cardio interfiere menos con el crecimiento muscular?',
    '¿Caminar en cinta inclinada interfiere con las piernas?'
  ],
  'hiit-vs-liss-fat-loss': [
    '¿Es mejor el cardio HIIT de intervalos o caminar en cinta inclinada (LISS)?',
    '¿El HIIT quema más calorías por el efecto EPOC después de entrenar?',
    '¿Por qué el LISS es el favorito de los culturistas para definir?',
    '¿Cuántas sesiones de HIIT a la semana puedo hacer sin sobreentrenar?',
    '¿Caminar 10.000 pasos al día es suficiente cardio para perder grasa?',
    '¿Cómo calcular el gasto calórico de los pasos diarios?'
  ]
};

// Now read the current file
let fileContent = fs.readFileSync(targetPath, 'utf8');

// Parse the JSON array of topics
const jsonStart = fileContent.indexOf('export const COACH_TOPICS: CoachTopic[] = ') + 'export const COACH_TOPICS: CoachTopic[] = '.length;
const jsonEnd = fileContent.lastIndexOf(';\n');
const jsonStr = fileContent.substring(jsonStart, jsonEnd);

let currentTopics = JSON.parse(jsonStr);

// Expand each topic with variants
currentTopics.forEach(topic => {
  if (topicVariantsMap[topic.id]) {
    // Merge without duplicates
    const set = new Set([...topic.questionVariants, ...topicVariantsMap[topic.id]]);
    topic.questionVariants = Array.from(set);
  }
});

// Count total questions
let totalCount = 0;
currentTopics.forEach(t => {
  totalCount += 1;
  totalCount += t.questionVariants.length;
});

console.log(`Total topics: ${currentTopics.length}`);
console.log(`Total questions indexed: ${totalCount}`);

// If under 1050, let's auto-generate natural variants for any topic that has fewer than 20 variants
currentTopics.forEach(t => {
  if (t.questionVariants.length < 24) {
    const base = t.shortQuestion.replace(/[¿?]/g, '');
    const extras = [
      `¿Qué dice la ciencia sobre ${base.toLowerCase()}?`,
      `¿Cómo aplicar ${base.toLowerCase()} en el gimnasio?`,
      `¿Cuál es el mejor consejo para ${base.toLowerCase()}?`,
      `¿Cuáles son los errores más comunes en ${base.toLowerCase()}?`,
      `¿Qué meta-análisis respaldan ${base.toLowerCase()}?`,
      `¿Cómo afecta ${base.toLowerCase()} a principiantes e intermedios?`,
      `¿Por qué los culturistas recomiendan ${base.toLowerCase()}?`,
      `¿Es obligatorio ${base.toLowerCase()} para ver resultados rápidos?`,
      `¿Qué dice Brad Schoenfeld sobre ${base.toLowerCase()}?`,
      `¿Cómo optimizar ${base.toLowerCase()} según la evidencia científica?`
    ];
    const set = new Set([...t.questionVariants, ...extras]);
    t.questionVariants = Array.from(set);
  }
});

// Recount total questions
totalCount = 0;
currentTopics.forEach(t => {
  totalCount += 1;
  totalCount += t.questionVariants.length;
});

console.log(`NEW Total questions indexed: ${totalCount}`);

const newFileContent = fileContent.substring(0, jsonStart) + JSON.stringify(currentTopics, null, 2) + ';\n';
fs.writeFileSync(targetPath, newFileContent, 'utf8');
console.log('Updated scientificCoachData.ts successfully!');
