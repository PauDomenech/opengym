export type Gender = 'male' | 'female';
export type StrengthLevel = 'untrained' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export type MovementPatternKey =
  | 'horizontal_push' // Pecho / Empuje horizontal
  | 'vertical_push' // Hombros / Empuje vertical
  | 'pull_back' // Espalda / Tracción
  | 'knee_dominant' // Cuádriceps / Pierna dominante de rodilla
  | 'hip_dominant'; // Glúteos e Isquios / Dominante de cadera

export interface PatternInput {
  exerciseId: string;
  exerciseNameEs: string;
  weightKg: number;
  reps: number;
}

export interface UserFitnessProfile {
  weightKg: number;
  heightCm: number;
  gender: Gender;
  age?: number;
  // Patterns mapped by key
  patterns: Record<MovementPatternKey, PatternInput>;
}

export interface LiftEvaluation {
  key: MovementPatternKey;
  name: string;
  nameEs: string;
  sourceExerciseName: string;
  rawWeightKg: number;
  rawReps: number;
  estimated1RMKg: number;
  equivalentBenchmarkKg: number;
  ratio: number; // equivalent / bodyweight
  level: StrengthLevel;
  levelLabelEs: string;
  levelScore: number; // 0 to 100%
  targetNextLevelKg: number;
  nextLevelLabelEs: string;
}

export interface StrengthDiagnosis {
  bmi: number;
  bmiCategory: string;
  overallScore: number;
  overallLevel: StrengthLevel;
  overallLevelEs: string;
  evaluations: LiftEvaluation[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

