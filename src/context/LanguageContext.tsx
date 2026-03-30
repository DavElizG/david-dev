import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { es, en } from '../i18n/translations';

gsap.registerPlugin(ScrambleTextPlugin);

export type Language = 'es' | 'en';
type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { es, en };

const TEXT_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,button,label,a,span';
const STAMP_ATTR = 'data-lang-old';

/**
 * Stamp every visible leaf text element with its current text in a data attribute.
 * Kill any active GSAP tweens first so textContent reflects the settled final value.
 */
function stampTextElements() {
  document.querySelectorAll<HTMLElement>(TEXT_SELECTOR).forEach((el) => {
    // Skip elements that contain other major block elements (they aren't leaves)
    if (el.querySelector('h1,h2,h3,h4,h5,h6,p,div,section,article,nav,main')) return;
    // Kill any running GSAP animation (e.g. a previous scramble still in progress)
    gsap.killTweensOf(el);
    const txt = el.textContent?.trim();
    if (!txt || txt.length > 300) return;
    el.setAttribute(STAMP_ATTR, txt);
  });
}

/**
 * After React re-render: find all stamped elements, compare old→new text,
 * scramble those that changed, then clean up the stamps.
 */
function scrambleStampedElements() {
  const stamped = document.querySelectorAll<HTMLElement>(`[${STAMP_ATTR}]`);
  let idx = 0;

  stamped.forEach((el) => {
    const oldText = el.getAttribute(STAMP_ATTR) ?? '';
    el.removeAttribute(STAMP_ATTR);

    const newText = el.textContent?.trim() ?? '';
    if (newText === oldText || !newText) return;

    // Kill any leftover tweens, then run text-only scramble (no opacity change
    // to avoid conflicting with scroll-driven opacity animations)
    gsap.killTweensOf(el);
    gsap.to(el, {
      duration: 0.45 + Math.random() * 0.3,
      delay: Math.min(idx * 0.02, 0.4),
      scrambleText: {
        text: newText,
        chars: 'upperAndLowerCase',
        revealDelay: 0.12,
        speed: 0.85,
      },
    });
    idx++;
  });

  // Clean any remaining stamps that didn't match
  document.querySelectorAll<HTMLElement>(`[${STAMP_ATTR}]`).forEach((el) => {
    el.removeAttribute(STAMP_ATTR);
  });
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageRaw] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'es') return stored;
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'es' ? 'es' : 'en';
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useMemo(() => translations[language], [language]);

  const setLanguage = useCallback(
    (newLang: Language) => {
      if (newLang === language) return;

      // Stamp elements BEFORE React re-renders with new text
      stampTextElements();

      // Update state → triggers re-render
      setLanguageRaw(newLang);

      // After React paints the new text, scramble elements whose text changed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrambleStampedElements();
        });
      });
    },
    [language],
  );

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
