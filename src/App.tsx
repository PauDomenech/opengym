import React, { useState, useMemo } from 'react';
import { MuscleGroup, EquipmentType, ExerciseCategory, Exercise } from './types/exercise';
import { WorkoutSession, Routine } from './types/workout';
import { GymInventory } from './types/equipment';
import { EXERCISES_DATA } from './data/exercisesData';
import { StorageService } from './services/storageService';
import { MuscleBodyMap } from './components/anatomy/MuscleBodyMap';
import { ExerciseSearch } from './components/exercises/ExerciseSearch';
import { ExerciseCard } from './components/exercises/ExerciseCard';
import { ExerciseModal } from './components/exercises/ExerciseModal';
import { GymEquipmentManager } from './components/gym/GymEquipmentManager';
import { ActiveWorkoutView } from './components/workout/ActiveWorkoutView';
import { RestTimerModal } from './components/workout/RestTimerModal';
import { PlateCalculatorModal } from './components/workout/PlateCalculatorModal';
import { RoutineBuilderModal } from './components/workout/RoutineBuilderModal';
import { StrengthAssessmentModal } from './components/strength/StrengthAssessmentModal';
import { ScientificCoachModal } from './components/coach/ScientificCoachModal';
import { HistoryView } from './components/history/HistoryView';
import { PRTrackerView } from './components/history/PRTrackerView';
import { BottomGlassNav, NavTab } from './components/navigation/BottomGlassNav';
import {
  Play,
  Clock,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('workout');

  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(() =>
    StorageService.getActiveWorkout()
  );

  const [gymInventory, setGymInventory] = useState<GymInventory>(() =>
    StorageService.getGymInventory()
  );
  const [filterByGym, setFilterByGym] = useState<boolean>(false);

  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const [inspectingExercise, setInspectingExercise] = useState<Exercise | null>(null);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(90);
  const [isPlateCalcOpen, setIsPlateCalcOpen] = useState<boolean>(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState<number>(60);
  const [isRoutineBuilderOpen, setIsRoutineBuilderOpen] = useState<boolean>(false);
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState<boolean>(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState<boolean>(false);

  const [history, setHistory] = useState<WorkoutSession[]>(() =>
    StorageService.getWorkoutHistory()
  );

  const refreshHistory = () => {
    setHistory(StorageService.getWorkoutHistory());
  };

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((ex) => {
      if (selectedMuscle) {
        const matchesMuscle =
          ex.primaryMuscles.includes(selectedMuscle) ||
          ex.secondaryMuscles.includes(selectedMuscle);
        if (!matchesMuscle) return false;
      }

      if (filterByGym && !gymInventory[ex.equipment]) {
        return false;
      }

      if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) {
        return false;
      }

      if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
        return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName =
          ex.nameEs.toLowerCase().includes(term) ||
          ex.name.toLowerCase().includes(term) ||
          (ex.aliases && ex.aliases.some((a) => a.toLowerCase().includes(term)));
        if (!matchesName) return false;
      }

      return true;
    });
  }, [selectedMuscle, filterByGym, gymInventory, selectedEquipment, selectedCategory, searchTerm]);

  const handleStartEmptyWorkout = () => {
    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      title: 'Entrenamiento Libre',
      startTime: Date.now(),
      durationSeconds: 0,
      exercises: [],
      totalVolumeKg: 0,
      totalSetsCompleted: 0,
      prsAchieved: [],
    };
    setActiveSession(newSession);
    StorageService.saveActiveWorkout(newSession);
    setCurrentTab('workout');
  };

  const handleStartFromRoutine = (routine: Routine) => {
    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      title: routine.title,
      routineId: routine.id,
      startTime: Date.now(),
      durationSeconds: 0,
      exercises: routine.exercises.map((re, idx) => ({
        id: `ex-${Date.now()}-${idx}`,
        exerciseId: re.exerciseId,
        restTimeSeconds: re.restTimeSeconds,
        sets: Array.from({ length: re.targetSets }).map((_, sIdx) => ({
          id: `set-${Date.now()}-${idx}-${sIdx}`,
          type: 'normal',
          weightKg: 0,
          reps: parseInt(re.targetReps.split('-')[0]) || 10,
          completed: false,
        })),
      })),
      totalVolumeKg: 0,
      totalSetsCompleted: 0,
      prsAchieved: [],
    };

    setActiveSession(newSession);
    StorageService.saveActiveWorkout(newSession);
    setCurrentTab('workout');
  };

  const handleAddExerciseToActive = (exercise: Exercise) => {
    if (!activeSession) {
      const newSession: WorkoutSession = {
        id: `workout-${Date.now()}`,
        title: 'Entrenamiento Libre',
        startTime: Date.now(),
        durationSeconds: 0,
        exercises: [
          {
            id: `ex-${Date.now()}-0`,
            exerciseId: exercise.id,
            restTimeSeconds: 90,
            sets: [
              { id: `set-${Date.now()}-0-0`, type: 'normal', weightKg: 0, reps: 10, completed: false },
              { id: `set-${Date.now()}-0-1`, type: 'normal', weightKg: 0, reps: 10, completed: false },
              { id: `set-${Date.now()}-0-2`, type: 'normal', weightKg: 0, reps: 10, completed: false },
            ],
          },
        ],
        totalVolumeKg: 0,
        totalSetsCompleted: 0,
        prsAchieved: [],
      };
      setActiveSession(newSession);
      StorageService.saveActiveWorkout(newSession);
    } else {
      const updated = { ...activeSession };
      updated.exercises.push({
        id: `ex-${Date.now()}-${updated.exercises.length}`,
        exerciseId: exercise.id,
        restTimeSeconds: 90,
        sets: [
          { id: `set-${Date.now()}-0`, type: 'normal', weightKg: 0, reps: 10, completed: false },
          { id: `set-${Date.now()}-1`, type: 'normal', weightKg: 0, reps: 10, completed: false },
          { id: `set-${Date.now()}-2`, type: 'normal', weightKg: 0, reps: 10, completed: false },
        ],
      });
      setActiveSession(updated);
      StorageService.saveActiveWorkout(updated);
    }
    setCurrentTab('workout');
  };

  const currentDateFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="app-container">
      {/* App Header with OpenGym Branding */}
      <header className="app-header">
        <div className="app-header-brand">
          <img
            src="./logo.png"
            alt="OpenGym"
            className="app-header-logo"
            onError={(e) => {
              // Fallback to stylized SVG/color if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, margin: 0 }}>
              Open<span style={{ color: 'var(--accent-primary)' }}>Gym</span>
            </h1>
            <span className="header-subtitle" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Open-source GymApp
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="app-header-actions">
          <button
            className="clean-button header-action-btn"
            style={{
              background: '#111318',
              color: '#ffffff',
              borderColor: '#111318',
            }}
            onClick={() => setIsCoachModalOpen(true)}
            title="Coach Científico 100% Offline (Evidencia & Preguntas Guiadas)"
          >
            <Sparkles size={13} color="#60a5fa" /> <span>Ciencia</span>
          </button>

          <button
            className="clean-button header-action-btn"
            style={{
              background: '#eff6ff',
              color: 'var(--accent-primary)',
              borderColor: '#bfdbfe',
            }}
            onClick={() => setIsStrengthModalOpen(true)}
            title="Calculadora de Fuerza y Nivel Físico"
          >
            <Zap size={13} /> <span>Fuerza</span>
          </button>

          <button
            className="clean-button header-action-btn"
            onClick={() => {
              setPlateCalcWeight(60);
              setIsPlateCalcOpen(true);
            }}
            title="Calculadora de discos y barra"
          >
            Discos
          </button>

          <button
            className="clean-button-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={() => {
              setRestTimerSeconds(90);
              setIsRestTimerOpen(true);
            }}
            title="Cronómetro de descanso"
          >
            <Clock size={14} color="var(--accent-primary)" />
          </button>
        </div>
      </header>

      {/* Floating Active Banner if workout in progress on other tabs */}
      {activeSession && currentTab !== 'workout' && (
        <div className="clean-active-banner" onClick={() => setCurrentTab('workout')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                Sesión en curso: {activeSession.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {activeSession.exercises.length} ejercicios • Toca para continuar
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--accent-primary)" />
        </div>
      )}

      {/* --- TAB CONTENT --- */}

      {/* TAB 1: WORKOUT / TRAINING */}
      {currentTab === 'workout' && (
        <>
          {activeSession ? (
            <ActiveWorkoutView
              activeSession={activeSession}
              onUpdateSession={setActiveSession}
              onOpenRestTimer={(secs) => {
                setRestTimerSeconds(secs);
                setIsRestTimerOpen(true);
              }}
              onOpenPlateCalculator={(weight) => {
                setPlateCalcWeight(weight || 60);
                setIsPlateCalcOpen(true);
              }}
              onOpenExercisePicker={() => setCurrentTab('exercises')}
              onSelectExerciseToInspect={setInspectingExercise}
              onWorkoutFinished={() => {
                setActiveSession(null);
                refreshHistory();
                setCurrentTab('history');
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Today Workout Plan Card */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Plan de Hoy</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {currentDateFormatted}
                  </span>
                </div>

                <div
                  className="clean-card"
                  style={{
                    padding: '22px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '160px',
                    position: 'relative',
                  }}
                >
                  <div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      Día 01 • Empuje (Push)
                    </span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                      Pecho, Hombro y Tríceps
                    </h2>
                    <p style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: '2px' }}>
                      7 ejercicios • 45-60 min aprox
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      className="clean-button clean-button-primary"
                      style={{ padding: '10px 18px', fontWeight: 700 }}
                      onClick={() => handleStartFromRoutine(StorageService.getRoutines()[0])}
                    >
                      <Play size={16} /> Iniciar Plan
                    </button>
                    <button
                      className="clean-button"
                      style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                      onClick={handleStartEmptyWorkout}
                    >
                      Sesión Libre
                    </button>
                  </div>
                </div>
              </div>

              {/* Most Popular / Routines Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Rutinas Populares</h3>
                  <button
                    onClick={() => setIsRoutineBuilderOpen(true)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Ver todas
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {StorageService.getRoutines().slice(1, 4).map((routine) => (
                    <div
                      key={routine.id}
                      className="clean-card"
                      style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <span className="clean-pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            {routine.category}
                          </span>
                          <span className="clean-pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            {routine.exercises.length} ejercicios
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                          {routine.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {routine.description}
                        </p>
                      </div>

                      <button
                        className="clean-button clean-button-primary"
                        style={{ width: '100%', padding: '9px', fontWeight: 700 }}
                        onClick={() => handleStartFromRoutine(routine)}
                      >
                        <Play size={14} /> Iniciar Rutina
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Coach Teaser Banner */}
              <div
                className="clean-card"
                style={{
                  padding: '18px 20px',
                  background: '#111318',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)',
                }}
                onClick={() => setIsCoachModalOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                      ¿Dudas sobre series, RIR, creatina o descanso?
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      Pregunta al Coach Científico de OpenGym (100% Offline con meta-análisis de universidades)
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="#60a5fa" />
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: EXERCISES & ANATOMY */}
      {currentTab === 'exercises' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MuscleBodyMap
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
          />

          <ExerciseSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEquipment={selectedEquipment}
            onSelectEquipment={setSelectedEquipment}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            filterByGym={filterByGym}
            onToggleFilterByGym={setFilterByGym}
            totalExercisesCount={filteredExercises.length}
          />

          {filteredExercises.length === 0 ? (
            <div className="clean-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>No se encontraron ejercicios</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                Prueba quitando filtros de músculo o de material.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={setInspectingExercise}
                  onQuickAdd={handleAddExerciseToActive}
                  isAvailableInGym={!filterByGym || !!gymInventory[exercise.equipment]}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GYM EQUIPMENT MANAGER */}
      {currentTab === 'gym' && (
        <GymEquipmentManager
          inventory={gymInventory}
          onUpdateInventory={setGymInventory}
          filterByGym={filterByGym}
          onToggleFilterByGym={setFilterByGym}
        />
      )}

      {/* TAB 4: HISTORY & ACTIVITY */}
      {currentTab === 'history' && (
        <HistoryView history={history} onRefreshHistory={refreshHistory} />
      )}

      {/* TAB 5: PERSONAL RECORDS */}
      {currentTab === 'prs' && <PRTrackerView />}

      {/* --- MODALS --- */}

      <ExerciseModal
        exercise={inspectingExercise}
        onClose={() => setInspectingExercise(null)}
        onAddToWorkout={handleAddExerciseToActive}
      />

      <RestTimerModal
        initialSeconds={restTimerSeconds}
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
      />

      <PlateCalculatorModal
        isOpen={isPlateCalcOpen}
        initialWeight={plateCalcWeight}
        onClose={() => setIsPlateCalcOpen(false)}
      />

      <RoutineBuilderModal
        isOpen={isRoutineBuilderOpen}
        onClose={() => setIsRoutineBuilderOpen(false)}
        onStartRoutine={handleStartFromRoutine}
        onSelectExerciseToInspect={setInspectingExercise}
      />

      {/* Strength Assessment Modal */}
      <StrengthAssessmentModal
        isOpen={isStrengthModalOpen}
        onClose={() => setIsStrengthModalOpen(false)}
      />

      {/* Scientific Offline Coach Assistant Modal */}
      <ScientificCoachModal
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
      />

      {/* Minimal Bottom Dock */}
      <BottomGlassNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        hasActiveWorkout={!!activeSession}
      />
    </div>
  );
};

export default App;
