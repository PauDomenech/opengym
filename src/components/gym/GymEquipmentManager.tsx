import React, { useState } from 'react';
import { GymInventory, EquipmentType } from '../../types/equipment';
import { EQUIPMENT_LIST, GYM_PRESETS } from '../../data/equipmentList';
import { StorageService } from '../../services/storageService';
import {
  Dumbbell,
  Circle,
  Building2,
  Home,
  Zap,
  Search,
  Check,
} from 'lucide-react';

interface GymEquipmentManagerProps {
  inventory: GymInventory;
  onUpdateInventory: (newInventory: GymInventory) => void;
  filterByGym: boolean;
  onToggleFilterByGym: (enabled: boolean) => void;
}

export const GymEquipmentManager: React.FC<GymEquipmentManagerProps> = ({
  inventory,
  onUpdateInventory,
  filterByGym,
  onToggleFilterByGym,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const activeCount = Object.values(inventory).filter(Boolean).length;
  const totalCount = EQUIPMENT_LIST.length;

  const handleToggle = (id: EquipmentType) => {
    const updated = {
      ...inventory,
      [id]: !inventory[id],
    };
    onUpdateInventory(updated);
    StorageService.saveGymInventory(updated);
  };

  const handleApplyPreset = (equipmentIds: EquipmentType[]) => {
    const updated: Partial<GymInventory> = {};
    EQUIPMENT_LIST.forEach((eq) => {
      updated[eq.id] = equipmentIds.includes(eq.id);
    });
    const finalInventory = updated as GymInventory;
    onUpdateInventory(finalInventory);
    StorageService.saveGymInventory(finalInventory);
  };

  const handleSelectAll = (select: boolean) => {
    const updated: Partial<GymInventory> = {};
    EQUIPMENT_LIST.forEach((eq) => {
      updated[eq.id] = select;
    });
    const finalInventory = updated as GymInventory;
    onUpdateInventory(finalInventory);
    StorageService.saveGymInventory(finalInventory);
  };

  const categories = [
    { key: 'all', label: 'Todo el Material' },
    { key: 'machines', label: 'Máquinas & Poleas' },
    { key: 'free_weights', label: 'Pesas Libres' },
    { key: 'accessories', label: 'Bancos & Soportes' },
    { key: 'bodyweight', label: 'Calistenia' },
  ];

  const filteredEquipment = EQUIPMENT_LIST.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      item.nameEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner Card */}
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Mi Gimnasio & Material
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '560px' }}>
              Marca las máquinas específicas y pesos que tienes disponibles para filtrar solo los ejercicios que realmente puedes hacer.
            </p>
          </div>

          {/* Filter Switch */}
          <button
            onClick={() => onToggleFilterByGym(!filterByGym)}
            className={`clean-button ${filterByGym ? 'clean-button-primary' : ''}`}
            style={{ padding: '10px 18px', fontWeight: 700 }}
          >
            {filterByGym ? '✓ Filtro de Gym Activo' : 'Activar Filtro de Gym'}
          </button>
        </div>

        {/* Quick Presets */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
            Perfiles Rápidos Predefinidos:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {GYM_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset.equipment)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}
                >
                  {preset.id === 'commercial' && <Building2 size={20} />}
                  {preset.id === 'basic_gym' && <Dumbbell size={20} />}
                  {preset.id === 'home_dumbbells' && <Home size={20} />}
                  {preset.id === 'calisthenics' && <Zap size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{preset.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{preset.equipment.length} máquinas/pesos</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Buscar máquina o peso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="clean-input"
                style={{ paddingLeft: '36px', fontSize: '0.86rem', padding: '8px 12px 8px 36px' }}
              />
            </div>

            {/* Bulk Actions & Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>{activeCount}</strong> / <strong>{totalCount}</strong> marcados
              </span>
              <button onClick={() => handleSelectAll(true)} className="clean-button" style={{ fontSize: '0.76rem', padding: '5px 10px' }}>
                Marcar todos
              </button>
              <button onClick={() => handleSelectAll(false)} className="clean-button" style={{ fontSize: '0.76rem', padding: '5px 10px' }}>
                Desmarcar
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="clean-button"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: activeCategory === cat.key ? 700 : 500,
                  background: activeCategory === cat.key ? 'var(--accent-primary)' : '#f8fafc',
                  color: activeCategory === cat.key ? '#ffffff' : 'var(--text-primary)',
                  borderColor: activeCategory === cat.key ? 'var(--accent-primary)' : '#e2e8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Grid with Large Photos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
        {filteredEquipment.map((item) => {
          const isAvailable = !!inventory[item.id];
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className="clean-card"
              style={{
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                border: `2px solid ${isAvailable ? 'var(--accent-primary)' : '#e2e8f0'}`,
                boxShadow: isAvailable ? '0 6px 20px rgba(37, 99, 235, 0.14)' : '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isAvailable) e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                if (!isAvailable) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Large Photo Header */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  background: '#f1f5f9',
                  overflow: 'hidden',
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.nameEs}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isAvailable ? 'none' : 'grayscale(35%) opacity(0.85)',
                      transition: 'transform 0.3s ease, filter 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <Dumbbell size={36} />
                  </div>
                )}

                {/* Gradient overlay for contrast */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Status Toggle Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: isAvailable ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.9)',
                    color: isAvailable ? '#ffffff' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {isAvailable ? (
                    <>
                      <Check size={13} strokeWidth={3} /> En mi Gimnasio
                    </>
                  ) : (
                    <>+ No disponible</>
                  )}
                </div>

                {/* Category tag */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {item.category === 'machines'
                    ? '⚙️ Máquina'
                    : item.category === 'free_weights'
                    ? '🏋️ Peso Libre'
                    : item.category === 'accessories'
                    ? '🪑 Banco / Soporte'
                    : '🤸 Calistenia'}
                </div>
              </div>

              {/* Text Body */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: isAvailable ? 'var(--text-primary)' : 'var(--text-secondary)',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.nameEs}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', color: isAvailable ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {isAvailable ? '✓ Ejercicios habilitados' : 'Bloqueado por filtro'}
                  </span>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isAvailable ? 'var(--accent-primary)' : '#f1f5f9',
                      color: isAvailable ? '#ffffff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isAvailable ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

