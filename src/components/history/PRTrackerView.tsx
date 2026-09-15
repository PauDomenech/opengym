import React from 'react';
import { StorageService } from '../../services/storageService';
import { EXERCISES_DATA } from '../../data/exercisesData';
import { Award, Trophy } from 'lucide-react';

export const PRTrackerView: React.FC = () => {
  const prs = StorageService.getPersonalRecords();
  const prList = Object.values(prs);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Trophy size={24} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Récords Personales (PRs)</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Tus mejores marcas calculadas automáticamente según los entrenamientos completados.
        </p>
      </div>

      {prList.length === 0 ? (
        <div className="clean-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Award size={40} color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Sin récords personales aún</div>
          <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
            Completa series en tus entrenamientos para que tus PRs se registren aquí.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {prList.map((pr) => {
            const ex = EXERCISES_DATA.find((e) => e.id === pr.exerciseId);

            return (
              <div key={pr.exerciseId} className="clean-card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ex?.nameEs || pr.exerciseId}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ex?.name || ''}
                    </span>
                  </div>
                  <Award size={18} color="var(--accent-primary)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Mejor Peso
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {pr.maxWeightKg} kg
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      x {pr.maxWeightReps} reps
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      1RM Estimado
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
                      {pr.maxEstimated1RM} kg
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Fórmula Epley
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
