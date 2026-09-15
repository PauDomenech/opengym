import React, { useState } from 'react';
import { WorkoutSession } from '../../types/workout';
import { EXERCISES_DATA } from '../../data/exercisesData';
import { StorageService } from '../../services/storageService';
import {
  Trash2,
  Download,
  Upload,
  Play,
  Dumbbell,
} from 'lucide-react';

interface HistoryViewProps {
  history: WorkoutSession[];
  onRefreshHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onRefreshHistory }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const totalWorkouts = history.length;
  const totalVolumeKg = history.reduce((acc, curr) => acc + (curr.totalVolumeKg || 0), 0);
  const totalSeconds = history.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const avgMinutes = totalWorkouts > 0 ? Math.round(totalSeconds / totalWorkouts / 60) : 0;
  const totalSets = history.reduce((acc, curr) => acc + (curr.totalSetsCompleted || 0), 0);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins} min`;
  };

  const handleDeleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Seguro que deseas eliminar este entrenamiento del historial?')) {
      StorageService.deleteWorkout(id);
      onRefreshHistory();
    }
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gympulse_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importBackup(content);
        if (success) {
          setImportStatus('¡Copia de seguridad restaurada!');
          onRefreshHistory();
        } else {
          setImportStatus('Error al importar archivo.');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const days = [
    { label: 'L', height: '60%' },
    { label: 'M', height: '85%' },
    { label: 'X', height: '40%' },
    { label: 'J', height: '95%' },
    { label: 'V', height: '70%' },
    { label: 'S', height: '100%' },
    { label: 'D', height: '30%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Mi Actividad</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportBackup} className="clean-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <Download size={14} /> Exportar
          </button>
          <label className="clean-button" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
            <Upload size={14} /> Importar
            <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {importStatus && (
        <div
          style={{
            padding: '10px 16px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            color: '#065f46',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}
        >
          {importStatus}
        </div>
      )}

      {/* Segmented Pills */}
      <div className="clean-segmented" style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
        <button
          className={`clean-segment-btn ${period === 'daily' ? 'active' : ''}`}
          onClick={() => setPeriod('daily')}
        >
          Diario
        </button>
        <button
          className={`clean-segment-btn ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Semanal
        </button>
        <button
          className={`clean-segment-btn ${period === 'monthly' ? 'active' : ''}`}
          onClick={() => setPeriod('monthly')}
        >
          Mensual
        </button>
      </div>

      {/* Big Blue Feature Card */}
      <div className="blue-feature-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Volumen Levantado</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
              {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)} Tn` : `${totalVolumeKg} kg`}
            </div>
          </div>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            Esta Semana
          </span>
        </div>

        {/* Weekly Bar Chart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '110px',
            paddingTop: '10px',
          }}
        >
          {days.map((d, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: d.height,
                  background: idx === 3 ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  borderRadius: '999px',
                  transition: 'height 0.3s ease',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Circular Metrics Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div
          className="clean-card"
          style={{
            padding: '16px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid var(--accent-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {totalSets}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Series</div>
        </div>

        <div
          className="clean-card"
          style={{
            padding: '16px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid #0284c7',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {avgMinutes}m
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Promedio</div>
        </div>

        <div
          className="clean-card"
          style={{
            padding: '16px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {totalWorkouts}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sesiones</div>
        </div>
      </div>

      {/* History List Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Historial</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
            {history.length} sesiones
          </span>
        </div>

        {history.length === 0 ? (
          <div className="clean-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Dumbbell size={36} color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Sin sesiones registradas</div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
              Inicia un entrenamiento en la pestaña "Entrenar" para verlo aquí.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((session) => {
              const isExpanded = expandedSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="clean-card"
                  style={{ padding: '14px 18px', cursor: 'pointer' }}
                  onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: '#eff6ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <Dumbbell size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                          {session.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {formatDate(session.startTime)} • {formatDuration(session.durationSeconds)} • {session.totalVolumeKg} kg
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={(e) => handleDeleteWorkout(session.id, e)}
                        className="clean-button-icon"
                        style={{ width: '32px', height: '32px', color: '#ef4444' }}
                        title="Eliminar sesión"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <Play size={14} style={{ marginLeft: '2px' }} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {session.exercises.map((workoutEx, idx) => {
                        const ex = EXERCISES_DATA.find((e) => e.id === workoutEx.exerciseId);
                        const completedSets = workoutEx.sets.filter((s) => s.completed);

                        return (
                          <div
                            key={idx}
                            style={{
                              background: '#f8fafc',
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-md)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '6px',
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: '0.86rem' }}>
                              {ex?.nameEs || workoutEx.exerciseId}
                            </span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {completedSets.map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="clean-pill"
                                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                                >
                                  {s.weightKg}kg × {s.reps}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
