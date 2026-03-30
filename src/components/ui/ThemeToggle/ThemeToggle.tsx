import { useState } from 'react';
import { useTheme } from '../../../context';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={(e) => toggleDarkMode(e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background:  'none',
        border:      'none',
        cursor:      'pointer',
        display:     'flex',
        alignItems:  'center',
        padding:     '4px 2px',
        opacity:     hovered ? 1 : 0.65,
        transition:  'opacity 0.3s, transform 0.3s',
        transform:   hovered ? 'rotate(20deg)' : 'rotate(0deg)',
        height:      16,
        color:       'var(--space-text-dim)',
      }}
    >
      {darkMode ? (
        /* Sun — currently dark, click to switch to light */
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--space-text-dim)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2"    x2="12" y2="4"    />
          <line x1="12" y1="20"   x2="12" y2="22"   />
          <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="2"  y1="12"   x2="4"  y2="12"   />
          <line x1="20" y1="12"   x2="22" y2="12"   />
          <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
          <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
        </svg>
      ) : (
        /* Moon — currently light, click to switch to dark */
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--space-text-dim)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
