import { ACCENT, ACCENT2, TEXT_DIM } from './journey.constants';

const IntroPanel = () => (
  <div
    className="journey-panel"
    style={{
      width:          '100vw',
      height:         '100vh',
      flexShrink:     0,
      display:        'flex',
      flexDirection:  'column',
      justifyContent: 'center',
      padding:        '0 8vw',
      position:       'relative',
      zIndex:         10,
    }}
  >
    <span style={{
      display:       'block',
      fontSize:      '0.72rem',
      textTransform: 'uppercase',
      letterSpacing: '0.24em',
      color:          ACCENT,
      marginBottom:  '1.5rem',
    }}>
      Mi historia
    </span>

    <h2 style={{
      fontSize:             'clamp(2.5rem, 6vw, 5rem)',
      fontWeight:           700,
      background:           'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 55%, var(--space-accent-2) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor:  'transparent',
      backgroundClip:       'text',
      maxWidth:             '14ch',
      lineHeight:           1.1,
      margin:               0,
    }}>
      Educación &amp; Experiencia
    </h2>

    <p style={{
      marginTop:  '2rem',
      fontSize:   '1rem',
      color:       TEXT_DIM,
      maxWidth:   '38ch',
      lineHeight: 1.7,
    }}>
      Scroll para explorar mi trayectoria académica y profesional.
    </p>

    <div style={{
      marginTop:  '4rem',
      display:    'flex',
      alignItems: 'center',
      gap:        '0.6rem',
      color:       ACCENT2,
      fontSize:   '0.8rem',
    }}>
      <span>→</span>
      <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
    </div>
  </div>
);

export default IntroPanel;
