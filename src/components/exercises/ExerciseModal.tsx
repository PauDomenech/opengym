import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types/exercise';
import { EQUIPMENT_LIST } from '../../data/equipmentList';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Plus,
  Dumbbell,
} from 'lucide-react';

interface ExerciseModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  onClose,
  onAddToWorkout,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsPlaying(false);
    setImgError(false);
  }, [exercise]);

  useEffect(() => {
    if (!isPlaying || !exercise || exercise.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % exercise.images.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying, exercise]);

  if (!exercise) return null;

  const equipmentObj = EQUIPMENT_LIST.find((eq) => eq.id === exercise.equipment);
  const totalImages = exercise.images.length || 1;
  const progressPercent = ((currentImageIndex + 1) / totalImages) * 100;

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', maxWidth: '580px' }}
      >
        {/* Top Header Bar with Back Arrow & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={onClose}
            className="clean-button-icon"
            style={{ width: '38px', height: '38px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Detalles del Ejercicio
          </h3>
          <div style={{ width: '38px' }} />
        </div>

        {/* Subheader with Name & Step Count */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Ejercicio
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {exercise.nameEs}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {equipmentObj?.nameEs || exercise.equipment}
            </div>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent-primary)',
            }}
          >
            {currentImageIndex + 1}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/{totalImages}</span>
          </div>
        </div>

        {/* Main Image Stage */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            height: '310px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
          }}
        >
          {!imgError && exercise.images.length > 0 ? (
            <img
              src={exercise.images[currentImageIndex]}
              alt={`${exercise.nameEs} - Paso ${currentImageIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <Dumbbell size={48} />
              <div style={{ fontSize: '0.8rem', marginTop: '6px' }}>Demostración Visual</div>
            </div>
          )}

          {exercise.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev - 1 + exercise.images.length) % exercise.images.length
                  )
                }
                style={{
                  position: 'absolute',
                  left: '12px',
                  background: 'rgba(255,255,255,0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % exercise.images.length)
                }
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'rgba(255,255,255,0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${progressPercent}%`,
              height: '4px',
              background: 'var(--accent-primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Instrucciones de Ejecución
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exercise.instructionsEs.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big Circular Blue Play / Add Button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
          </button>

          {onAddToWorkout && (
            <button
              className="clean-button clean-button-primary"
              style={{ padding: '12px 20px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
            >
              <Plus size={18} /> Añadir a mi sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
