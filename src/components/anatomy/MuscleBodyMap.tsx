import React, { useState } from 'react';
import { MuscleGroup } from '../../types/exercise';
import { MUSCLES_INFO } from '../../data/musclesData';
import { EXERCISES_DATA } from '../../data/exercisesData';
import { Check, Layers, User, X } from 'lucide-react';

interface MuscleBodyMapProps {
  selectedMuscle: MuscleGroup | null;
  onSelectMuscle: (muscle: MuscleGroup | null) => void;
}

export const MuscleBodyMap: React.FC<MuscleBodyMapProps> = ({
  selectedMuscle,
  onSelectMuscle,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [mode, setMode] = useState<'map' | 'list'>('map');

  const handleMuscleClick = (muscle: MuscleGroup) => {
    if (selectedMuscle === muscle) {
      onSelectMuscle(null);
    } else {
      onSelectMuscle(muscle);
    }
  };

  const isSelected = (muscle: MuscleGroup) => selectedMuscle === muscle;

  const frontMuscles: MuscleGroup[] = [
    'chest',
    'shoulders',
    'biceps',
    'abdominals',
    'obliques',
    'quadriceps',
    'forearms',
  ];

  const backMuscles: MuscleGroup[] = [
    'traps',
    'lats',
    'shoulders',
    'triceps',
    'lower back',
    'glutes',
    'hamstrings',
    'calves',
  ];

  const currentMuscleList = view === 'front' ? frontMuscles : backMuscles;

  return (
    <div className="clean-card" style={{ padding: '20px', marginBottom: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Selector Muscular Anatómico
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Toca cualquier músculo para ver sus ejercicios específicos
          </p>
        </div>

        {/* View Switcher Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="clean-segmented" style={{ padding: '3px' }}>
            <button
              className={`clean-segment-btn ${view === 'front' ? 'active' : ''}`}
              onClick={() => setView('front')}
            >
              Frontal
            </button>
            <button
              className={`clean-segment-btn ${view === 'back' ? 'active' : ''}`}
              onClick={() => setView('back')}
            >
              Dorsal
            </button>
          </div>

          <button
            className="clean-button-icon"
            onClick={() => setMode(mode === 'map' ? 'list' : 'map')}
            title={mode === 'map' ? 'Ver lista en cuadrícula' : 'Ver modelo anatómico'}
          >
            {mode === 'map' ? <Layers size={18} /> : <User size={18} />}
          </button>
        </div>
      </div>

      {/* Selected Muscle Active Banner */}
      {selectedMuscle && (
        <div
          style={{
            background: 'var(--accent-primary-light)',
            border: '1px solid var(--accent-primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
              }}
            />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-primary)' }}>
              {MUSCLES_INFO[selectedMuscle]?.nameEs || selectedMuscle}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              ({EXERCISES_DATA.filter((e) => e.primaryMuscles.includes(selectedMuscle) || e.secondaryMuscles.includes(selectedMuscle)).length} ejercicios)
            </span>
          </div>
          <button
            onClick={() => onSelectMuscle(null)}
            style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--accent-primary)',
            }}
            title="Quitar filtro"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {mode === 'map' ? (
        /* HIGH PRECISION ATHLETIC SILHOUETTE */
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 12px',
            minHeight: '380px',
            border: '1px solid #e2e8f0',
          }}
        >
          {view === 'front' ? (
            /* FRONT HIGH-DEF ANATOMY SVG */
            <svg
              viewBox="0 0 300 480"
              style={{ width: '100%', maxWidth: '280px', height: 'auto', maxHeight: '420px', overflow: 'visible' }}
            >
              <defs>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#2563EB" flood-opacity="0.4" />
                </filter>
              </defs>

              {/* Head & Neck Base */}
              <path
                d="M150 18 C164 18 174 28 174 44 C174 58 165 70 156 74 L156 82 L144 82 L144 74 C135 70 126 58 126 44 C126 28 136 18 150 18 Z"
                fill="#cbd5e1"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Traps / Clavicle base */}
              <path
                d="M144 80 L156 80 L180 94 L120 94 Z"
                className={`anatomy-muscle-clean ${isSelected('traps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('traps')}
              >
                <title>Trapecios Superiores</title>
              </path>

              {/* Shoulders (Deltoids) Left & Right */}
              <path
                d="M118 94 C100 96 86 112 86 130 C86 142 94 148 104 144 C112 140 120 124 122 106 Z"
                className={`anatomy-muscle-clean ${isSelected('shoulders') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('shoulders')}
              >
                <title>Deltoides Anterior Derecho</title>
              </path>
              <path
                d="M182 94 C200 96 214 112 214 130 C214 142 206 148 196 144 C188 140 180 124 178 106 Z"
                className={`anatomy-muscle-clean ${isSelected('shoulders') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('shoulders')}
              >
                <title>Deltoides Anterior Izquierdo</title>
              </path>

              {/* Chest (Pectorals) */}
              <path
                d="M124 98 C138 98 148 102 148 134 C132 138 114 134 112 118 C112 106 116 98 124 98 Z"
                className={`anatomy-muscle-clean ${isSelected('chest') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('chest')}
              >
                <title>Pectoral Derecho</title>
              </path>
              <path
                d="M176 98 C162 98 152 102 152 134 C168 138 186 134 188 118 C188 106 184 98 176 98 Z"
                className={`anatomy-muscle-clean ${isSelected('chest') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('chest')}
              >
                <title>Pectoral Izquierdo</title>
              </path>

              {/* Biceps */}
              <path
                d="M92 144 C84 152 82 172 88 188 C96 190 102 184 106 170 C108 156 104 144 92 144 Z"
                className={`anatomy-muscle-clean ${isSelected('biceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('biceps')}
              >
                <title>Bíceps Derecho</title>
              </path>
              <path
                d="M208 144 C216 152 218 172 212 188 C204 190 198 184 194 170 C192 156 196 144 208 144 Z"
                className={`anatomy-muscle-clean ${isSelected('biceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('biceps')}
              >
                <title>Bíceps Izquierdo</title>
              </path>

              {/* Forearms */}
              <path
                d="M86 192 C76 202 70 230 70 250 C78 252 84 246 90 230 C94 214 94 198 86 192 Z"
                className={`anatomy-muscle-clean ${isSelected('forearms') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('forearms')}
              >
                <title>Antebrazo Derecho</title>
              </path>
              <path
                d="M214 192 C224 202 230 230 230 250 C222 252 216 246 210 230 C206 214 206 198 214 192 Z"
                className={`anatomy-muscle-clean ${isSelected('forearms') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('forearms')}
              >
                <title>Antebrazo Izquierdo</title>
              </path>
              <circle cx="68" cy="262" r="7" fill="#cbd5e1" />
              <circle cx="232" cy="262" r="7" fill="#cbd5e1" />

              {/* Abdominals (6-pack) */}
              <g
                className={`anatomy-muscle-clean ${isSelected('abdominals') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('abdominals')}
              >
                <title>Abdominales</title>
                <path d="M136 140 L148 140 L148 156 L136 156 Z" rx="3" />
                <path d="M152 140 L164 140 L164 156 L152 156 Z" rx="3" />
                <path d="M136 160 L148 160 L148 176 L136 176 Z" rx="3" />
                <path d="M152 160 L164 160 L164 176 L152 176 Z" rx="3" />
                <path d="M136 180 L148 180 L148 198 L136 198 Z" rx="3" />
                <path d="M152 180 L164 180 L164 198 L152 198 Z" rx="3" />
              </g>

              {/* Obliques */}
              <path
                d="M122 138 C130 144 134 170 134 196 C124 196 114 178 114 156 Z"
                className={`anatomy-muscle-clean ${isSelected('obliques') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('obliques')}
              >
                <title>Oblicuos Derechos</title>
              </path>
              <path
                d="M178 138 C170 144 166 170 166 196 C176 196 186 178 186 156 Z"
                className={`anatomy-muscle-clean ${isSelected('obliques') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('obliques')}
              >
                <title>Oblicuos Izquierdos</title>
              </path>

              {/* Pelvis */}
              <path d="M128 202 L172 202 L164 224 L136 224 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2" />

              {/* Quadriceps */}
              <path
                d="M126 226 C114 238 108 284 112 322 C120 332 136 332 142 322 C146 284 144 238 134 226 Z"
                className={`anatomy-muscle-clean ${isSelected('quadriceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('quadriceps')}
              >
                <title>Cuádriceps Derecho</title>
              </path>
              <path
                d="M174 226 C186 238 192 284 188 322 C180 332 164 332 158 322 C154 284 156 238 166 226 Z"
                className={`anatomy-muscle-clean ${isSelected('quadriceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('quadriceps')}
              >
                <title>Cuádriceps Izquierdo</title>
              </path>

              {/* Knees */}
              <ellipse cx="127" cy="336" rx="7" ry="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <ellipse cx="173" cy="336" rx="7" ry="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* Calves / Shins */}
              <path
                d="M118 346 C112 360 112 396 118 432 C124 438 134 438 138 432 C140 396 138 360 134 346 Z"
                className={`anatomy-muscle-clean ${isSelected('calves') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('calves')}
              >
                <title>Gemelos / Tibial Derecho</title>
              </path>
              <path
                d="M182 346 C188 360 188 396 182 432 C176 438 166 438 162 432 C160 396 162 360 166 346 Z"
                className={`anatomy-muscle-clean ${isSelected('calves') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('calves')}
              >
                <title>Gemelos / Tibial Izquierdo</title>
              </path>

              {/* Feet */}
              <path d="M116 438 L138 438 L142 458 L110 458 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="4" />
              <path d="M184 438 L162 438 L158 458 L190 458 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="4" />
            </svg>
          ) : (
            /* BACK HIGH-DEF ANATOMY SVG */
            <svg
              viewBox="0 0 300 480"
              style={{ width: '100%', maxWidth: '280px', height: 'auto', maxHeight: '420px', overflow: 'visible' }}
            >
              <path
                d="M150 18 C164 18 174 28 174 44 C174 58 165 70 156 74 L156 82 L144 82 L144 74 C135 70 126 58 126 44 C126 28 136 18 150 18 Z"
                fill="#cbd5e1"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Trapezius */}
              <path
                d="M136 78 L164 78 L184 100 L150 158 L116 100 Z"
                className={`anatomy-muscle-clean ${isSelected('traps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('traps')}
              >
                <title>Trapecios</title>
              </path>

              {/* Rear Deltoids */}
              <path
                d="M114 98 C98 100 86 116 86 132 C86 142 94 146 104 142 C110 136 118 120 118 108 Z"
                className={`anatomy-muscle-clean ${isSelected('shoulders') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('shoulders')}
              >
                <title>Deltoides Posterior Derecho</title>
              </path>
              <path
                d="M186 98 C202 100 214 116 214 132 C214 142 206 146 196 142 C190 136 182 120 182 108 Z"
                className={`anatomy-muscle-clean ${isSelected('shoulders') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('shoulders')}
              >
                <title>Deltoides Posterior Izquierdo</title>
              </path>

              {/* Triceps */}
              <path
                d="M88 138 C80 148 78 170 84 188 C94 190 102 182 104 168 C106 152 100 138 88 138 Z"
                className={`anatomy-muscle-clean ${isSelected('triceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('triceps')}
              >
                <title>Tríceps Derecho</title>
              </path>
              <path
                d="M212 138 C220 148 222 170 216 188 C206 190 198 182 196 168 C194 152 200 138 212 138 Z"
                className={`anatomy-muscle-clean ${isSelected('triceps') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('triceps')}
              >
                <title>Tríceps Izquierdo</title>
              </path>

              {/* Forearms */}
              <path
                d="M82 192 C72 202 68 230 68 250 C76 252 82 246 88 230 C92 214 92 198 82 192 Z"
                className={`anatomy-muscle-clean ${isSelected('forearms') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('forearms')}
              >
                <title>Antebrazos</title>
              </path>
              <path
                d="M218 192 C228 202 232 230 232 250 C224 252 218 246 212 230 C208 214 208 198 218 192 Z"
                className={`anatomy-muscle-clean ${isSelected('forearms') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('forearms')}
              >
                <title>Antebrazos</title>
              </path>
              <circle cx="66" cy="262" r="7" fill="#cbd5e1" />
              <circle cx="234" cy="262" r="7" fill="#cbd5e1" />

              {/* Latissimus Dorsi (Lats) */}
              <path
                d="M118 118 C110 138 108 174 132 194 C136 172 140 152 148 140 C132 132 122 124 118 118 Z"
                className={`anatomy-muscle-clean ${isSelected('lats') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('lats')}
              >
                <title>Dorsal Ancho Derecho (Lats)</title>
              </path>
              <path
                d="M182 118 C190 138 192 174 168 194 C164 172 160 152 152 140 C168 132 178 124 182 118 Z"
                className={`anatomy-muscle-clean ${isSelected('lats') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('lats')}
              >
                <title>Dorsal Ancho Izquierdo (Lats)</title>
              </path>

              {/* Lower Back (Lumbar) */}
              <path
                d="M136 194 L164 194 L160 226 L140 226 Z"
                className={`anatomy-muscle-clean ${isSelected('lower back') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('lower back')}
              >
                <title>Lumbar (Erectores Espinales)</title>
              </path>

              {/* Glutes */}
              <path
                d="M124 228 C112 232 108 258 114 280 C124 290 142 288 146 276 C148 260 148 242 144 228 Z"
                className={`anatomy-muscle-clean ${isSelected('glutes') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('glutes')}
              >
                <title>Glúteo Mayor Derecho</title>
              </path>
              <path
                d="M176 228 C188 232 192 258 186 280 C176 290 158 288 154 276 C152 260 152 242 156 228 Z"
                className={`anatomy-muscle-clean ${isSelected('glutes') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('glutes')}
              >
                <title>Glúteo Mayor Izquierdo</title>
              </path>

              {/* Hamstrings */}
              <path
                d="M118 288 C112 300 110 326 114 340 C124 346 136 346 142 340 C146 326 144 300 138 288 Z"
                className={`anatomy-muscle-clean ${isSelected('hamstrings') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('hamstrings')}
              >
                <title>Isquiotibiales Derechos</title>
              </path>
              <path
                d="M182 288 C188 300 190 326 186 340 C176 346 164 346 158 340 C154 326 156 300 162 288 Z"
                className={`anatomy-muscle-clean ${isSelected('hamstrings') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('hamstrings')}
              >
                <title>Isquiotibiales Izquierdos</title>
              </path>

              {/* Calves */}
              <path
                d="M116 348 C108 362 110 398 118 432 C124 438 134 438 138 432 C142 398 142 362 134 348 Z"
                className={`anatomy-muscle-clean ${isSelected('calves') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('calves')}
              >
                <title>Gemelos Derechos</title>
              </path>
              <path
                d="M184 348 C192 362 190 398 182 432 C176 438 166 438 162 432 C158 398 158 362 166 348 Z"
                className={`anatomy-muscle-clean ${isSelected('calves') ? 'active' : ''}`}
                onClick={() => handleMuscleClick('calves')}
              >
                <title>Gemelos Izquierdos</title>
              </path>

              {/* Feet */}
              <path d="M116 438 L138 438 L140 456 L112 456 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <path d="M184 438 L162 438 L160 456 L188 456 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            </svg>
          )}
        </div>
      ) : (
        /* FAST GRID LIST MODE */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {currentMuscleList.map((m) => {
            const count = EXERCISES_DATA.filter(
              (e) => e.primaryMuscles.includes(m) || e.secondaryMuscles.includes(m)
            ).length;

            return (
              <div
                key={m}
                onClick={() => handleMuscleClick(m)}
                style={{
                  background: isSelected(m) ? 'var(--accent-primary)' : '#f8fafc',
                  color: isSelected(m) ? '#ffffff' : 'var(--text-primary)',
                  border: `1px solid ${isSelected(m) ? 'var(--accent-primary)' : '#e2e8f0'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected(m) ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {MUSCLES_INFO[m]?.nameEs.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.74rem', opacity: 0.8, marginTop: '2px' }}>
                  {count} ejercicios
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Elegant, Modern Muscle Pills with refined typography and subtle borders */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingTop: '16px',
          scrollbarWidth: 'none',
        }}
      >
        {currentMuscleList.map((m) => {
          const active = isSelected(m);
          return (
            <button
              key={m}
              onClick={() => handleMuscleClick(m)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                background: active ? 'var(--accent-primary)' : '#ffffff',
                color: active ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${active ? 'var(--accent-primary)' : '#e2e8f0'}`,
                boxShadow: active ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {active && <Check size={13} />}
              {MUSCLES_INFO[m]?.nameEs.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
