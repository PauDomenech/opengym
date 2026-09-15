import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  COACH_TOPICS,
  COACH_CATEGORIES,
  CoachTopic,
  CoachCategory,
} from '../../data/scientificCoachData';
import {
  Sparkles,
  Search,
  ChevronLeft,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Send,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  topic?: CoachTopic;
  matchedVariant?: string;
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
  // Calculate total indexed questions dynamically
  const totalQuestionsCount = useMemo(() => {
    return COACH_TOPICS.reduce((acc, t) => acc + 1 + (t.questionVariants?.length || 0), 0);
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `¡Hola! Soy tu **Coach Científico OpenGym**.\n\nCuento con una base de conocimiento de **+${totalQuestionsCount} preguntas y escenarios indexados** basados en meta-análisis y estudios universitarios (Brad Schoenfeld, Morton & Phillips, Zourdos, Milo Wolf, Stu McGill, etc.).\n\n💡 **100% Offline y sin IA**: Respuestas instantáneas y rigurosas. Puedes escribir cualquier duda abajo o explorar por categorías:`,
      timestamp: 'Ahora',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<CoachCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Search through all topics, questions, variants, keywords and summary
  const filteredTopics = useMemo(() => {
    return COACH_TOPICS.filter((t) => {
      const matchesCat = activeCategory === 'all' || t.category === activeCategory;
      if (!matchesCat) return false;

      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase().trim();
      const inPrimary = t.question.toLowerCase().includes(term);
      const inShort = t.shortQuestion.toLowerCase().includes(term);
      const inSummary = t.summary.toLowerCase().includes(term);
      const inKeywords = t.keywords.some((k) => k.toLowerCase().includes(term));
      const inVariants = t.questionVariants.some((v) => v.toLowerCase().includes(term));
      const inStudies = t.keyStudies.some((s) => s.toLowerCase().includes(term));

      return inPrimary || inShort || inSummary || inKeywords || inVariants || inStudies;
    });
  }, [activeCategory, searchTerm]);

  // Handle direct selection of a topic
  const handleSelectTopic = (topic: CoachTopic, customQuestionText?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: customQuestionText || topic.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        topic: topic,
        matchedVariant: customQuestionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 250);
  };

  // Find best matching topic from natural language input
  const handleSendCustomQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    setInputText('');

    // Score all topics based on word intersections
    const queryWords = query
      .toLowerCase()
      .replace(/[¿?.,!¡]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    let bestMatch: CoachTopic | null = null;
    let bestScore = -1;

    for (const topic of COACH_TOPICS) {
      let score = 0;

      // Exact substring matches
      if (topic.question.toLowerCase().includes(query.toLowerCase())) score += 15;
      if (topic.shortQuestion.toLowerCase().includes(query.toLowerCase())) score += 12;

      // Match in variants
      for (const variant of topic.questionVariants) {
        if (variant.toLowerCase().includes(query.toLowerCase())) {
          score += 10;
        }
      }

      // Keyword & Word overlap
      for (const word of queryWords) {
        if (topic.keywords.some((k) => k.toLowerCase().includes(word))) score += 4;
        if (topic.question.toLowerCase().includes(word)) score += 3;
        if (topic.summary.toLowerCase().includes(word)) score += 2;
        if (topic.questionVariants.some((v) => v.toLowerCase().includes(word))) score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = topic;
      }
    }

    if (bestMatch && bestScore > 0) {
      handleSelectTopic(bestMatch, query);
    } else {
      // Fallback message if no match found
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `No he encontrado una coincidencia exacta para "${query}".\n\nPrueba buscando palabras clave como **"creatina"**, **"RIR"**, **"series"**, **"pecho superior"**, **"sentadilla"**, **"proteína"** o selecciona uno de los temas sugeridos abajo:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 250);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `¡Conversación reiniciada!\n\nPregunta sobre cualquier duda (+${totalQuestionsCount} preguntas indexadas) o explora por categorías:`,
        timestamp: 'Ahora',
      },
    ]);
    setSearchTerm('');
    setInputText('');
    setActiveCategory('all');
  };

  if (!isOpen) return null;

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div
        className="clean-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
              title="Cerrar modal"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#111318',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Coach Científico
                </h3>
                <span
                  style={{
                    background: '#eff6ff',
                    color: 'var(--accent-primary)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  +{totalQuestionsCount} Preguntas Indexadas
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                100% Offline • Respaldado por Meta-Análisis Universitarios
              </div>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="clean-button"
            style={{ padding: '6px 11px', fontSize: '0.75rem', gap: '4px' }}
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
            scrollbarWidth: 'none',
          }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className="clean-button"
            style={{
              padding: '5px 12px',
              fontSize: '0.76rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: activeCategory === 'all' ? 700 : 500,
              background: activeCategory === 'all' ? '#111318' : '#ffffff',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
              borderColor: activeCategory === 'all' ? '#111318' : '#e2e8f0',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📚 Todos ({COACH_TOPICS.length})
          </button>
          {COACH_CATEGORIES.map((cat) => {
            const count = COACH_TOPICS.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="clean-button"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  background: activeCategory === cat.id ? '#111318' : '#ffffff',
                  color: activeCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  borderColor: activeCategory === cat.id ? '#111318' : '#e2e8f0',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
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
                  maxWidth: '96%',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: '#111318',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
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
                        padding: '18px 20px',
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
                            fontSize: '1.12rem',
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
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', marginBottom: '2px' }}>
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
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Lightbulb size={14} color="#f59e0b" /> Cómo aplicarlo en tu entrenamiento:
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

                      {/* Question Variants Tags (Other ways people ask this) */}
                      {msg.topic.questionVariants && msg.topic.questionVariants.length > 0 && (
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MessageSquare size={12} /> Otras formas comunes de preguntar esto (+{msg.topic.questionVariants.length} variaciones indexadas):
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {msg.topic.questionVariants.slice(0, 8).map((variant, vIdx) => (
                              <span
                                key={vIdx}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  background: '#f1f5f9',
                                  color: '#475569',
                                  borderRadius: 'var(--radius-pill)',
                                }}
                              >
                                {variant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Question Chips */}
                      {msg.topic.relatedQuestionIds && msg.topic.relatedQuestionIds.length > 0 && (
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
                                    padding: '5px 11px',
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
                  borderRadius: '7px',
                  background: '#111318',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                }}
              >
                <Sparkles size={14} />
              </div>
              <span>Consultando meta-análisis y base de conocimiento...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggested Questions Grid (Drawer / Bottom Section) */}
        <div
          style={{
            padding: '12px 18px',
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
              placeholder={`Filtrar entre +${totalQuestionsCount} preguntas (ej: creatina, RIR, series, deload, dolor hombro)...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input"
              style={{
                padding: '8px 12px 8px 36px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>

          {/* Question Pills Horizontal / Wrap */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {filteredTopics.slice(0, 8).map((topic) => (
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

          {/* Natural Language Input Bar */}
          <form onSubmit={handleSendCustomQuery} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Haz tu pregunta al Coach (ej: ¿cuánta proteína debo tomar?)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="clean-input"
              style={{
                flex: 1,
                padding: '9px 14px',
                fontSize: '0.86rem',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <button
              type="submit"
              className="clean-button clean-button-primary"
              style={{ padding: '0 16px', borderRadius: 'var(--radius-md)' }}
              disabled={!inputText.trim()}
              title="Enviar pregunta"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScientificCoachModal;
