import { About, SoftSkills, TechSkills, Languages, Education, Experience } from '../../components/sections';
import { usePersonalInfo } from '../../hooks';
import { useTheme } from '../../context';
import { SEO } from '../../components/common';

const AboutPage = () => {
  const { darkMode } = useTheme();
  const { loading: personalLoading } = usePersonalInfo();

  // Estado de carga compartido por todos los componentes
  const isLoading = personalLoading;

  return (
    <>
      <SEO 
        title="Sobre mí | Jose Guadamuz - Desarrollador Web"
        description="Conoce más sobre mi trayectoria profesional, habilidades técnicas, educación y experiencia como desarrollador web full stack especializado en React y .NET."
        keywords="desarrollador web, sobre mí, experiencia profesional, educación, habilidades técnicas, Jose Guadamuz, react, typescript"
        ogTitle="Sobre Jose Guadamuz | Desarrollador Web Full Stack"
      />
      
      <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="container mx-auto px-6">
          {/* Componente About */}
          <div className="mb-20">
            <About />
          </div>
          
          {/* Componente SoftSkills */}
          <SoftSkills />
          
          {/* Componente TechSkills */}
          <TechSkills isLoading={isLoading} />

          {/* Componente Languages */}
          <Languages isLoading={isLoading} />

          {/* Componente Education */}
          <Education isLoading={isLoading} />

          {/* Componente Experience */}
          <Experience isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default AboutPage;