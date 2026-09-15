import React, { useState, useRef, useEffect } from 'react';
import { COACH_TOPICS, CoachTopic } from '../../data/scientificCoachData';
import {
  Sparkles,
  Search,
  ChevronLeft,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  topic?: CoachTopic;
  timestamp: string;
}

interface ScientificCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificCoachModal: React.FC<ScientificCoachModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '¡Hola! Soy tu **Coach Científico OpenGym**. Estoy programado con la evidencia más sólida de la literatura deportiva (meta-análisis de Schoenfeld, Morton, Phillips, Zourdos, etc.) y funciono **100% offline** sin APIs ni costes.\n\n¿Sobre qué tema te gustaría consultar hoy? Puedes buscar directamente o elegir una de las preguntas guiadas:',
      timestamp: 'Ahora',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'hypertrophy', label: '🔬 Hipertrofia' },
    { key: 'strength', label: '⚡ Fuerza' },
    { key: 'nutrition', label: '🥗 Nutrición' },
    { key: 'recovery', label: '🛌 Descanso & Deload' },
    { key: 'biomechanics', label: '🛡️ Articulaciones' },
    { key: 'cardio', label: '🏃 Cardio' },
  ];

  const filteredTopics = COACH_TOPICS.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      t.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectTopic = (topic: CoachTopic) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: topic.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulate swift, natural offline response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        topic: topic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 280);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: '¡Conversación reiniciada! Selecciona cualquier tema para ver su desglose basado en evidencia científica:',
        timestamp: 'Ahora',
      },
    ]);
    setSearchTerm('');
    setActiveCategory('all');
  };

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          background: '#ffffff',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              className="clean-button-icon"
              style={{ width: '36px', height: '36px' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#111318',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Coach Científico
                </h3>
                <span
                  style={{
                    background: '#eff6ff',
                    color: 'var(--accent-primary)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  100% Offline
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Basado en Meta-Análisis & Evidencia Universitaria
              </div>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="clean-button"
            style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }}
            title="Reiniciar chat"
          >
            <RotateCcw size={13} /> Reiniciar
          </button>
        </div>

        {/* Category Selector Filter Bar */}
        <div
          style={{
            padding: '10px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="clean-button"
              style={{
                padding: '5px 12px',
                fontSize: '0.76rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: activeCategory === cat.key ? 700 : 500,
                background: activeCategory === cat.key ? '#111318' : '#ffffff',
                color: activeCategory === cat.key ? '#ffffff' : 'var(--text-secondary)',
                borderColor: activeCategory === cat.key ? '#111318' : '#e2e8f0',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Chat Feed Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#f8fafc',
          }}
        >
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '82%',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '18px 18px 4px 18px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  {msg.text}
                </div>
              );
            }

            // Bot Response
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '92%',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#111318',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Sparkles size={16} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {msg.text && (
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '14px 16px',
                        borderRadius: '4px 18px 18px 18px',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        color: 'var(--text-primary)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.topic && (
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px 18px 18px 18px',
                        padding: '18px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      {/* Topic Header & Category */}
                      <div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {msg.topic.categoryLabel}
                        </span>
                        <h4
                          style={{
                            fontSize: '1.08rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            margin: '4px 0 0 0',
                            lineHeight: 1.3,
                          }}
                        >
                          {msg.topic.question}
                        </h4>
                      </div>

                      {/* Summary Box */}
                      <div
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#15803d', marginBottom: '2px' }}>
                            CONCLUSIÓN CIENTÍFICA (TL;DR)
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 600, lineHeight: 1.4 }}>
                            {msg.topic.summary}
                          </div>
                        </div>
                      </div>

                      {/* Scientific Evidence Body */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                          🔬 Evidencia & Mecanismos Fisiológicos:
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                          {msg.topic.scientificEvidence}
                        </p>
                      </div>

                      {/* Practical Advice Bullets */}
                      <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          💡 Cómo aplicarlo en tu entrenamiento:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {msg.topic.practicalAdvice.map((adv, idx) => (
                            <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Studies Cited Footer */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                          <BookOpen size={13} /> Meta-Análisis & Revisiones de Referencia:
                        </div>
                        {msg.topic.keyStudies.map((std, idx) => (
                          <div key={idx} style={{ fontSize: '0.73rem', color: '#64748b', fontStyle: 'italic', marginBottom: '2px' }}>
                            • {std}
                          </div>
                        ))}
                      </div>

                      {/* Follow-up Question Chips */}
                      {msg.topic.relatedQuestionIds.length > 0 && (
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Preguntas relacionadas:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {msg.topic.relatedQuestionIds.map((relId) => {
                              const relTopic = COACH_TOPICS.find((t) => t.id === relId);
                              if (!relTopic) return null;
                              return (
                                <button
                                  key={relId}
                                  onClick={() => handleSelectTopic(relTopic)}
                                  className="clean-button"
                                  style={{
                                    padding: '5px 10px',
                                    fontSize: '0.76rem',
                                    borderRadius: 'var(--radius-pill)',
                                    background: '#eff6ff',
                                    color: 'var(--accent-primary)',
                                    borderColor: '#bfdbfe',
                                    fontWeight: 600,
                                  }}
                                >
                                  {relTopic.shortQuestion} <ArrowRight size={12} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#111318',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <Sparkles size={14} />
              </div>
              <span>Consultando literatura científica...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggested Questions Grid (Drawer / Bottom Section) */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Search bar inside coach */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar tema (ej: creatina, RIR, series, deload, dolor hombro)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input"
              style={{
                padding: '8px 12px 8px 36px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>

          {/* Question Pills Horizontal / Wrap */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {filteredTopics.slice(0, 6).map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className="clean-button"
                style={{
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  borderRadius: 'var(--radius-pill)',
                  background: '#f8fafc',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <HelpCircle size={13} color="var(--accent-primary)" />
                {topic.shortQuestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
