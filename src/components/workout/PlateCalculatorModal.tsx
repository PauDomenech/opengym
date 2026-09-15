import React, { useState } from 'react';
import { X, Dumbbell } from 'lucide-react';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const PLATE_COLORS: Record<number, string> = {
  25: '#ef4444', // Red
  20: '#2563eb', // Royal Blue
  15: '#eab308', // Yellow
  10: '#10b981', // Green
  5: '#ffffff', // White
  2.5: '#0f172a', // Black
  1.25: '#94a3b8', // Silver
};

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 60,
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);

  if (!isOpen) return null;

  const calculatePlates = () => {
    let weightPerSide = Math.max(0, (targetWeight - barWeight) / 2);
    const result: Array<{ weight: number; count: number }> = [];

    AVAILABLE_PLATES.forEach((plate) => {
      const count = Math.floor(weightPerSide / plate);
      if (count > 0) {
        result.push({ weight: plate, count });
        weightPerSide -= count * plate;
      }
    });

    return result;
  };

  const platesPerSide = calculatePlates();

  const repCalculations = [
    { reps: 1, percent: 100 },
    { reps: 3, percent: 93 },
    { reps: 5, percent: 87 },
    { reps: 8, percent: 80 },
    { reps: 10, percent: 75 },
    { reps: 12, percent: 70 },
  ];

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div className="clean-modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={20} color="var(--accent-primary)" />
            Calculadora de Discos & 1RM
          </h3>
          <button onClick={onClose} className="clean-button-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Weight Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Peso Objetivo (kg)
            </label>
            <input
              type="number"
              className="clean-input"
              style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0' }}
              value={targetWeight || ''}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              step="2.5"
              min="0"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Barra (kg)
            </label>
            <select
              className="clean-input"
              style={{ height: '52px', fontSize: '0.9rem', background: '#ffffff', border: '1px solid #e2e8f0' }}
              value={barWeight}
              onChange={(e) => setBarWeight(Number(e.target.value))}
            >
              <option value={20}>20 kg (Olímpica)</option>
              <option value={15}>15 kg (Mujer)</option>
              <option value={10}>10 kg (Técnica)</option>
              <option value={8}>8 kg (Barra Z)</option>
              <option value={0}>0 kg (Máquina)</option>
            </select>
          </div>
        </div>

        {/* Visual Barbell Representation */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 12px',
            marginBottom: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '14px' }}>
            Discos por cada lado ({Math.max(0, (targetWeight - barWeight) / 2)} kg/lado):
          </div>

          {/* Bar Diagram with Plates */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '80px',
            }}
          >
            <div style={{ width: '36px', height: '12px', background: '#cbd5e1', borderRadius: '4px 0 0 4px' }} />

            {platesPerSide.length === 0 ? (
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Solo la barra sin discos</span>
            ) : (
              platesPerSide.map((p, idx) =>
                Array.from({ length: p.count }).map((_, cIdx) => (
                  <div
                    key={`${idx}-${cIdx}`}
                    style={{
                      width: `${Math.max(14, p.weight * 1.3)}px`,
                      height: `${Math.min(84, 42 + p.weight * 1.6)}px`,
                      background: PLATE_COLORS[p.weight] || '#2563eb',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: p.weight === 5 ? '#000' : '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                    title={`${p.weight} kg`}
                  >
                    {p.weight}
                  </div>
                ))
              )
            )}

            <div style={{ width: '100px', height: '16px', background: '#94a3b8', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
            {platesPerSide.map((p) => (
              <span key={p.weight} className="clean-pill active" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                {p.count}x {p.weight} kg
              </span>
            ))}
          </div>
        </div>

        {/* 1RM Estimation Table */}
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Porcentajes de Carga (Basado en {targetWeight} kg como 1RM)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {repCalculations.map((item) => (
              <div
                key={item.reps}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {item.reps} Reps ({item.percent}%)
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {Math.round((targetWeight * item.percent) / 100 * 2) / 2} kg
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
