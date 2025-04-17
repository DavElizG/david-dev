import { useProjects } from '../../../hooks';
import { useTheme } from '../../../context';
import { Link } from 'react-router-dom';
import ProjectCard from '../../../components/common/ProjectCard';
import { motion } from 'framer-motion';

interface ProjectsProps {
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ featured = false }) => {
  const { projects, loading, error } = useProjects();
  const { darkMode } = useTheme();

  // Filtrar proyectos destacados si es necesario
  const displayedProjects = featured 
    ? projects?.filter(project => project.featured).slice(0, 3) 
    : projects;

  // Animaciones de entrada para los proyectos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="projects" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {featured ? 'Proyectos Destacados' : 'Mis Proyectos'}
          </h2>

          {featured && (
            <p className={`text-center mb-12 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Estos son algunos de mis proyectos más relevantes. Puedes ver todos mis proyectos haciendo click en el botón de abajo.
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedProjects?.map((project) => (
                <motion.div 
                  key={project.id_project}
                  variants={itemVariants}
                >
                  <ProjectCard
                    id={project.id_project}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    repoUrl={project.repoUrl}
                    liveUrl={project.liveUrl}
                    darkMode={darkMode}
                    image={project.image}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Botón para ver todos los proyectos (solo en modo featured) */}
            {featured && (
              <motion.div 
                className="mt-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  to="/projects"
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Ver todos los proyectos
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;