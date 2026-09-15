import React, { useState, useEffect } from 'react';
import { WorkoutSession, WorkoutSet, SetType } from '../../types/workout';
import { Exercise } from '../../types/exercise';
import { EXERCISES_DATA } from '../../data/exercisesData';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Check,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  Calculator,
} from 'lucide-react';

interface ActiveWorkoutViewProps {
  activeSession: WorkoutSession;
  onUpdateSession: (session: WorkoutSession | null) => void;
  onOpenRestTimer: (seconds: number) => void;
  onOpenPlateCalculator: (weight?: number) => void;
  onOpenExercisePicker: () => void;
  onSelectExerciseToInspect: (exercise: Exercise) => void;
  onWorkoutFinished: (session: WorkoutSession) => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  activeSession,
  onUpdateSession,
  onOpenRestTimer,
  onOpenPlateCalculator,
  onOpenExercisePicker,
  onSelectExerciseToInspect,
  onWorkoutFinished,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    return Math.floor((Date.now() - activeSession.startTime) / 1000);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeSession.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession.startTime]);

  const formatDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const saveSession = (updated: WorkoutSession) => {
    onUpdateSession(updated);
    StorageService.saveActiveWorkout(updated);
  };

  const handleToggleSetComplete = (exerciseIdx: number, setIdx: number) => {
    const updated = { ...activeSession };
    const set = updated.exercises[exerciseIdx].sets[setIdx];
    const newCompleted = !set.completed;
    set.completed = newCompleted;

    if (newCompleted) {
      soundService.playClickSound();
      const restTime = updated.exercises[exerciseIdx].restTimeSeconds || 90;
      onOpenRestTimer(restTime);
    }

    saveSession(updated);
  };

  const handleUpdateSet = (
    exerciseIdx: number,
    setIdx: number,
    field: 'weightKg' | 'reps' | 'rpe' | 'type',
    value: unknown
  ) => {
    const updated = { ...activeSession };
    const set = updated.exercises[exerciseIdx].sets[setIdx];
    // @ts-ignore
    set[field] = value;
    saveSession(updated);
  };

  const handleAddSet = (exerciseIdx: number) => {
    const updated = { ...activeSession };
    const sets = updated.exercises[exerciseIdx].sets;
    const lastSet = sets[sets.length - 1];

    const newSet: WorkoutSet = {
      id: `set-${Date.now()}-${sets.length}`,
      type: 'normal',
      weightKg: lastSet ? lastSet.weightKg : 0,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
      previousWeightKg: lastSet?.weightKg,
      previousReps: lastSet?.reps,
    };

    sets.push(newSet);
    saveSession(updated);
  };

  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    const updated = { ...activeSession };
    updated.exercises[exerciseIdx].sets = updated.exercises[exerciseIdx].sets.filter((_, i) => i !== setIdx);
    saveSession(updated);
  };

  const handleRemoveExercise = (exerciseIdx: number) => {
    const updated = { ...activeSession };
    updated.exercises = updated.exercises.filter((_, i) => i !== exerciseIdx);
    saveSession(updated);
  };

  const handleFinishWorkout = () => {
    const endTime = Date.now();
    const durationSeconds = Math.max(1, Math.floor((endTime - activeSession.startTime) / 1000));

    let totalVolume = 0;
    let totalSets = 0;

    activeSession.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed && s.weightKg > 0 && s.reps > 0) {
          totalVolume += s.weightKg * s.reps;
          totalSets++;
        }
      });
    });

    const finishedSession: WorkoutSession = {
      ...activeSession,
      endTime,
      durationSeconds,
      totalVolumeKg: Math.round(totalVolume),
      totalSetsCompleted: totalSets,
    };

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#f59e0b', '#0284c7'],
    });

    soundService.playPrSound();
    StorageService.addCompletedWorkout(finishedSession);
    StorageService.saveActiveWorkout(null);
    onWorkoutFinished(finishedSession);
  };

  const handleDiscardWorkout = () => {
    if (window.confirm('¿Deseas cancelar el entrenamiento actual?')) {
      StorageService.saveActiveWorkout(null);
      onUpdateSession(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Card */}
      <div className="clean-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                Sesión Activa
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeSession.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tiempo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {formatDuration(elapsedSeconds)}
              </div>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="clean-button clean-button-primary"
              style={{ padding: '10px 18px', fontWeight: 700 }}
            >
              <Check size={18} /> Finalizar
            </button>
          </div>
        </div>

        {/* Quick Tools Row */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => onOpenRestTimer(90)}
            className="clean-button"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Clock size={15} color="var(--accent-primary)" /> Cronómetro
          </button>

          <button
            onClick={() => onOpenPlateCalculator(60)}
            className="clean-button"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Calculator size={15} color="#f59e0b" /> Discos
          </button>

          <button
            onClick={onOpenExercisePicker}
            className="clean-button clean-button-primary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', marginLeft: 'auto' }}
          >
            <Plus size={15} /> Añadir Ejercicio
          </button>
        </div>
      </div>

      {/* Exercises List */}
      {activeSession.exercises.length === 0 ? (
        <div className="clean-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Dumbbell size={40} color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700 }}>
            Tu sesión está vacía
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '6px auto 16px auto' }}>
            Añade ejercicios para registrar pesos y series.
          </p>
          <button onClick={onOpenExercisePicker} className="clean-button clean-button-primary">
            <Plus size={16} /> Explorar Ejercicios
          </button>
        </div>
      ) : (
        activeSession.exercises.map((workoutEx, exIdx) => {
          const exercise = EXERCISES_DATA.find((e) => e.id === workoutEx.exerciseId);

          return (
            <div key={workoutEx.id || exIdx} className="clean-card" style={{ padding: '16px' }}>
              {/* Exercise Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={() => exercise && onSelectExerciseToInspect(exercise)}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {exercise?.nameEs || workoutEx.exerciseId}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Toca para ver técnica
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onOpenPlateCalculator(workoutEx.sets[0]?.weightKg || 60)}
                    className="clean-button-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Calcular discos"
                  >
                    <Calculator size={14} />
                  </button>
                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="clean-button-icon"
                    style={{ width: '32px', height: '32px', color: '#ef4444' }}
                    title="Eliminar ejercicio"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '300px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '36px' }}>#</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '80px' }}>Tipo</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Kg</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Reps</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '48px' }}>RPE</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '40px' }}>✓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutEx.sets.map((set, sIdx) => (
                      <tr
                        key={set.id || sIdx}
                        style={{
                          background: set.completed ? '#eff6ff' : 'transparent',
                          borderTop: '1px solid #f1f5f9',
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          {sIdx + 1}
                        </td>

                        <td style={{ padding: '4px' }}>
                          <select
                            value={set.type}
                            onChange={(e) => handleUpdateSet(exIdx, sIdx, 'type', e.target.value as SetType)}
                            className="clean-input"
                            style={{
                              padding: '4px 6px',
                              fontSize: '0.74rem',
                              borderRadius: 'var(--radius-sm)',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <option value="normal">Normal</option>
                            <option value="warmup">Calentam.</option>
                            <option value="dropset">Drop</option>
                            <option value="failure">Fallo</option>
                          </select>
                        </td>

                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="clean-input"
                            style={{ textAlign: 'center', fontWeight: 700, padding: '6px 4px', background: '#f8fafc' }}
                            value={set.weightKg || ''}
                            placeholder="0"
                            onChange={(e) => handleUpdateSet(exIdx, sIdx, 'weightKg', Number(e.target.value))}
                          />
                        </td>

                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <input
                            type="number"
                            step="1"
                            className="clean-input"
                            style={{ textAlign: 'center', fontWeight: 700, padding: '6px 4px', background: '#f8fafc' }}
                            value={set.reps || ''}
                            placeholder="10"
                            onChange={(e) => handleUpdateSet(exIdx, sIdx, 'reps', Number(e.target.value))}
                          />
                        </td>

                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            className="clean-input"
                            style={{ textAlign: 'center', padding: '6px 2px', background: '#f8fafc', color: 'var(--accent-primary)', fontWeight: 600 }}
                            value={set.rpe || ''}
                            placeholder="-"
                            onChange={(e) => handleUpdateSet(exIdx, sIdx, 'rpe', Number(e.target.value))}
                          />
                        </td>

                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleSetComplete(exIdx, sIdx)}
                            className="clean-button"
                            style={{
                              width: '32px',
                              height: '32px',
                              padding: 0,
                              borderRadius: '8px',
                              background: set.completed ? 'var(--accent-primary)' : '#ffffff',
                              color: set.completed ? '#ffffff' : '#94a3b8',
                              border: `1px solid ${set.completed ? 'var(--accent-primary)' : '#cbd5e1'}`,
                            }}
                          >
                            <Check size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Set Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  onClick={() => handleAddSet(exIdx)}
                  className="clean-button"
                  style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                >
                  <Plus size={14} /> Añadir Serie
                </button>

                {workoutEx.sets.length > 1 && (
                  <button
                    onClick={() => handleRemoveSet(exIdx, workoutEx.sets.length - 1)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.74rem', cursor: 'pointer' }}
                  >
                    Quitar serie
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Discard Session */}
      {activeSession.exercises.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button
            onClick={handleDiscardWorkout}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cancelar este entrenamiento
          </button>
        </div>
      )}
    </div>
  );
};
