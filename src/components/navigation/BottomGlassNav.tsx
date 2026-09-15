import React from 'react';
import { Dumbbell, Activity, Building2, Calendar, Trophy } from 'lucide-react';

export type NavTab = 'workout' | 'exercises' | 'gym' | 'history' | 'prs';

interface BottomGlassNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  hasActiveWorkout: boolean;
}

export const BottomGlassNav: React.FC<BottomGlassNavProps> = ({
  currentTab,
  onTabChange,
  hasActiveWorkout,
}) => {
  return (
    <nav className="clean-dock">
      <button
        className={`clean-dock-item ${currentTab === 'workout' ? 'active' : ''}`}
        onClick={() => onTabChange('workout')}
      >
        <div style={{ position: 'relative' }}>
          <Dumbbell size={22} />
          {hasActiveWorkout && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-3px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
              }}
            />
          )}
        </div>
        <span>Entrenar</span>
      </button>

      <button
        className={`clean-dock-item ${currentTab === 'exercises' ? 'active' : ''}`}
        onClick={() => onTabChange('exercises')}
      >
        <Activity size={22} />
        <span>Ejercicios</span>
      </button>

      <button
        className={`clean-dock-item ${currentTab === 'gym' ? 'active' : ''}`}
        onClick={() => onTabChange('gym')}
      >
        <Building2 size={22} />
        <span>Mi Gym</span>
      </button>

      <button
        className={`clean-dock-item ${currentTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        <Calendar size={22} />
        <span>Actividad</span>
      </button>

      <button
        className={`clean-dock-item ${currentTab === 'prs' ? 'active' : ''}`}
        onClick={() => onTabChange('prs')}
      >
        <Trophy size={22} />
        <span>Récords</span>
      </button>
    </nav>
  );
};
