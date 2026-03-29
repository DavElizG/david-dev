import React from 'react';
import type { JourneyEntry } from './journey.types';
import { ACCENT, ACCENT2 } from './journey.constants';

interface TrackLineProps {
  entries:       JourneyEntry[];
  totalPanels:   number;
  darkMode:      boolean;
  isLoading:     boolean;
  cursorRef:     React.RefObject<HTMLDivElement>;
  onMarkerMount: (index: number, el: HTMLDivElement | null) => void;
}

const TrackLine = React.forwardRef<HTMLDivElement, TrackLineProps>(
  ({ entries, totalPanels, darkMode, isLoading, cursorRef, onMarkerMount }, ref) => (
    <div
      ref={ref}
      style={{
        position:      'absolute',
        bottom:        '6vh',
        left:          '10vw',
        right:         '10vw',
        height:        '40px',
        zIndex:        20,
        pointerEvents: 'none',
        display:       isLoading ? 'none' : 'block',
      }}
    >
      {/* Track line */}
      <div style={{
        position:   'absolute',
        top:        '50%',
        left:       0,
        right:      0,
        height:     '1px',
        background: darkMode
          ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, transparent 100%)'
          : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.15) 90%, transparent 100%)',
      }} />

      {/* Cursor orb */}
      <div
        ref={cursorRef}
        style={{
          position:      'absolute',
          top:           '50%',
          left:          0,
          width:         '22px',
          height:        '22px',
          borderRadius:  '50%',
          background:    darkMode
            ? 'radial-gradient(circle, #ffffff 0%, #d4d4d4 55%, transparent 100%)'
            : 'radial-gradient(circle, #1a1a1a 0%, #555555 55%, transparent 100%)',
          boxShadow:     darkMode
            ? '0 0 10px 3px rgba(255,255,255,0.55), 0 0 28px 8px rgba(255,255,255,0.2)'
            : '0 0 10px 3px rgba(0,0,0,0.4), 0 0 28px 8px rgba(0,0,0,0.15)',
          opacity:       0,
          pointerEvents: 'none',
          zIndex:        25,
        }}
      />

      {/* Marker dots */}
      {entries.map((entry, i) => {
        const isEdu   = entry.type === 'education';
        const leftPct = ((i + 1) / totalPanels) * 100;
        return (
          <div
            key={entry.id}
            ref={el => onMarkerMount(i, el)}
            style={{
              position:      'absolute',
              left:          `${leftPct}%`,
              top:           '50%',
              transform:     'translate(-50%, -50%)',
              width:         '12px',
              height:        '12px',
              borderRadius:  '50%',
              background:    isEdu ? ACCENT : ACCENT2,
              boxShadow:     `0 0 10px 2px ${isEdu ? 'rgba(220,220,220,0.5)' : 'rgba(140,140,140,0.5)'}`,
              border:        `2px solid ${isEdu ? 'rgba(210,210,210,0.4)' : 'rgba(130,130,130,0.4)'}`,
              opacity:       0.35,
              zIndex:        5,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  )
);

TrackLine.displayName = 'TrackLine';
export default TrackLine;
