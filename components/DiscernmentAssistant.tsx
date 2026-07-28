'use client';

import { useState } from 'react';

export default function DiscernmentAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: '¡Hola, Pau! 🕊️ Soy tu espacio de acompañamiento. Si sentís alguna duda, moción, miedo o alegría sobre este llamado a servir, podés contarme acá para que lo reflexionemos juntos a la luz de San Ignacio.'
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
          text: 'Hubo un inconveniente al conectar. No dudes en consultarlo en oración o charlarlo directo con Emma o Carla 💕.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-section" style={{ marginTop: '32px' }}>
      <h3 style={{ color: '#701c35', textAlign: 'center' }}>🕊️ Espacio de Discernimiento Ignaciano (con IA)</h3>
      <p className="body-copy" style={{ fontStyle: 'italic', fontSize: '0.95rem', textAlign: 'center' }}>
        “Examinar los movimientos del alma con paz y libertad”
      </p>

      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '18px',
          border: '1px solid #f3d0d9',
          maxHeight: '350px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '14px'
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? '#9a2b4b' : '#fbebf0',
              color: m.role === 'user' ? '#fff' : '#3b232a',
              padding: '12px 16px',
              borderRadius: '16px',
              maxWidth: '85%',
              fontSize: '0.98rem',
              lineHeight: '1.5'
            }}
          >
            {m.text}
          </div>
        ))}
        {loading ? (
          <div style={{ alignSelf: 'flex-start', background: '#fbebf0', padding: '10px 14px', borderRadius: '16px', fontStyle: 'italic', color: '#7d5a65' }}>
            Reflexionando en oración... 🕊️
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: Siento ganas pero me da miedo no tener tiempo..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(154, 43, 75, 0.25)',
            outline: 'none'
          }}
        />
        <button type="submit" className="action-button" disabled={loading || !input.trim()}>
          Preguntar
        </button>
      </form>
    </div>
  );
}