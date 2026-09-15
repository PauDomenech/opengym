import React, { useState } from 'react';
import { UserFitnessProfile, StrengthDiagnosis, MovementPatternKey } from '../../types/assessment';
import { StrengthService, SUPPORTED_PATTERN_EXERCISES } from '../../services/strengthService';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface StrengthAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PATTERN_ORDER: { key: MovementPatternKey; iconLabel: string }[] = [
  { key: 'horizontal_push', iconLabel: '🏋️ Pecho & Tríceps' },
  { key: 'vertical_push', iconLabel: '🎯 Hombros & Deltoides' },
  { key: 'pull_back', iconLabel: '🦅 Espalda & Dorsales' },
  { key: 'knee_dominant', iconLabel: '🦵 Cuádriceps & Prensa' },
  { key: 'hip_dominant', iconLabel: '🍑 Glúteos & Isquios' },
];

export const StrengthAssessmentModal: React.FC<StrengthAssessmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserFitnessProfile>(() => {
    const saved = localStorage.getItem('opengym_fitness_profile_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return StrengthService.getDefaultProfile();
  });

  const [diagnosis, setDiagnosis] = useState<StrengthDiagnosis>(() =>
    StrengthService.diagnoseProfile(profile)
  );

  if (!isOpen) return null;

  const handleUpdateBiometrics = (field: 'weightKg' | 'heightCm' | 'gender' | 'age', value: unknown) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    localStorage.setItem('opengym_fitness_profile_v2', JSON.stringify(updated));
    setDiagnosis(StrengthService.diagnoseProfile(updated));
  };

  const handleUpdatePattern = (
    key: MovementPatternKey,
    exerciseId: string,
    weightKg: number,
    reps: number
  ) => {
    const exConfig = SUPPORTED_PATTERN_EXERCISES.find((e) => e.id === exerciseId);
    const updated: UserFitnessProfile = {
      ...profile,
      patterns: {
        ...profile.patterns,
        [key]: {
          exerciseId,
          exerciseNameEs: exConfig?.nameEs || exerciseId,
          weightKg,
          reps,
        },
      },
    };
    setProfile(updated);
    localStorage.setItem('opengym_fitness_profile_v2', JSON.stringify(updated));
    setDiagnosis(StrengthService.diagnoseProfile(updated));
  };

  const handleAutoScanHistory = () => {
    const updated = StrengthService.autoDetectFromHistory(profile);
    setProfile(updated);
    localStorage.setItem('opengym_fitness_profile_v2', JSON.stringify(updated));
    setDiagnosis(StrengthService.diagnoseProfile(updated));
  };

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color="var(--accent-primary)" />
              Calculadora de Fuerza & Nivel Físico
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Compara tus marcas reales (máquinas o pesos libres) con estándares mundiales
            </p>
          </div>
          <button onClick={onClose} className="clean-button-icon" style={{ width: '34px', height: '34px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Biometrics & Auto Scan Banner */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              1. Tus Datos Corporales
            </span>
            <button
              onClick={handleAutoScanHistory}
              className="clean-button"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                borderRadius: 'var(--radius-pill)',
                background: '#eff6ff',
                color: 'var(--accent-primary)',
                borderColor: '#bfdbfe',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} /> Auto-Calcular desde mi Historial
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Sexo
              </label>
              <select
                value={profile.gender}
                onChange={(e) => handleUpdateBiometrics('gender', e.target.value)}
                className="clean-input"
                style={{ background: '#ffffff', padding: '8px 10px', fontSize: '0.86rem' }}
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Peso corporal (kg)
              </label>
              <input
                type="number"
                value={profile.weightKg}
                onChange={(e) => handleUpdateBiometrics('weightKg', Number(e.target.value))}
                className="clean-input"
                style={{ background: '#ffffff', padding: '8px 10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Altura (cm)
              </label>
              <input
                type="number"
                value={profile.heightCm}
                onChange={(e) => handleUpdateBiometrics('heightCm', Number(e.target.value))}
                className="clean-input"
                style={{ background: '#ffffff', padding: '8px 10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Edad
              </label>
              <input
                type="number"
                value={profile.age || 25}
                onChange={(e) => handleUpdateBiometrics('age', Number(e.target.value))}
                className="clean-input"
                style={{ background: '#ffffff', padding: '8px 10px', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>
          </div>
        </div>

        {/* Global Level Score Banner */}
        <div
          style={{
            background: 'var(--accent-blue-gradient)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            color: '#ffffff',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Nivel de Fuerza Global Estimado
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '3px 0' }}>
              {diagnosis.overallLevelEs}
            </h2>
            <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
              IMC: <strong>{diagnosis.bmi}</strong> ({diagnosis.bmiCategory})
            </div>
          </div>

          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid #ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{diagnosis.overallScore}</span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700 }}>/100</span>
          </div>
        </div>

        {/* Movement Patterns List & Selectors */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              2. Tus Ejercicios & Cargas por Grupo Muscular
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Puedes elegir cualquier máquina o ejercicio
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PATTERN_ORDER.map(({ key, iconLabel }) => {
              const currentInput = profile.patterns[key] || {
                exerciseId: 'default',
                exerciseNameEs: '',
                weightKg: 50,
                reps: 8,
              };

              const evaluation = diagnosis.evaluations.find((e) => e.key === key);
              const exerciseOptions = SUPPORTED_PATTERN_EXERCISES.filter((ex) => ex.pattern === key);

              return (
                <div
                  key={key}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {iconLabel}
                    </div>
                    {evaluation && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: evaluation.levelScore >= 70 ? '#10b981' : 'var(--accent-primary)',
                          background: '#f8fafc',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {evaluation.levelLabelEs} ({evaluation.ratio}x peso)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                        Ejercicio que realizas
                      </label>
                      <select
                        value={currentInput.exerciseId}
                        onChange={(e) =>
                          handleUpdatePattern(key, e.target.value, currentInput.weightKg, currentInput.reps)
                        }
                        className="clean-input"
                        style={{ padding: '6px 8px', fontSize: '0.82rem', background: '#f8fafc' }}
                      >
                        {exerciseOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.nameEs}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={currentInput.weightKg}
                        onChange={(e) =>
                          handleUpdatePattern(key, currentInput.exerciseId, Number(e.target.value), currentInput.reps)
                        }
                        className="clean-input"
                        style={{ padding: '6px 8px', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={currentInput.reps || 8}
                        onChange={(e) =>
                          handleUpdatePattern(key, currentInput.exerciseId, currentInput.weightKg, Number(e.target.value))
                        }
                        className="clean-input"
                        style={{ padding: '6px 8px', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center' }}
                      />
                    </div>
                  </div>

                  {/* 1RM calculation & Progress bar */}
                  {evaluation && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>1RM Estimado: <strong>{evaluation.estimated1RMKg} kg</strong> (Equiv.: {evaluation.equivalentBenchmarkKg} kg)</span>
                        <span>{evaluation.levelScore}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${evaluation.levelScore}%`,
                            height: '100%',
                            background: 'var(--accent-primary)',
                            borderRadius: '999px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnosis & Actionable Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Detected Imbalance Alert */}
          {diagnosis.weaknesses.length > 0 && (
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <AlertTriangle size={15} /> Descompensación Detectada
              </div>
              <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.4 }}>
                {diagnosis.weaknesses[0]}
              </div>
            </div>
          )}

          {/* Practical Advice */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <CheckCircle2 size={16} /> En qué deberías enfocarte para ganar fuerza:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.5 }}>
              {diagnosis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

