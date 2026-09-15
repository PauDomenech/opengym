import {
  UserFitnessProfile,
  StrengthDiagnosis,
  LiftEvaluation,
  StrengthLevel,
  MovementPatternKey,
  PatternInput,
} from '../types/assessment';
import { StorageService } from './storageService';

export interface ExerciseConversionConfig {
  id: string;
  nameEs: string;
  pattern: MovementPatternKey;
  // Factor applied to calculated 1RM to translate to standard compound benchmark
  equivalentMultiplier: number;
  isBodyweight?: boolean;
}

export const SUPPORTED_PATTERN_EXERCISES: ExerciseConversionConfig[] = [
  // 1. EMPUJE HORIZONTAL / PECHO (Benchmark: Press de Banca)
  { id: 'barbell-bench-press', nameEs: 'Press de Banca con Barra', pattern: 'horizontal_push', equivalentMultiplier: 1.0 },
  { id: 'flat-dumbbell-press', nameEs: 'Press Plano Mancuernas (Peso total)', pattern: 'horizontal_push', equivalentMultiplier: 1.15 },
  { id: 'incline-dumbbell-press', nameEs: 'Press Inclinado Mancuernas (Peso total)', pattern: 'horizontal_push', equivalentMultiplier: 1.25 },
  { id: 'chest-press-machine', nameEs: 'Press de Pecho en Máquina', pattern: 'horizontal_push', equivalentMultiplier: 0.95 },
  { id: 'chest-dips', nameEs: 'Fondos en Paralelas (Lastre o peso)', pattern: 'horizontal_push', equivalentMultiplier: 0.9, isBodyweight: true },
  { id: 'pushups', nameEs: 'Flexiones de Pecho (Peso corporal)', pattern: 'horizontal_push', equivalentMultiplier: 1.0, isBodyweight: true },

  // 2. EMPUJE VERTICAL / HOMBROS (Benchmark: Press Militar con Barra)
  { id: 'overhead-press', nameEs: 'Press Militar de Pie con Barra', pattern: 'vertical_push', equivalentMultiplier: 1.0 },
  { id: 'seated-dumbbell-shoulder-press', nameEs: 'Press Mancuernas Sentado (Peso total)', pattern: 'vertical_push', equivalentMultiplier: 1.15 },
  { id: 'shoulder-press-machine', nameEs: 'Press de Hombros en Máquina', pattern: 'vertical_push', equivalentMultiplier: 0.92 },
  { id: 'lateral-raise-machine', nameEs: 'Máquina de Elevaciones Laterales (x2)', pattern: 'vertical_push', equivalentMultiplier: 1.7 },
  { id: 'dumbbell-lateral-raise', nameEs: 'Elevaciones Laterales Mancuernas (Total)', pattern: 'vertical_push', equivalentMultiplier: 2.2 },

  // 3. TRACCIÓN / ESPALDA (Benchmark: Fuerza de Tracción / Jalón-Remo / Dominada)
  { id: 'lat-pulldown', nameEs: 'Jalón al Pecho en Polea', pattern: 'pull_back', equivalentMultiplier: 1.1 },
  { id: 'pull-ups', nameEs: 'Dominadas Pronas / Supinas', pattern: 'pull_back', equivalentMultiplier: 1.0, isBodyweight: true },
  { id: 'assisted-pullups', nameEs: 'Dominadas Asistidas en Máquina', pattern: 'pull_back', equivalentMultiplier: 0.85 },
  { id: 'barbell-row', nameEs: 'Remo con Barra Inclinado', pattern: 'pull_back', equivalentMultiplier: 1.15 },
  { id: 'seated-cable-row', nameEs: 'Remo en Polea Baja / Gironda', pattern: 'pull_back', equivalentMultiplier: 1.1 },
  { id: 'single-arm-dumbbell-row', nameEs: 'Remo Unilateral con Mancuerna (1 mano)', pattern: 'pull_back', equivalentMultiplier: 2.3 },

  // 4. DOMINANTE DE RODILLA / CUÁDRICEPS (Benchmark: Sentadilla con Barra)
  { id: 'barbell-squat', nameEs: 'Sentadilla Trasera con Barra', pattern: 'knee_dominant', equivalentMultiplier: 1.0 },
  { id: 'leg-press-machine', nameEs: 'Prensa de Piernas a 45°', pattern: 'knee_dominant', equivalentMultiplier: 0.55 },
  { id: 'hack-squat', nameEs: 'Sentadilla Hack en Máquina', pattern: 'knee_dominant', equivalentMultiplier: 0.72 },
  { id: 'leg-extension', nameEs: 'Máquina de Extensión de Cuádriceps', pattern: 'knee_dominant', equivalentMultiplier: 1.35 },
  { id: 'bulgarian-split-squat', nameEs: 'Sentadilla Búlgara Mancuernas (Total)', pattern: 'knee_dominant', equivalentMultiplier: 1.9 },
  { id: 'goblet-squat', nameEs: 'Sentadilla Goblet con Pesa Rusa', pattern: 'knee_dominant', equivalentMultiplier: 1.7 },

  // 5. DOMINANTE DE CADERA / GLÚTEOS & ISQUIOS (Benchmark: Peso Muerto / Hip Thrust)
  { id: 'deadlift', nameEs: 'Peso Muerto Convencional / Sumo', pattern: 'hip_dominant', equivalentMultiplier: 1.0 },
  { id: 'romanian-deadlift', nameEs: 'Peso Muerto Rumano con Barra', pattern: 'hip_dominant', equivalentMultiplier: 1.15 },
  { id: 'barbell-hip-thrust', nameEs: 'Hip Thrust con Barra en Banco', pattern: 'hip_dominant', equivalentMultiplier: 0.8 },
  { id: 'machine-hip-thrust', nameEs: 'Hip Thrust en Máquina de Glúteos', pattern: 'hip_dominant', equivalentMultiplier: 0.75 },
  { id: 'lying-leg-curl', nameEs: 'Máquina Curl Femoral Tumbado', pattern: 'hip_dominant', equivalentMultiplier: 2.1 },
  { id: 'seated-leg-curl', nameEs: 'Máquina Curl Femoral Sentado', pattern: 'hip_dominant', equivalentMultiplier: 2.0 },
  { id: 'hyperextensions', nameEs: 'Hiperextensiones Lumbares 45°', pattern: 'hip_dominant', equivalentMultiplier: 1.6, isBodyweight: true },
];

