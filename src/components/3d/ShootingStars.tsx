/**
 * ShootingStars.tsx — fixed-position CSS shooting-star overlay.
 *
 * 8 stars placed across the upper viewport at varied positions,
 * durations and delays.  Each runs the `shoot` keyframe defined
 * in index.css — only ~8% of each cycle is the actual streak,
 * so stars fire sporadically and never sync up.
 *
 * z-index: 0 → sits just above the aurora blobs but below all content.
 */

/* duration × each-delay = unique timing so all 8 stay out of sync */
const STARS = [
  { top:  '8%', left: '12%', width: 170, duration: 14, delay:  0    },
  { top: '14%', left: '58%', width: 130, duration: 17, delay:  4.5  },
  { top:  '4%', left: '80%', width: 210, duration: 12, delay:  8    },
  { top: '26%', left:  '6%', width: 150, duration: 19, delay:  2    },
  { top: '20%', left: '44%', width: 185, duration: 16, delay: 11    },
  { top: '38%', left: '70%', width: 115, duration: 21, delay:  6    },
  { top: '10%', left: '30%', width: 160, duration: 13, delay: 15    },
  { top: '48%', left:  '2%', width: 135, duration: 18, delay:  9.5  },
] as const;

const ShootingStars = () => (
  <div
    aria-hidden
    style={{
      position:      'fixed',
      inset:         0,
      overflow:      'hidden',
      pointerEvents: 'none',
      zIndex:        1, // above section black backgrounds (z-index:auto) but below content wrapper (z-index:10)
    }}
  >
    {STARS.map((s, i) => (
      <div
        key={i}
        className="shooting-star"
        style={{
          top:               s.top,
          left:              s.left,
          width:             `${s.width}px`,
          animationDuration: `${s.duration}s`,
          animationDelay:    `-${s.delay}s`, // negative = already mid-cycle on first render
        }}
      />
    ))}
  </div>
);

export default ShootingStars;
