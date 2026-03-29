import React from 'react';
import type { JourneyEntry } from './journey.types';
import { ACCENT, ACCENT2, TEXT, TEXT_DIM } from './journey.constants';

interface EntryPanelProps {
  entry:   JourneyEntry;
  index:   number;
  darkMode: boolean;
}

const EntryPanel = React.forwardRef<HTMLDivElement, EntryPanelProps>(
  ({ entry, index, darkMode }, ref) => {
    const isEdu       = entry.type === 'education';
    const dotColor    = isEdu ? ACCENT : ACCENT2;
    const cardBg      = darkMode
      ? 'linear-gradient(135deg, rgba(0,0,5,0.78) 0%, rgba(0,0,5,0.55) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.75) 100%)';
    const cardBorder  = darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)';
    const badgeBg     = isEdu
      ? (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')
      : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)');
    const badgeBorder = isEdu
      ? (darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)')
      : (darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)');
    const tagBg       = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    const tagBorder   = darkMode ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.10)';
    const numColor    = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';

    return (
      <div
        ref={ref}
        className="journey-panel"
        style={{
          width:          '100vw',
          height:         '100vh',
          flexShrink:     0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
          zIndex:         10,
        }}
      >
        {/* Content card */}
        <div style={{
          width:               'min(72vw, 700px)',
          background:          cardBg,
          backdropFilter:      'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border:              cardBorder,
          borderRadius:        '16px',
          padding:             'clamp(2rem, 4vw, 3.5rem)',
        }}>
          {/* Meta row */}
          <div
            className="jt-meta"
            style={{
              display:      'flex',
              alignItems:   'center',
              flexWrap:     'wrap',
              gap:          '0.75rem',
              marginBottom: '1.8rem',
            }}
          >
            <span style={{
              fontSize:      '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color:          dotColor,
              background:    badgeBg,
              border:        `1px solid ${badgeBorder}`,
              padding:       '4px 14px',
              borderRadius:  '999px',
            }}>
              {isEdu ? 'Educación' : 'Experiencia'}
            </span>
            <span style={{
              fontSize:           '0.85rem',
              color:               TEXT_DIM,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {entry.period}
            </span>
          </div>

          {/* Org name */}
          <p
            className="jt-org"
            style={{
              fontSize:     'clamp(0.9rem, 1.4vw, 1.05rem)',
              color:         TEXT_DIM,
              fontWeight:   500,
              margin:       0,
            }}
            dangerouslySetInnerHTML={{ __html: entry.org }}
          />

          {/* Title */}
          <h3
            className="jt-title"
            style={{
              fontSize:             'clamp(1.6rem, 3vw, 2.8rem)',
              fontWeight:           700,
              lineHeight:           1.1,
              margin:               '0.8rem 0 1.4rem',
              background:           'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            {entry.title}
          </h3>

          {/* Location */}
          <p style={{
            fontSize:     '0.85rem',
            color:         TEXT_DIM,
            marginBottom: '1.2rem',
            display:      'flex',
            alignItems:   'center',
            gap:          '0.4rem',
          }}>
            <span aria-hidden>📍</span>
            <span>{entry.location}</span>
          </p>

          {/* Description */}
          <p
            className="jt-desc"
            style={{
              fontSize:     'clamp(0.9rem, 1.3vw, 1rem)',
              lineHeight:   1.8,
              color:         TEXT,
              opacity:      0.85,
              marginBottom: '1.2rem',
            }}
            dangerouslySetInnerHTML={{ __html: entry.description }}
          />

          {/* Tech tags */}
          {entry.tags.length > 0 && (
            <div
              className="jt-tags"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}
            >
              {entry.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize:     '0.78rem',
                    padding:      '4px 13px',
                    borderRadius: '999px',
                    background:   tagBg,
                    color:         ACCENT,
                    border:       tagBorder,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Panel number watermark */}
        <span style={{
          position:      'absolute',
          top:           '3vh',
          right:         '4vw',
          fontSize:      'clamp(6rem, 18vw, 14rem)',
          fontWeight:    700,
          color:          numColor,
          lineHeight:    1,
          pointerEvents: 'none',
          zIndex:        -1,
        }}>
          {index + 1}
        </span>
      </div>
    );
  }
);

EntryPanel.displayName = 'EntryPanel';
export default EntryPanel;
