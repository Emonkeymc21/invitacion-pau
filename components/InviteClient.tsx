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

/* --- Widget Flotante de IA de Discernimiento --- */
function FloatingDiscernmentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: '¡Hola, Pau! 🕊️ Soy tu espacio de acompañamiento. Si sentís alguna duda, inquietud o alegría sobre este llamado a servir, podés escribirme acá para que lo reflexionemos juntos a la luz de San Ignacio.'
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
      const res = await fetch('/api/discernment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Hubo un inconveniente al conectar. No dudes en consultarlo en oración o charlarlo directo con Emma o Carla 💕.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón Flotante */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #701c35 0%, #9a2b4b 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '999px',
          padding: '14px 20px',
          boxShadow: '0 8px 24px rgba(112, 28, 53, 0.4)',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {isOpen ? '✕ Cerrar Chat' : '🕊️ Discernir con IA'}
      </button>

      {/* Ventana Emergente Modal Optimizado */}
      {isOpen ? (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '16px',
            left: '16px',
            maxWidth: '420px',
            margin: '0 auto',
            height: '480px',
            maxHeight: '75vh',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
            border: '1px solid #f3d0d9',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              background: '#fbebf0',
              borderBottom: '1px solid #f3d0d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <strong style={{ color: '#701c35', fontSize: '0.95rem', display: 'block' }}>🕊️ Acompañamiento Ignaciano</strong>
              <small style={{ color: '#7d5a65', fontSize: '0.78rem' }}>En todo amar y servir</small>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#701c35', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#9a2b4b' : '#fbebf0',
                  color: m.role === 'user' ? '#ffffff' : '#3b232a',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  maxWidth: '88%',
                  fontSize: '0.9rem',
                  lineHeight: '1.45'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading ? (
              <div style={{ alignSelf: 'flex-start', background: '#fbebf0', padding: '8px 12px', borderRadius: '14px', fontStyle: 'italic', color: '#7d5a65', fontSize: '0.85rem' }}>
                Reflexionando en oración... 🕊️
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid #f3d0d9', display: 'flex', gap: '8px', background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí lo que sentís..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(154, 43, 75, 0.3)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#9a2b4b',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      ) : null}
    </>
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
    <main className="page-shell" style={{ paddingBottom: payload ? '80px' : '32px' }}>
      {isPreview ? (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span className="preview-pill">👁️ MODO CREADOR ACTIVO</span>
        </div>
      ) : null}

      {/* Sección Teaser */}
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
        <>
          <section className="invitation-layout">
            <article className="invitation-card">
              <div className="invitation-header">
                <p className="eyebrow">Llamado al Servicio 2026</p>
                <h2>{payload.invitation.title}</h2>
                <blockquote>{payload.invitation.verse}</blockquote>
                <p className="verse-ref">{payload.invitation.verseRef}</p>
              </div>

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
                        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', textDecoration: 'none', minWidth: '220px' }}
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
              </div>
            </aside>
          </section>

          {/* Widget Flotante de IA de Preguntas */}
          <FloatingDiscernmentWidget />
        </>
      ) : null}
    </main>
  );
}