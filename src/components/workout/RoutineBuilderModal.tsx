import React, { useState } from 'react';
import { Routine } from '../../types/workout';
import { Exercise } from '../../types/exercise';
import { EXERCISES_DATA } from '../../data/exercisesData';
import { StorageService } from '../../services/storageService';
import {
  X,
  Plus,
  Play,
  Trash2,
} from 'lucide-react';

interface RoutineBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRoutine: (routine: Routine) => void;
  onSelectExerciseToInspect: (exercise: Exercise) => void;
}

export const RoutineBuilderModal: React.FC<RoutineBuilderModalProps> = ({
  isOpen,
  onClose,
  onStartRoutine,
  onSelectExerciseToInspect,
}) => {
  const [routines, setRoutines] = useState<Routine[]>(() => StorageService.getRoutines());
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<
    Array<{ exerciseId: string; targetSets: number; targetReps: string; restTimeSeconds: number }>
  >([]);
  const [searchExercise, setSearchExercise] = useState('');

  if (!isOpen) return null;

  const handleStart = (routine: Routine) => {
    onStartRoutine(routine);
    onClose();
  };

  const handleAddExerciseToCustom = (exerciseId: string) => {
    if (!selectedExercises.find((e) => e.exerciseId === exerciseId)) {
      setSelectedExercises([
        ...selectedExercises,
        { exerciseId, targetSets: 3, targetReps: '8-12', restTimeSeconds: 90 },
      ]);
    }
  };

  const handleRemoveExerciseFromCustom = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSaveCustomRoutine = () => {
    if (!newTitle.trim() || selectedExercises.length === 0) return;

    const newRoutine: Routine = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Rutina personalizada.',
      category: 'Custom',
      exercises: selectedExercises,
      isCustom: true,
    };

    StorageService.addCustomRoutine(newRoutine);
    setRoutines(StorageService.getRoutines());
    setIsCreating(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedExercises([]);
  };

  const handleDeleteRoutine = (id: string) => {
    StorageService.deleteRoutine(id);
    setRoutines(StorageService.getRoutines());
  };

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', maxWidth: '600px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isCreating ? 'Nueva Rutina Personalizada' : 'Rutinas de Entrenamiento'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isCreating ? 'Configura tus ejercicios y series' : 'Elige una rutina para comenzar'}
            </p>
          </div>
          <button onClick={onClose} className="clean-button-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {!isCreating ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="clean-button clean-button-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
              onClick={() => setIsCreating(true)}
            >
              <Plus size={18} /> Crear Rutina Propia
            </button>

            {routines.map((routine) => (
              <div
                key={routine.id}
                className="clean-card"
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span className="clean-pill active" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {routine.category}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {routine.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{routine.description}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {routine.isCustom && (
                      <button
                        onClick={() => handleDeleteRoutine(routine.id)}
                        className="clean-button-icon"
                        style={{ width: '34px', height: '34px', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => handleStart(routine)}
                      className="clean-button clean-button-primary"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                      <Play size={14} /> Entrenar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {routine.exercises.map((item, idx) => {
                    const ex = EXERCISES_DATA.find((e) => e.id === item.exerciseId);
                    return (
                      <span
                        key={idx}
                        className="clean-pill"
                        style={{ fontSize: '0.74rem', cursor: 'pointer', background: '#f1f5f9' }}
                        onClick={() => ex && onSelectExerciseToInspect(ex)}
                      >
                        {ex?.nameEs || item.exerciseId} ({item.targetSets}s)
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Nombre de la Rutina
              </label>
              <input
                type="text"
                className="clean-input"
                placeholder="Ej. Pecho y Bíceps"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Descripción (opcional)
              </label>
              <input
                type="text"
                className="clean-input"
                placeholder="Ej. 4 series por ejercicio"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px', display: 'block' }}>
                Ejercicios ({selectedExercises.length})
              </label>

              {selectedExercises.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed #cbd5e1',
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                  }}
                >
                  Busca y añade ejercicios abajo para completar tu rutina
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedExercises.map((item, idx) => {
                    const ex = EXERCISES_DATA.find((e) => e.id === item.exerciseId);
                    return (
                      <div
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                          #{idx + 1} {ex?.nameEs || item.exerciseId}
                        </div>
                        <button
                          onClick={() => handleRemoveExerciseFromCustom(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <input
                type="text"
                className="clean-input"
                placeholder="Buscar ejercicio para añadir..."
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                style={{ marginBottom: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />

              <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {EXERCISES_DATA.filter((ex) =>
                  ex.nameEs.toLowerCase().includes(searchExercise.toLowerCase())
                ).map((ex) => {
                  const isAdded = selectedExercises.some((e) => e.exerciseId === ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => !isAdded && handleAddExerciseToCustom(ex.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isAdded ? '#eff6ff' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: isAdded ? 'default' : 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{ex.nameEs}</span>
                      {isAdded ? (
                        <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Añadido</span>
                      ) : (
                        <Plus size={15} color="var(--accent-primary)" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button className="clean-button" style={{ flex: 1 }} onClick={() => setIsCreating(false)}>
                Cancelar
              </button>
              <button
                className="clean-button clean-button-primary"
                style={{ flex: 1 }}
                onClick={handleSaveCustomRoutine}
                disabled={!newTitle.trim() || selectedExercises.length === 0}
              >
                Guardar Rutina
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
