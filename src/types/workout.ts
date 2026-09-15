export type SetType = 'warmup' | 'normal' | 'dropset' | 'failure';

export interface WorkoutSet {
  id: string;
  type: SetType;
  weightKg: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  previousWeightKg?: number;
  previousReps?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  notes?: string;
  restTimeSeconds: number; // e.g. 90
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  routineId?: string;
  startTime: number; // Timestamp
  endTime?: number; // Timestamp
  durationSeconds: number;
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  prsAchieved: Array<{
    exerciseId: string;
    weightKg: number;
    reps: number;
    metric: 'max_weight' | 'max_volume';
  }>;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'PPL' | 'UpperLower' | 'FullBody' | 'Arms' | 'Custom';
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: string; // e.g. "8-12"
    restTimeSeconds: number;
  }>;
  isCustom?: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  maxWeightKg: number;
  maxWeightReps: number;
  maxWeightDate: number;
  maxEstimated1RM: number;
  history: Array<{
    date: number;
    weightKg: number;
    reps: number;
    estimated1RM: number;
  }>;
}
