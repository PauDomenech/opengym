import React from 'react';
import { EquipmentType, ExerciseCategory } from '../../types/exercise';
import { EQUIPMENT_LIST } from '../../data/equipmentList';
import { Search, X, ShieldCheck } from 'lucide-react';

interface ExerciseSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedEquipment: EquipmentType | 'all';
  onSelectEquipment: (eq: EquipmentType | 'all') => void;
  selectedCategory: ExerciseCategory | 'all';
  onSelectCategory: (cat: ExerciseCategory | 'all') => void;
  filterByGym: boolean;
  onToggleFilterByGym: (enabled: boolean) => void;
  totalExercisesCount: number;
}

export const ExerciseSearch: React.FC<ExerciseSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedEquipment,
  onSelectEquipment,
  selectedCategory,
  onSelectCategory,
  filterByGym,
  onToggleFilterByGym,
  totalExercisesCount,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
      {/* Search Input Bar (Matching Screen 1 "Search your class...") */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            className="clean-input"
            style={{ paddingLeft: '44px', paddingRight: searchTerm ? '38px' : '16px' }}
            placeholder="Buscar ejercicio o máquina..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* My Gym Filter Toggle */}
        <button
          className={`clean-button ${filterByGym ? 'clean-button-primary' : ''}`}
          onClick={() => onToggleFilterByGym(!filterByGym)}
          style={{
            whiteSpace: 'nowrap',
            padding: '11px 16px',
            fontSize: '0.86rem',
            borderRadius: 'var(--radius-md)',
          }}
          title={filterByGym ? 'Filtrando por tu gimnasio' : 'Mostrar todos los ejercicios'}
        >
          <ShieldCheck size={16} />
          <span>{filterByGym ? 'Mi Gym' : 'Todo'}</span>
        </button>
      </div>

      {/* Filter Row: Equipment Dropdown & Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
        }}
      >
        <select
          value={selectedEquipment}
          onChange={(e) => onSelectEquipment(e.target.value as EquipmentType | 'all')}
          className="clean-input"
          style={{
            width: 'auto',
            padding: '7px 14px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          <option value="all">🏋️ Todo el material</option>
          {EQUIPMENT_LIST.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nameEs}
            </option>
          ))}
        </select>

        <button
          className={`clean-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
          style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Todos
        </button>
        <button
          className={`clean-pill ${selectedCategory === 'hypertrophy' ? 'active' : ''}`}
          onClick={() => onSelectCategory('hypertrophy')}
          style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Hipertrofia
        </button>
        <button
          className={`clean-pill ${selectedCategory === 'strength' ? 'active' : ''}`}
          onClick={() => onSelectCategory('strength')}
          style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Fuerza
        </button>
        <button
          className={`clean-pill ${selectedCategory === 'calisthenics' ? 'active' : ''}`}
          onClick={() => onSelectCategory('calisthenics')}
          style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Calistenia
        </button>

        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {totalExercisesCount} ejercicios
        </span>
      </div>
    </div>
  );
};
