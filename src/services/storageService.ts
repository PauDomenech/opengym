import { GymInventory } from '../types/equipment';
import { WorkoutSession, Routine, PersonalRecord } from '../types/workout';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';
import { EQUIPMENT_LIST } from '../data/equipmentList';

const STORAGE_KEYS = {
  GYM_INVENTORY: 'gympulse_inventory',
  ACTIVE_WORKOUT: 'gympulse_active_workout',
  WORKOUT_HISTORY: 'gympulse_history',
  PERSONAL_RECORDS: 'gympulse_prs',
  ROUTINES: 'gympulse_routines',
  USER_SETTINGS: 'gympulse_settings',
};

export class StorageService {
  // --- GYM INVENTORY ---
  static getGymInventory(): GymInventory {
    const saved = localStorage.getItem(STORAGE_KEYS.GYM_INVENTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing gym inventory:', e);
      }
    }
    // Default: all equipment available
    const initial: Partial<GymInventory> = {};
    EQUIPMENT_LIST.forEach((eq) => {
      initial[eq.id] = eq.isAvailableDefault;
    });
    return initial as GymInventory;
  }

  static saveGymInventory(inventory: GymInventory): void {
    localStorage.setItem(STORAGE_KEYS.GYM_INVENTORY, JSON.stringify(inventory));
  }

  // --- ACTIVE WORKOUT ---
  static getActiveWorkout(): WorkoutSession | null {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing active workout:', e);
      }
    }
    return null;
  }

  static saveActiveWorkout(workout: WorkoutSession | null): void {
    if (workout) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    }
  }

  // --- WORKOUT HISTORY ---
  static getWorkoutHistory(): WorkoutSession[] {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing workout history:', e);
      }
    }
    return [];
  }

  static saveWorkoutHistory(history: WorkoutSession[]): void {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  }

  static addCompletedWorkout(session: WorkoutSession): void {
    const history = this.getWorkoutHistory();
    history.unshift(session);
    this.saveWorkoutHistory(history);
    this.updatePersonalRecords(session);
  }

  static deleteWorkout(sessionId: string): void {
    const history = this.getWorkoutHistory().filter((w) => w.id !== sessionId);
    this.saveWorkoutHistory(history);
  }

  // --- PERSONAL RECORDS ---
  static getPersonalRecords(): Record<string, PersonalRecord> {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing PRs:', e);
      }
    }
    return {};
  }

  static savePersonalRecords(records: Record<string, PersonalRecord>): void {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(records));
  }

  static updatePersonalRecords(session: WorkoutSession): void {
    const prs = this.getPersonalRecords();

    session.exercises.forEach((ex) => {
      const completedSets = ex.sets.filter((s) => s.completed && s.weightKg > 0);
      if (completedSets.length === 0) return;

      if (!prs[ex.exerciseId]) {
        prs[ex.exerciseId] = {
          exerciseId: ex.exerciseId,
          maxWeightKg: 0,
          maxWeightReps: 0,
          maxWeightDate: session.startTime,
          maxEstimated1RM: 0,
          history: [],
        };
      }

      const pr = prs[ex.exerciseId];

      completedSets.forEach((set) => {
        // Epley formula: 1RM = Weight * (1 + Reps / 30)
        const est1RM = Math.round(set.weightKg * (1 + set.reps / 30) * 10) / 10;

        pr.history.push({
          date: session.startTime,
          weightKg: set.weightKg,
          reps: set.reps,
          estimated1RM: est1RM,
        });

        if (set.weightKg > pr.maxWeightKg) {
          pr.maxWeightKg = set.weightKg;
          pr.maxWeightReps = set.reps;
          pr.maxWeightDate = session.startTime;
        }

        if (est1RM > pr.maxEstimated1RM) {
          pr.maxEstimated1RM = est1RM;
        }
      });
    });

    this.savePersonalRecords(prs);
  }

  // --- ROUTINES ---
  static getRoutines(): Routine[] {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing routines:', e);
      }
    }
    return DEFAULT_ROUTINES;
  }

  static saveRoutines(routines: Routine[]): void {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }

  static addCustomRoutine(routine: Routine): void {
    const routines = this.getRoutines();
    routines.push(routine);
    this.saveRoutines(routines);
  }

  static deleteRoutine(routineId: string): void {
    const routines = this.getRoutines().filter((r) => r.id !== routineId);
    this.saveRoutines(routines);
  }

  // --- BACKUP EXPORT & IMPORT ---
  static exportBackup(): string {
    const data = {
      version: '1.0.0',
      timestamp: Date.now(),
      inventory: this.getGymInventory(),
      history: this.getWorkoutHistory(),
      prs: this.getPersonalRecords(),
      routines: this.getRoutines(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.inventory) this.saveGymInventory(data.inventory);
      if (data.history) this.saveWorkoutHistory(data.history);
      if (data.prs) this.savePersonalRecords(data.prs);
      if (data.routines) this.saveRoutines(data.routines);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
