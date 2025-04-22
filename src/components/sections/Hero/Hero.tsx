import { usePersonalInfo } from '../../../hooks';
import { useTheme } from '../../../context';

const Hero = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();

  return (
    <section id="hero" className={`py-20 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {personalInfo?.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {personalInfo?.title}
          </p>
          <p className="max-w-2xl mx-auto text-lg">
            {personalInfo?.bio}
          </p>
        </>
      )}
    </section>
  );
};

export default Hero;