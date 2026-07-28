'use client';

import { useState } from 'react';

export default function AudioNarrator({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  function toggleSpeech() {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la lectura por voz.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-AR';
      utterance.rate = 0.9; // Lectura pausada y cálida

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }

  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
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