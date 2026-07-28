'use client';

import { useEffect, useRef, useState } from 'react';

const MUSIC_VIDEO_ID = 'oEQbnOY-vII';
const STORAGE_KEY = 'invite_music_playing';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if (window.YT?.Player) return resolve();

    const existing = document.querySelector('script[data-yt-iframe]') as HTMLScriptElement | null;
    if (existing) {
      const timer = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(timer);
          resolve();
        }
      }, 80);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.dataset.ytIframe = '1';
    document.head.appendChild(tag);

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const timer = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

export default function MusicControl() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const shouldPlay = window.localStorage.getItem(STORAGE_KEY) === '1';
    setPlaying(shouldPlay);

    let mounted = true;

    (async () => {
      await loadYouTubeIframeAPI();
      if (!mounted) return;

      const host = document.getElementById('yt-music-host');
      if (!host) return;

      if (playerRef.current) {
        setReady(true);
        return;
      }

      playerRef.current = new window.YT.Player('yt-music-host', {
        height: '0',
        width: '0',
        videoId: MUSIC_VIDEO_ID,
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
          loop: 1,
          playlist: MUSIC_VIDEO_ID
        },
        events: {
          onReady: () => {
            try {
              playerRef.current.setVolume(70);
            } catch {}
            setReady(true);
            if (shouldPlay) {
              try {
                playerRef.current.playVideo();
              } catch {}
            }
          },
          onStateChange: (event: any) => {
            if (event?.data === window.YT.PlayerState.ENDED) {
              try {
                playerRef.current.playVideo();
              } catch {}
            }
          }
        }
      });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function toggleMusic() {
    if (!ready || !playerRef.current) return;

    setPlaying((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');

      try {
        if (next) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch {}

      return next;
    });
  }

  return (
    <>
      <div id="yt-music-host" style={{ display: 'none' }} />
      <button
        type="button"
        onClick={toggleMusic}
        className="music-fab"
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        <span className="music-fab-icon">{playing ? '❚❚' : '▶'}</span>
        <span className="music-fab-label">Música</span>
      </button>
    </>
  );
}
