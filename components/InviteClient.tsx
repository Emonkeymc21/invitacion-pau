'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatLocalDate } from '@/lib/time';

type ApiResponse = {
  invitation: {
    slug: string;
    nombre: string;
    nickname?: string;
    title: string;
    verse: string;
    verseRef: string;
    unlockAtArgentina: string;
    unlockAtArgentinaFormatted: string;
    meetUrl: string;
  };
  content: {
    intro: string[];
    objetivos: string[];
    actividades: string[];
    videoUrl?: string;
    bloques: Array<{
      titulo: string;
      lema?: string;
      intro?: string;
      preguntas?: string[];
      nota?: string;
      oracion?: string[];
    }>;
    cierre: string[];
    animadores?: Array<{
      nombre: string;
      telefono: string;
      waLink: string;
    }>;
  };
};

type PublicInvitation = {
  nombre: string;
  nickname?: string;
  unlockAtArgentina: string;
  unlockAtArgentinaFormatted: string;
};

/* --- Componente Auxiliar: Narrador de Carta por Voz --- */
function AudioNarrator({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  function toggleSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la función de voz.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-AR';
      utterance.rate = 0.9; // Tono pausado y cálido

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button
        type="button"
        onClick={toggleSpeech}
        className="action-button secondary"
        style={{ fontSize: '0.9rem', padding: '10px 20px' }}
      >
        {speaking ? '⏸️ Pausar Narración' : '🎙️ Escuchar la Carta Narrada por IA'}
      </button>
    </div>
  );
}

/* --- Componente Auxiliar: Acompañante de Discernimiento (Gemini) --- */
function DiscernmentAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: '¡Hola, Pau! 🕊️ Soy tu espacio de acompañamiento espiritual. Si sentís alguna duda, inquietud o alegría sobre este llamado al servicio, podés escribirme para que lo reflexionemos juntos a la luz de San Ignacio.'
    }
  ]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const historyFormatted = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/discernment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: historyFormatted })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Hubo un inconveniente al conectar. No dudes en consultarlo en oración o charlarlo directamente con Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783) 💕.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-section" style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--line)' }}>
      <h3 style={{ color: '#701c35', textAlign: 'center' }}>🕊️ Espacio de Discernimiento Ignaciano</h3>
      <p className="body-copy" style={{ fontStyle: 'italic', fontSize: '0.95rem', textAlign: 'center', marginBottom: '18px' }}>
        “Examinar las mociones del alma con paz, libertad y oración”
      </p>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px',
          border: '1px solid #f3d0d9',
          maxHeight: '350px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '14px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? '#9a2b4b' : '#fbebf0',
              color: m.role === 'user' ? '#ffffff' : '#3b232a',
              padding: '12px 16px',
              borderRadius: '16px',
              maxWidth: '85%',
              fontSize: '0.96rem',
              lineHeight: '1.5'
            }}
          >
            {m.text}
          </div>
        ))}
        {loading ? (
          <div style={{ alignSelf: 'flex-start', background: '#fbebf0', padding: '10px 14px', borderRadius: '16px', fontStyle: 'italic', color: '#7d5a65', fontSize: '0.9rem' }}>
            Reflexionando en oración con Gemini... 🕊️
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí lo que sentís o tus dudas sobre el servicio..."
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(154, 43, 75, 0.25)',
            outline: 'none',
            fontSize: '0.95rem'
          }}
        />
        <button type="submit" className="action-button" disabled={loading || !input.trim()}>
          Preguntar
        </button>
      </form>
    </div>
  );
}

function getCountdownParts(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, unlocked: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, unlocked: false };
}