const LEVEL_NAMES_ES: Record<StrengthLevel, string> = {
  untrained: 'Iniciación / Principiante Bajo',
  novice: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  elite: 'Élite / Atleta Pro',
};

// Standard multipliers relative to bodyweight [untrainedMax, noviceMax, intermediateMax, advancedMax]
const MALE_STANDARDS: Record<MovementPatternKey, number[]> = {
  horizontal_push: [0.7, 1.0, 1.3, 1.75], // Bench benchmark
  vertical_push: [0.45, 0.65, 0.85, 1.1], // OHP benchmark
  pull_back: [0.75, 1.05, 1.35, 1.8], // Back pull benchmark
  knee_dominant: [0.9, 1.25, 1.75, 2.25], // Squat benchmark
  hip_dominant: [1.1, 1.5, 2.0, 2.6], // Deadlift/Hip thrust benchmark
};

const FEMALE_STANDARDS: Record<MovementPatternKey, number[]> = {
  horizontal_push: [0.45, 0.65, 0.85, 1.15],
  vertical_push: [0.3, 0.45, 0.6, 0.8],
  pull_back: [0.5, 0.75, 1.0, 1.35],
  knee_dominant: [0.65, 0.95, 1.35, 1.75],
  hip_dominant: [0.8, 1.2, 1.6, 2.1],
};

