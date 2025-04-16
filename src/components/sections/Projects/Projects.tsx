import { useProjects } from '../../../hooks';
import { useTheme } from '../../../context';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const { darkMode } = useTheme();

  return (
    <section id="projects" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Mis Proyectos
        </h2>

        {loading ? (
          <p className="text-center">Cargando proyectos...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id_project} 
                className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300
                  ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className={`h-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  {/* Placeholder para la imagen */}
                  <div className={`w-full h-full flex items-center justify-center 
                    ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {project.title}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => (
                      <button 
                        key={index}
                        onClick={() => window.open(getTechDocUrl(tech), '_blank', 'noopener,noreferrer')}
                        className={`flex items-center px-3 py-1 text-sm rounded-full transition-transform hover:scale-105 cursor-pointer
                          ${darkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      >
                        <span className="mr-1.5">
                          {getTechIcon(tech, darkMode, 20)}
                        </span>
                        {tech}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center transition-colors
                        ${darkMode 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-700 hover:text-blue-600'}`}
                    >
                      <FaGithub className="mr-2" /> 
                      <span>Repositorio</span>
                    </a>
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center transition-colors
                        ${darkMode 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-700 hover:text-blue-600'}`}
                    >
                      <span>Demo</span>
                      <FaExternalLinkAlt className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;