export default function InviteClient({
  slug,
  publicInvitation
}: {
  slug: string;
  publicInvitation: PublicInvitation;
}) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState<ApiResponse | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const initialUnlockStatus = useMemo(() => {
    const unlockDate = new Date(publicInvitation.unlockAtArgentina);
    const realUnlocked = now >= unlockDate.getTime();
    return {
      unlocked: isPreview || realUnlocked,
      localFormatted: formatLocalDate(publicInvitation.unlockAtArgentina),
      countdown: getCountdownParts(publicInvitation.unlockAtArgentina)
    };
  }, [now, publicInvitation, isPreview]);

  const unlockStatus = useMemo(() => {
    const source = payload?.invitation ?? publicInvitation;
    const unlockDate = new Date(source.unlockAtArgentina);

    return {
      unlocked: isPreview || now >= unlockDate.getTime(),
      localFormatted: formatLocalDate(source.unlockAtArgentina)
    };
  }, [now, payload, publicInvitation, isPreview]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/invite/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = (await response.json()) as ApiResponse | { message?: string };

      if (!response.ok) {
        setPayload(null);
        setError('message' in data ? (data.message ?? 'Contraseña incorrecta.') : 'Contraseña incorrecta.');
        return;
      }

      setPayload(data as ApiResponse);
    } catch {
      setError('Ocurrió un error al validar el acceso.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!payload) return;

    setDownloadLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/pdf/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? 'No se pudo generar el PDF personalizado.');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `invitacion-servicio-${slug}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Ocurrió un error al descargar tu tarjeta PDF.');
    } finally {
      setDownloadLoading(false);
    }
  }

  const displayName = publicInvitation.nickname || 'Pau';

  return (
    <main className="page-shell">
      {isPreview ? (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span className="preview-pill">👁️ MODO CREADOR ACTIVO</span>
        </div>
      ) : null}

      {/* Seccion Teaser */}
      <section className="hero-card teaser-card">
        <p className="eyebrow">Un llamado en el momento justo</p>
        <h1>Querida {displayName}, Dios te llama a servir ✨</h1>
        <p className="hero-copy teaser-copy">
          En los tiempos perfectos de Dios, Él toca las puertas del corazón. Algo especial se está preparando para vos...
        </p>

        <div className="countdown-grid" aria-label="Cuenta regresiva">
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.days).padStart(2, '0')}</span>
            <small>Días</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.hours).padStart(2, '0')}</span>
            <small>Horas</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.minutes).padStart(2, '0')}</span>
            <small>Minutos</small>
          </div>
          <div className="countdown-box">
            <span>{String(initialUnlockStatus.countdown.seconds).padStart(2, '0')}</span>
            <small>Segundos</small>
          </div>
        </div>

        <div className="blur-actions">
          <button
            type="button"
            className="action-button"
            disabled={!initialUnlockStatus.unlocked}
            onClick={() => setShowAuth(true)}
          >
            🙏 Abrir Invitación al Servicio
          </button>
        </div>

        <div className={`status-pill ${initialUnlockStatus.unlocked ? 'open' : 'closed'}`}>
          {initialUnlockStatus.unlocked
            ? '✨ ¡Ya se encuentra disponible tu invitación!'
            : '⏳ Se habilita hoy a las 20:30 hs'}
        </div>
      </section>

      {/* Formulario de Contraseña */}
      {showAuth && !payload ? (
        <section className="hero-card">
          <p className="eyebrow">Acceso Personalizado</p>
          <h2>“En todo amar y servir” - San Ignacio</h2>
          <p className="hero-copy">Pau, ingresá la clave secreta que te compartimos para leer tu carta de discernimiento.</p>

          <form className="access-form" onSubmit={handleSubmit}>
            <label htmlFor="password">Contraseña Secreta</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresá tu clave (ej: PAU2026)"
              autoComplete="off"
            />
            <button type="submit" className="action-button" disabled={loading || password.trim().length === 0}>
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}
        </section>
      ) : null}

      {/* Contenido de la Invitación */}
      {payload ? (
        <section className="invitation-layout">
          <article className="invitation-card">
            <div className="invitation-header">
              <p className="eyebrow">Llamado al Servicio 2026</p>
              <h2>{payload.invitation.title}</h2>
              <blockquote>{payload.invitation.verse}</blockquote>
              <p className="verse-ref">{payload.invitation.verseRef}</p>
            </div>

            {/* Narrador de Carta por Voz */}
            <AudioNarrator text={payload.content.intro.join(' ')} />

            <div className="welcome-box">
              <p className="welcome-label">Llamada a entregar el corazón:</p>
              <p className="welcome-name">{payload.invitation.nombre}</p>
            </div>

            {payload.content.intro.map((paragraph, index) => (
              <p key={index} className="body-copy">
                {paragraph}
              </p>
            ))}

            {/* Video de The Chosen */}
            {payload.content.videoUrl ? (
              <div style={{ marginTop: '28px', marginBottom: '28px', textAlign: 'center' }}>
                <p className="eyebrow" style={{ marginBottom: '12px' }}>🎬 Reflexión: ¿Quieres seguirme?</p>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '18px', border: '1px solid #f3d0d9' }}>
                  <iframe
                    src={payload.content.videoUrl}
                    title="¿Quieres seguirme? (The Chosen Escena)"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            <section className="content-section">
              <h3>Objetivos del Servicio</h3>
              <ul>
                {payload.content.objetivos.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="content-section">
              <h3>Actividades del ÁREA DE COMUNIDAD</h3>
              <ul>
                {payload.content.actividades.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {payload.content.bloques.map((bloque, index) => (
              <section key={index} className="content-block">
                <h3>{bloque.titulo}</h3>
                {bloque.lema ? <p className="block-quote">{bloque.lema}</p> : null}
                {bloque.intro ? <p className="body-copy">{bloque.intro}</p> : null}
                {bloque.preguntas?.length ? (
                  <ul>
                    {bloque.preguntas.map((item, pIndex) => (
                      <li key={pIndex}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {bloque.nota ? <p className="note-box">{bloque.nota}</p> : null}
                {bloque.oracion?.length ? (
                  <div className="prayer-box">
                    {bloque.oracion.map((line, oIndex) => (
                      <p key={oIndex}>{line}</p>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}

            {/* Asistente de Discernimiento Ignaciano (Gemini) */}
            <DiscernmentAssistant />

            <section className="content-section final-prayer">
              {payload.content.cierre.map((line, index) => (
                <p key={index} className={index === 0 ? 'closing-title' : 'body-copy'}>
                  {line}
                </p>
              ))}

              {/* Botones Directos de WhatsApp a los Animadores */}
              {payload.content.animadores?.length ? (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {payload.content.animadores.map((animador) => (
                    <a
                      key={animador.nombre}
                      href={animador.waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="action-button"
                      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', textDecoration: 'none' }}
                    >
                      💬 Hablar con {animador.nombre}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          </article>

          {/* Panel Lateral */}
          <aside className="side-panel">
            <div className="side-card sticky-card">
              <p className="featured-quote">
                “Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti.”
              </p>
              <p className="featured-quote" style={{ fontSize: '0.95rem', color: '#701c35' }}>
                “Toda vocación es un don de Dios. Él llama en el momento justo.”
              </p>
            </div>

            <div className="side-card actions-card">
              <button
                type="button"
                className="action-button"
                disabled={downloadLoading}
                onClick={handleDownloadPdf}
              >
                {downloadLoading ? 'Generando PDF...' : '📄 Descargar Documento (PDF)'}
              </button>

              {payload.invitation.meetUrl ? (
                <a className="action-button secondary" href={payload.invitation.meetUrl} target="_blank" rel="noreferrer">
                  🎥 Encuentro de Discernimiento
                </a>
              ) : null}
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}