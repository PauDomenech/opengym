import React, { useState } from 'react';
import { Exercise } from '../../types/exercise';
import { MUSCLES_INFO } from '../../data/musclesData';
import { EQUIPMENT_LIST } from '../../data/equipmentList';
import { Dumbbell, Eye, Plus } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onQuickAdd?: (exercise: Exercise) => void;
  isAvailableInGym?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onSelect,
  onQuickAdd,
  isAvailableInGym = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const primaryMuscle = exercise.primaryMuscles[0];
  const muscleName = MUSCLES_INFO[primaryMuscle]?.nameEs.split(' ')[0] || primaryMuscle;
  const equipmentObj = EQUIPMENT_LIST.find((eq) => eq.id === exercise.equipment);

  return (
    <div
      className="clean-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: isAvailableInGym ? 1 : 0.6,
        background: '#ffffff',
      }}
    >
      {/* Thumbnail Container */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onSelect(exercise)}
      >
        {!imgError && exercise.images.length > 0 ? (
          <img
            src={exercise.images[0]}
            alt={exercise.nameEs}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
            <Dumbbell size={32} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>OpenGym</span>
          </div>
        )}

        {/* Category & Muscle Tags */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            {muscleName}
          </span>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {exercise.level === 'beginner' ? 'Fácil' : exercise.level === 'intermediate' ? 'Medio' : 'Pro'}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4
            style={{
              fontSize: '1.02rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '3px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            onClick={() => onSelect(exercise)}
          >
            {exercise.nameEs}
          </h4>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {equipmentObj?.nameEs || exercise.equipment}
          </div>
        </div>

        {/* Actions Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto' }}>
          <button
            className="clean-button"
            style={{ flex: 1, padding: '8px 14px', fontSize: '0.84rem' }}
            onClick={() => onSelect(exercise)}
          >
            <Eye size={15} /> Ver técnica
          </button>

          {onQuickAdd && (
            <button
              className="clean-button clean-button-primary"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
              onClick={() => onQuickAdd(exercise)}
              title="Añadir a mi entrenamiento"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
