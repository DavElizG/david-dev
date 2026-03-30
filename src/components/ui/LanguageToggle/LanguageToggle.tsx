import { useLanguage } from '../../../context';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:opacity-70"
      style={{
        background: 'transparent',
        border: '1px solid var(--space-border)',
        color: 'var(--space-text-dim)',
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
};

export default LanguageToggle;
