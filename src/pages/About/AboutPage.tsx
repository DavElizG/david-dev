import { About } from '../../components/sections';
import { useEducation, useExperience, useLanguages, usePersonalInfo, useSkills } from '../../hooks';
import { useTheme } from '../../context';
import profileImage from '../../assets/images/profile/FB_IMG_1731451105768.webp';
import { getTechIcon, getTechDocUrl } from '../../utils/iconUtils';

const AboutPage = () => {
  const { darkMode } = useTheme();
  const { loading: personalLoading } = usePersonalInfo();
  const { skills, loading: skillsLoading } = useSkills();
  const { languages, loading: languagesLoading } = useLanguages();
  const { education, loading: educationLoading } = useEducation();
  const { experience, loading: experienceLoading } = useExperience();

  const isLoading = personalLoading || skillsLoading || languagesLoading || educationLoading || experienceLoading;

  return (
    <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-6">
        {/* Banner de presentación con nuevo diseño vertical */}
        <div className="mb-20">
          <div className={`rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
            {/* Imagen centrada circular y más pequeña en la parte superior */}
            <div className="mb-10 flex justify-center">
              <div className={`relative overflow-hidden rounded-full ${darkMode ? 'ring-4 ring-blue-500/40' : 'ring-4 ring-blue-600/40'} shadow-xl w-48 h-48`}>
                <img 
                  src={profileImage} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl font-bold mb-8 text-center">Sobre mí</h1>
            
            {/* Contenido informativo */}
            <div className="prose prose-lg max-w-none">
              <About />
            </div>
          </div>
        </div>
        
        {/* Sección de Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Habilidades</h2>
          {isLoading ? (
            <p>Cargando habilidades...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills?.map((skill, index) => (
                <div key={index} className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-shadow duration-300`}>
                  <h3 className="text-xl font-semibold mb-3">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={item.url || getTechDocUrl(item.name)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}
                        title={`Ver documentación de ${item.name}`}
                      >
                        <span className="text-base">
                          {getTechIcon(item.name, darkMode, 16)}
                        </span>
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección de Idiomas - movida después de las habilidades */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Idiomas</h2>
          {isLoading ? (
            <p>Cargando idiomas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages?.map((lang, index) => (
                <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-xl font-semibold mb-2">{lang.name}</h3>
                  <p>Nivel: {lang.level}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección de Educación */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Educación</h2>
          {isLoading ? (
            <p>Cargando educación...</p>
          ) : (
            <div className="space-y-6">
              {education?.map((edu, index) => (
                <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-lg mb-2">{edu.institution}</p>
                  <p className="text-sm mb-2">{edu.location}</p>
                  <p className="mb-2 opacity-80">{`${edu.startDate} - ${edu.endDate}`}</p>
                  <p>{edu.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección de Experiencia */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Experiencia</h2>
          {isLoading ? (
            <p>Cargando experiencia...</p>
          ) : (
            <div className="space-y-6">
              {experience?.map((exp, index) => (
                <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <span className="text-sm opacity-80">{`${exp.startDate} - ${exp.endDate}`}</span>
                  </div>
                  <p className="text-lg mb-2">{exp.company}</p>
                  <p className="text-sm mb-2">{exp.location}</p>
                  <p>{exp.description}</p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Tecnologías:</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span 
                            key={idx} 
                            className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;