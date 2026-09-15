export type MuscleGroup =
  | 'chest' // Pectorales
  | 'lats' // Dorsales
  | 'middle back' // Espalda media / Romboides
  | 'lower back' // Lumbar
  | 'traps' // Trapecios
  | 'shoulders' // Hombros / Deltoides
  | 'biceps' // Bíceps
  | 'triceps' // Tríceps
  | 'forearms' // Antebrazos
  | 'quadriceps' // Cuádriceps
  | 'hamstrings' // Isquiotibiales / Femorales
  | 'glutes' // Glúteos
  | 'calves' // Gemelos
  | 'abdominals' // Abdominales
  | 'obliques' // Oblicuos
  | 'adductors' // Aductores
  | 'abductors' // Abductores
  | 'neck' // Cuello
  | 'full body'; // Cuerpo completo

export type EquipmentType =
  | 'barbell' // Barra olímpica / recta
  | 'dumbbell' // Mancuernas
  | 'ez_bar' // Barra Z / EZ
  | 'trap_bar' // Barra hexagonal
  | 'kettlebell' // Pesas rusas
  | 'cable' // Torre de poleas general
  | 'cable_crossover_machine' // Cruce de poleas doble
  | 'smith_machine' // Multipower / Smith
  | 'chest_press_machine' // Máquina de press de pecho
  | 'pec_deck_machine' // Contractor / Pec Deck
  | 'lat_pulldown_machine' // Máquina jalón al pecho
  | 'seated_row_machine' // Remo en polea / máquina
  | 'shoulder_press_machine' // Máquina press de hombro
  | 'lateral_raise_machine' // Máquina elevaciones laterales
  | 'leg_press' // Prensa de piernas 45°
  | 'hack_squat_machine' // Sentadilla Hack
  | 'leg_extension_machine' // Extensión de cuádriceps
  | 'leg_curl_machine' // Curl femoral máquina
  | 'hip_thrust_machine' // Máquina de Hip Thrust
  | 'adductor_abductor_machine' // Máquina aductores / abductores
  | 'calf_raise_machine' // Máquina de gemelos
  | 'assisted_pullup_machine' // Máquina dominadas asistidas
  | 'machine' // Máquina general / palancas
  | 'bodyweight' // Peso corporal
  | 'pull_up_bar' // Barra de dominadas
  | 'dip_station' // Barras de fondos
  | 'bench' // Banco ajustable
  | 'preacher_curl_bench' // Banco Scott / Predicador
  | 'hyperextension_bench' // Banco Romano hiperextensiones
  | 'bands' // Bandas de resistencia
  | 'exercise_ball' // Fitball
  | 'other';

export type ExerciseLevel = 'beginner' | 'intermediate' | 'expert';
export type ExerciseCategory = 'strength' | 'hypertrophy' | 'calisthenics' | 'cardio' | 'stretching' | 'powerlifting';

export interface Exercise {
  id: string;
  name: string;
  nameEs: string;
  aliases?: string[];
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  category: ExerciseCategory;
  level: ExerciseLevel;
  instructions: string[];
  instructionsEs: string[];
  tips?: string[];
  images: string[]; // URLs or local SVGs/images
  videoUrl?: string;
  isCustom?: boolean;
}

export interface MuscleInfo {
  id: MuscleGroup;
  nameEs: string;
  category: 'upper_push' | 'upper_pull' | 'lower' | 'core' | 'arms';
  description: string;
  view: 'front' | 'back' | 'both';
}
