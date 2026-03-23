import { useRef } from 'react';
import { useHoverSplitText } from '../../../hooks';
import './HoverButton.css';

interface HoverButtonProps {
  label: string;
  hoverLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * HoverButton — full double-layer SplitText hover effect.
 *
 * On hover:
 *   - Primary chars scatter upward (random y per char)
 *   - White fill slides up from below
 *   - Hover chars assemble from scattered positions to y=0 (dark text on white)
 */
const HoverButton = ({
  label,
  hoverLabel,
  type = 'button',
  disabled,
  onClick,
  className = '',
}: HoverButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  useHoverSplitText(btnRef, { amplitude: 22 });

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`hover-btn ${className}`}
    >
      <span className="hover-btn__inner">
        <span className="hover-split__text">{label}</span>
        <span className="hover-split__hover" aria-hidden="true">
          {hoverLabel ?? label}
        </span>
      </span>
    </button>
  );
};

export default HoverButton;