const PATTERN_METADATA: Record<MovementPatternKey, { nameEs: string; benchmarkNameEs: string }> = {
  horizontal_push: { nameEs: 'Empuje Horizontal (Pecho / Tríceps)', benchmarkNameEs: 'Equivalente Press Banca' },
  vertical_push: { nameEs: 'Empuje Vertical (Hombros / Deltoides)', benchmarkNameEs: 'Equivalente Press Militar' },
  pull_back: { nameEs: 'Tracción / Espalda (Dorsales & Romboides)', benchmarkNameEs: 'Equivalente Tracción Dorsal' },
  knee_dominant: { nameEs: 'Dominante de Rodilla (Cuádriceps & Pierna)', benchmarkNameEs: 'Equivalente Sentadilla' },
  hip_dominant: { nameEs: 'Dominante de Cadera (Glúteos & Isquios)', benchmarkNameEs: 'Equivalente Peso Muerto' },
};

export class StrengthService {
  /**
   * Calculate estimated 1 Rep Max using Epley formula
   */
  static calculate1RM(weightKg: number, reps: number): number {
    if (reps <= 1) return weightKg;
    // Epley formula: 1RM = Weight * (1 + Reps / 30)
    return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
  }

  /**
   * Get default fitness profile
   */
  static getDefaultProfile(): UserFitnessProfile {
    return {
      weightKg: 75,
      heightCm: 175,
      gender: 'male',
      age: 25,
      patterns: {
        horizontal_push: {
          exerciseId: 'barbell-bench-press',
          exerciseNameEs: 'Press de Banca con Barra',
          weightKg: 70,
          reps: 8,
        },
        vertical_push: {
          exerciseId: 'seated-dumbbell-shoulder-press',
          exerciseNameEs: 'Press Mancuernas Sentado (Peso total)',
          weightKg: 36,
          reps: 8,
        },
        pull_back: {
          exerciseId: 'lat-pulldown',
          exerciseNameEs: 'Jalón al Pecho en Polea',
          weightKg: 65,
          reps: 10,
        },
        knee_dominant: {
          exerciseId: 'leg-press-machine',
          exerciseNameEs: 'Prensa de Piernas a 45°',
          weightKg: 180,
          reps: 10,
        },
        hip_dominant: {
          exerciseId: 'barbell-hip-thrust',
          exerciseNameEs: 'Hip Thrust con Barra en Banco',
          weightKg: 100,
          reps: 8,
        },
      },
    };
  }

  /**
   * Automatically scan user's full workout and PR history
   * to determine their best loads across all movement patterns
   */
  static autoDetectFromHistory(currentProfile: UserFitnessProfile): UserFitnessProfile {
    const prs = StorageService.getPersonalRecords();
    const workouts = StorageService.getWorkoutHistory();
    const updated = { ...currentProfile, patterns: { ...currentProfile.patterns } };

    const patternKeys: MovementPatternKey[] = [
      'horizontal_push',
      'vertical_push',
      'pull_back',
      'knee_dominant',
      'hip_dominant',
    ];

    patternKeys.forEach((key) => {
      const candidates = SUPPORTED_PATTERN_EXERCISES.filter((ex) => ex.pattern === key);
      let bestEstimatedEq1RM = 0;
      let bestInput: PatternInput | null = null;

      candidates.forEach((cand) => {
        // 1. Check personal records
        const pr = prs[cand.id];
        if (pr && pr.maxWeightKg > 0) {
          const reps = pr.maxWeightReps || 1;
          const raw1RM = this.calculate1RM(pr.maxWeightKg, reps);
          const eq1RM = raw1RM * cand.equivalentMultiplier;
          if (eq1RM > bestEstimatedEq1RM) {
            bestEstimatedEq1RM = eq1RM;
            bestInput = {
              exerciseId: cand.id,
              exerciseNameEs: cand.nameEs,
              weightKg: pr.maxWeightKg,
              reps: reps,
            };
          }
        }

        // 2. Check workout log history sets
        workouts.forEach((w) => {
          w.exercises.forEach((ex) => {
            if (ex.exerciseId === cand.id) {
              ex.sets.forEach((set) => {
                if (set.completed && set.weightKg > 0 && set.reps > 0) {
                  const raw1RM = this.calculate1RM(set.weightKg, set.reps);
                  const eq1RM = raw1RM * cand.equivalentMultiplier;
                  if (eq1RM > bestEstimatedEq1RM) {
                    bestEstimatedEq1RM = eq1RM;
                    bestInput = {
                      exerciseId: cand.id,
                      exerciseNameEs: cand.nameEs,
                      weightKg: set.weightKg,
                      reps: set.reps,
                    };
                  }
                }
              });
            }
          });
        });
      });

      if (bestInput) {
        updated.patterns[key] = bestInput;
      }
    });

    return updated;
  }

