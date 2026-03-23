import { useEffect, useRef, useState } from 'react';
import blackholeSfx from '../../../assets/images/sound/space-sounds-black-hole-time-travel.mp3';

const SoundToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn]     = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const audio  = new Audio(blackholeSfx);
    audio.loop   = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    // Try immediate autoplay; if blocked, fire on first user gesture
    const tryPlay = () => {
      audio.play()
        .then(() => setOn(true))
        .catch(() => {});
    };

    audio.play()
      .then(() => setOn(true))
      .catch(() => {
        document.addEventListener('click',     tryPlay, { once: true });
        document.addEventListener('keydown',   tryPlay, { once: true });
        document.addEventListener('scroll',    tryPlay, { once: true });
        document.addEventListener('touchstart',tryPlay, { once: true });
      });

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click',     tryPlay);
      document.removeEventListener('keydown',   tryPlay);
      document.removeEventListener('scroll',    tryPlay);
      document.removeEventListener('touchstart',tryPlay);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.pause();
      setOn(false);
    } else {
      audio.play().then(() => setOn(true)).catch(() => {});
    }
  };

  return (
    <>
      <style>{`
        @keyframes sb1 { 0%,100%{height:2px} 50%{height:9px}  }
        @keyframes sb2 { 0%,100%{height:6px} 50%{height:2px}  }
        @keyframes sb3 { 0%,100%{height:4px} 25%{height:10px} }
        @keyframes sb4 { 0%,100%{height:3px} 75%{height:8px}  }
      `}</style>

      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={on ? 'Mute' : 'Unmute ambient sound'}
        style={{
          background:  'none',
          border:      'none',
          cursor:      'pointer',
          display:     'flex',
          alignItems:  'center',
          gap:         2,
          padding:     '4px 2px',
          opacity:     hovered ? 1 : on ? 0.65 : 0.3,
          transition:  'opacity 0.3s',
          height:      16,
        }}
      >
        {on ? (
          /* Animated waveform bars */
          <>
            {[
              { anim: 'sb1 0.9s  ease-in-out infinite',        h: 2  },
              { anim: 'sb2 0.7s  ease-in-out infinite 0.1s',   h: 6  },
              { anim: 'sb3 0.8s  ease-in-out infinite 0.2s',   h: 4  },
              { anim: 'sb4 0.75s ease-in-out infinite 0.05s',  h: 3  },
            ].map((b, i) => (
              <div key={i} style={{
                width:        2,
                height:       b.h,
                borderRadius: 1,
                background:   'var(--space-text-dim)',
                animation:    b.anim,
                alignSelf:    'center',
              }} />
            ))}
          </>
        ) : (
          /* Speaker muted icon */
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="var(--space-text-dim)" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9"  x2="17" y2="15" />
            <line x1="17" y1="9"  x2="23" y2="15" />
          </svg>
        )}
      </button>
    </>
  );
};

export default SoundToggle;
