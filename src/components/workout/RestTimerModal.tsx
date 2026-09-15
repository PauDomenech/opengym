import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';
import { Play, Pause, RotateCcw, X, Minimize2 } from 'lucide-react';

interface RestTimerModalProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  onTimerComplete?: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
  onTimerComplete,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setSecondsLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0 && isOpen) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            soundService.playTimerCompleteSound();
            if (onTimerComplete) onTimerComplete();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, isOpen, onTimerComplete]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  const addTime = (secs: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + secs));
    setTotalSeconds((prev) => Math.max(prev, secondsLeft + secs));
    soundService.playClickSound();
  };

  if (isMinimized) {
    return (
      <div
        className="clean-card"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          zIndex: 950,
          borderRadius: 'var(--radius-pill)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.2)',
          cursor: 'pointer',
        }}
        onClick={() => setIsMinimized(false)}
      >
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
          }}
        />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          {formatTime(secondsLeft)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '360px', padding: '24px', textAlign: 'center' }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            className="clean-button-icon"
            style={{ width: '32px', height: '32px' }}
            title="Minimizar"
          >
            <Minimize2 size={16} />
          </button>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            Descanso entre Series
          </span>
          <button
            onClick={onClose}
            className="clean-button-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Circular Progress Ring */}
        <div style={{ position: 'relative', width: '190px', height: '190px', margin: '0 auto 16px auto' }}>
          <svg width="190" height="190" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="var(--accent-primary)"
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.6rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {formatTime(secondsLeft)}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {secondsLeft === 0 ? '¡A por la siguiente!' : 'Recuperando...'}
            </span>
          </div>
        </div>

        {/* Adjust Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
          <button className="clean-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => addTime(-15)}>
            -15s
          </button>
          <button className="clean-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => addTime(30)}>
            +30s
          </button>
          <button className="clean-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => addTime(60)}>
            +60s
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className="clean-button"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 14px' }}
            onClick={() => {
              setSecondsLeft(totalSeconds);
              setIsActive(true);
            }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            className={`clean-button ${isActive ? '' : 'clean-button-primary'}`}
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 20px', minWidth: '100px' }}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? (
              <>
                <Pause size={16} /> Pausar
              </>
            ) : (
              <>
                <Play size={16} /> Continuar
              </>
            )}
          </button>

          <button
            className="clean-button clean-button-primary"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px' }}
            onClick={onClose}
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  );
};