  /**
   * Evaluate a single movement pattern based on selected exercise, load and reps
   */
  static evaluatePattern(
    key: MovementPatternKey,
    input: PatternInput,
    bodyweightKg: number,
    isMale: boolean
  ): LiftEvaluation {
    const config =
      SUPPORTED_PATTERN_EXERCISES.find((ex) => ex.id === input.exerciseId) || {
        id: input.exerciseId,
        nameEs: input.exerciseNameEs || 'Ejercicio personalizado',
        pattern: key,
        equivalentMultiplier: 1.0,
      };

    const meta = PATTERN_METADATA[key];
    const bw = Math.max(35, bodyweightKg);
    const raw1RM = this.calculate1RM(input.weightKg, input.reps || 1);
    const equivalentBenchmarkKg = Math.round(raw1RM * config.equivalentMultiplier);
    const ratio = Math.round((equivalentBenchmarkKg / bw) * 100) / 100;

    const standards = isMale ? MALE_STANDARDS[key] : FEMALE_STANDARDS[key];

    let level: StrengthLevel = 'untrained';
    let levelScore = 20;
    let targetNextLevelKg = Math.round(standards[0] * bw);
    let nextLevelLabelEs = 'Principiante';

    if (ratio < standards[0]) {
      level = 'untrained';
      levelScore = Math.min(30, Math.round((ratio / standards[0]) * 30));
      targetNextLevelKg = Math.round(standards[0] * bw);
      nextLevelLabelEs = 'Principiante';
    } else if (ratio < standards[1]) {
      level = 'novice';
      levelScore = 30 + Math.round(((ratio - standards[0]) / (standards[1] - standards[0])) * 25);
      targetNextLevelKg = Math.round(standards[1] * bw);
      nextLevelLabelEs = 'Intermedio';
    } else if (ratio < standards[2]) {
      level = 'intermediate';
      levelScore = 55 + Math.round(((ratio - standards[1]) / (standards[2] - standards[1])) * 25);
      targetNextLevelKg = Math.round(standards[2] * bw);
      nextLevelLabelEs = 'Avanzado';
    } else if (ratio < standards[3]) {
      level = 'advanced';
      levelScore = 80 + Math.round(((ratio - standards[2]) / (standards[3] - standards[2])) * 18);
      targetNextLevelKg = Math.round(standards[3] * bw);
      nextLevelLabelEs = 'Élite';
    } else {
      level = 'elite';
      levelScore = 100;
      targetNextLevelKg = equivalentBenchmarkKg;
      nextLevelLabelEs = 'Nivel Máximo';
    }

    return {
      key,
      name: key,
      nameEs: meta.nameEs,
      sourceExerciseName: config.nameEs,
      rawWeightKg: input.weightKg,
      rawReps: input.reps,
      estimated1RMKg: raw1RM,
      equivalentBenchmarkKg,
      ratio,
      level,
      levelLabelEs: LEVEL_NAMES_ES[level],
      levelScore,
      targetNextLevelKg,
      nextLevelLabelEs,
    };
  }

