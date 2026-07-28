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
    bloques: Array<{
      titulo: string;
      lema?: string;
      intro?: string;
      preguntas?: string[];
      nota?: string;
      oracion?: string[];
    }>;
    cierre: string[];
  };
};

type PublicInvitation = {
  nombre: string;
  nickname?: string;
  unlockAtArgentina: string;
  unlockAtArgentinaFormatted: string;
};

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
  const isPreview = searchParams.get('preview') === 'true'; // Modo Creador

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
          <span className="preview-pill">👁️ MODO CREADOR ACTIVO (Previsualización Desbloqueada)</span>
        </div>
      ) : null}

      {/* Tarjeta Teaser / Cuenta Regresiva */}
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

        <div style={{ marginTop: '24px' }}>
          <p className="featured-quote">
            “Dios no elige a los preparados, prepara con amor a los elegidos.”
          </p>
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

      {/* Carta e Invitación Completa */}
      {payload ? (
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