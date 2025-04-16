import { useSkills, useLanguages } from '../../../hooks';
import { useTheme } from '../../../context';
import { useState } from 'react';
import { getTechIcon } from '../../../utils/iconUtils';

const Skills = () => {
  const { skills, loading: skillsLoading } = useSkills();
  const { languages, loading: languagesLoading } = useLanguages();
  const { darkMode } = useTheme();
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  const isLoading = skillsLoading || languagesLoading;

  return (
    <section id="skills" className={`py-16 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Mis Habilidades
        </h2>

        {isLoading ? (
          <p className="text-center">Cargando habilidades...</p>
        ) : (
          <>
            <div className="mb-16">
              {skills && skills.map((category) => (
                <div key={category.id_skill} className="mb-10">
                  <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {category.items && category.items.map((tech) => (
                      <div 
                        key={tech.id_tech} 
                        className={`flex flex-col items-center p-4 rounded-lg ${
                          activeSkill === tech.id_tech
                            ? `transform scale-105 ${darkMode ? 'bg-gray-600' : 'bg-blue-50'} shadow-lg`
                            : `${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`
                        } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                        onMouseEnter={() => setActiveSkill(tech.id_tech)}
                        onMouseLeave={() => setActiveSkill(null)}
                        onClick={() => tech.url && window.open(tech.url, '_blank', 'noopener,noreferrer')}
                      >
                        <div className="text-4xl mb-3">
                          {tech.icon ? getTechIcon(tech.icon, darkMode) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {tech.name ? tech.name.charAt(0).toUpperCase() : "T"}
                            </div>
                          )}
                        </div>
                        <h4 className={`font-medium text-center ${
                          activeSkill === tech.id_tech 
                            ? `${darkMode ? 'text-blue-300' : 'text-blue-700'}`
                            : ''
                        }`}>
                          {tech.name || "Tecnología"}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {languages && languages.length > 0 && (
              <div>
                <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Idiomas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {languages.map((language) => (
                    <div 
                      key={language.id_language} 
                      className={`p-5 rounded-lg shadow-md ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                      }`}
                    >
                      <h4 className="font-semibold text-lg">{language.name}</h4>
                      <div className="mt-2">
                        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-600">
                          <div 
                            className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ${
                              language.level === 'Nativo' ? 'w-full' : 
                              language.level === 'Avanzado' ? 'w-[90%]' :
                              language.level === 'Intermedio' ? 'w-[60%]' : 
                              language.level === 'Básico' ? 'w-[30%]' : 'w-[45%]'
                            }`}
                          ></div>
                        </div>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {language.level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Skills;