  /**
   * Complete holistic strength diagnosis
   */
  static diagnoseProfile(profile: UserFitnessProfile): StrengthDiagnosis {
    const isMale = profile.gender === 'male';
    const bw = profile.weightKg || 75;
    const heightM = (profile.heightCm || 175) / 100;
    const bmi = Math.round((bw / (heightM * heightM)) * 10) / 10;

    let bmiCategory = 'Normopeso / Peso Saludable';
    if (bmi < 18.5) bmiCategory = 'Bajo Peso';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Sobrepeso / Mayor Masa Muscular';
    else if (bmi >= 30) bmiCategory = 'Alta Masa Corporal';

    const patternKeys: MovementPatternKey[] = [
      'horizontal_push',
      'vertical_push',
      'pull_back',
      'knee_dominant',
      'hip_dominant',
    ];

    const evaluations = patternKeys.map((key) => {
      const input = profile.patterns[key] || {
        exerciseId: 'default',
        exerciseNameEs: key,
        weightKg: 50,
        reps: 8,
      };
      return this.evaluatePattern(key, input, bw, isMale);
    });

    const avgScore = Math.round(
      evaluations.reduce((sum, item) => sum + item.levelScore, 0) / evaluations.length
    );

    let overallLevel: StrengthLevel = 'untrained';
    if (avgScore >= 85) overallLevel = 'elite';
    else if (avgScore >= 70) overallLevel = 'advanced';
    else if (avgScore >= 50) overallLevel = 'intermediate';
    else if (avgScore >= 30) overallLevel = 'novice';

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Sort by level score to find strongest and weakest movement patterns
    const sorted = [...evaluations].sort((a, b) => b.levelScore - a.levelScore);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    strengths.push(
      `Punto Fuerte: ${best.nameEs} (${best.sourceExerciseName}: ${best.rawWeightKg} kg x ${best.rawReps} reps -> Ratio ${best.ratio}x peso), clasificado como ${best.levelLabelEs}.`
    );

    if (best.levelScore - worst.levelScore >= 20) {
      weaknesses.push(
        `Descompensación evidente: Tu ${worst.nameEs} (${worst.sourceExerciseName}: ${worst.rawWeightKg} kg) está sensiblemente por detrás de tu ${best.nameEs}.`
      );
    }

    const pushH = evaluations.find((e) => e.key === 'horizontal_push');
    const pushV = evaluations.find((e) => e.key === 'vertical_push');
    const pull = evaluations.find((e) => e.key === 'pull_back');
    const knee = evaluations.find((e) => e.key === 'knee_dominant');
    const hip = evaluations.find((e) => e.key === 'hip_dominant');

    // Imbalance checks
    if (pushH && pull && pushH.levelScore > pull.levelScore + 15) {
      recommendations.push(
        'Empuje vs Tracción descompensado: Tu empuje de pecho supera a la tracción de espalda. Añade más series de Jalón al Pecho, Remo Gironda o Dominadas para proteger los hombros y equilibrar tu postura.'
      );
    }

    if (pushH && pushV && pushH.levelScore > pushV.levelScore + 18) {
      recommendations.push(
        'Hombros rezagados en empuje vertical: Tu press de pecho es fuerte, pero el empuje vertical está retrasado. Incluye press de hombros en máquina o con mancuernas para ganar estabilidad y volumen en el deltoides.'
      );
    }

    if (pushH && knee && pushH.levelScore > knee.levelScore + 18) {
      recommendations.push(
        'Tren superior dominante: Tu fuerza de pecho y brazos supera notablemente a tus piernas. Prioriza Prensa de Piernas 45°, Sentadilla Hack o Sentadilla Búlgara 2 veces por semana.'
      );
    }

    if (hip && knee && hip.levelScore > knee.levelScore + 18) {
      recommendations.push(
        'Cuádriceps vs Cadena Posterior: Tu fuerza en glúteos/isquios supera a tus cuádriceps. Dale mayor protagonismo a la Sentadilla profunda, Prensa o Extensión de cuádriceps.'
      );
    }

    if (knee && hip && knee.levelScore > hip.levelScore + 18) {
      recommendations.push(
        'Refuerzo de cadena posterior: Tienes cuádriceps fuertes pero tus isquiotibiales y glúteos necesitan atención. Introduce Hip Thrust o Curl Femoral tumbado para prevenir tirones y lesiones.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        '¡Excelente simetría biomecánica! Tu desarrollo de fuerza entre empuje, tracción, cuádriceps y glúteos está muy bien equilibrado. Sigue aplicando sobrecarga progresiva (+1 rep o +1-2 kg cada semana).'
      );
    }

    return {
      bmi,
      bmiCategory,
      overallScore: avgScore,
      overallLevel,
      overallLevelEs: LEVEL_NAMES_ES[overallLevel],
      evaluations,
      strengths,
      weaknesses,
      recommendations,
    };
  }
}

